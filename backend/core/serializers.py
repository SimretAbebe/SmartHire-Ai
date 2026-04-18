from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

# Best practice to import User model safely
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # Write only ensures password is never exposed in responses!
    password = serializers.CharField(write_only=True)
    
    # Safely allow these from arbitrary payloads natively if role != agent
    fayda_id = serializers.CharField(required=False, allow_blank=True)
    tin_number = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    gender = serializers.CharField(required=False, allow_blank=True)
    profile_photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('name', 'phone', 'password', 'role', 'fayda_id', 'tin_number', 'age', 'gender', 'profile_photo')

    def validate(self, data):
        role = data.get('role')
        
        # Branch validation logic securely requiring explicitly provided fields exclusively for Agents
        if role == 'agent':
            fayda_id = data.get('fayda_id')
            tin_number = data.get('tin_number')
            
            if not fayda_id or not tin_number:
                raise serializers.ValidationError({"error": "Agents must explicitly provide both Fayda ID and TIN number to sign up."})
                
            from .utils import validate_fayda_id, is_valid_ethiopian_tin
            
            # Utilize Verhoeff verification securely
            if not validate_fayda_id(fayda_id):
                raise serializers.ValidationError({"fayda_id": "Invalid Fayda ID provided."})
                
            # Utilize the mathematical parity checksum
            if not is_valid_ethiopian_tin(tin_number):
                raise serializers.ValidationError({"tin_number": "Invalid TIN number provided."})
                
        return data

    def create(self, validated_data):
        # We explicitly use create_user here to hash the password securely 
        user = User.objects.create_user(
            phone=validated_data['phone'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data['role'],
            fayda_id=validated_data.get('fayda_id'),
            tin_number=validated_data.get('tin_number'),
            age=validated_data.get('age'),
            gender=validated_data.get('gender'),
            profile_photo=validated_data.get('profile_photo')
        )
        return user

class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        phone = data.get("phone")
        password = data.get("password")

        # Validate that both parameters were actually provided
        if phone and password:
            # Authenticate natively hits the internal Django auth hash verification
            user = authenticate(request=self.context.get('request'), phone=phone, password=password)
            if not user:
                # If credentials mismatch, raise an explicit validation error returning a JSON 400
                raise serializers.ValidationError("Invalid credentials provided.")
        else:
            raise serializers.ValidationError("Must provide both 'phone' and 'password'.")

        # Store validated user so view can extract it easily
        data['user'] = user
        return data

# Map frontend values identically skipping internal relations implicitly populated (like 'user' or 'created_by')
from .models import MaidProfile, JobPosting

# MaidProfile Serializer handling explicit 'user_id' inputs
class MaidProfileSerializer(serializers.ModelSerializer):
    # Maps incoming JSON {"user_id": 2} -> maps to 'user' foreign key cleanly
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )

    class Meta:
        model = MaidProfile
        fields = ['id', 'user_id', 'skills', 'location', 'city', 'region', 'availability', 'salary', 'fayda_id', 'created_by']
        # Read-only because the View will explicitly assign 'created_by' from request token!
        read_only_fields = ['created_by']

# Job Posting Serializer handling output structure and explicit 'user_id' mapping
class JobPostingSerializer(serializers.ModelSerializer):
    # Similar to above, accepts JSON {"user_id": 1} seamlessly
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )

    class Meta:
        model = JobPosting
        # Returning these mapped fields via GET json requirement
        fields = ['id', 'user_id', 'required_skills', 'location', 'salary']
