from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

# Best practice to import User model safely
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # Write only ensures password is never exposed in responses!
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('name', 'phone', 'password', 'role')

    def create(self, validated_data):
        # We explicitly use create_user here to hash the password securely 
        user = User.objects.create_user(
            phone=validated_data['phone'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data['role']
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
from .models import MaidProfile

class MaidProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaidProfile
        fields = ['skills', 'location', 'availability', 'salary', 'fayda_id']
