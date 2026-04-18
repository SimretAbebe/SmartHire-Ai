from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Custom User Manager to handle user creation with our custom 'phone' identifier
class UserManager(BaseUserManager):
    def create_user(self, phone, name, password=None, **extra_fields):
        if not phone:
            raise ValueError('The phone number must be set')
        # Create a new user instance
        user = self.model(phone=phone, name=name, **extra_fields)
        # Using set_password ensures the password is cryptographically hashed!
        user.set_password(password)
        # Save the user to the database
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, name, password=None, **extra_fields):
        # Default flags for Django's admin access
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'agent') # Superusers default to agent role
        
        return self.create_user(phone, name, password, **extra_fields)

# 1. Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('maid', 'Maid'),
        ('employer', 'Employer'),
        ('agent', 'Agent'),
    )
    
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    # New personal information fields
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=(('male', 'Male'), ('female', 'Female'), ('other', 'Other')), null=True, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    
    # New fields strictly designated for Agent roles natively
    fayda_id = models.CharField(max_length=12, blank=True, null=True)
    tin_number = models.CharField(max_length=10, blank=True, null=True)
    
    # Required by Django for administration and auth mechanisms
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = UserManager()

    # Tells Django to use 'phone' for authentication instead of 'username'
    USERNAME_FIELD = 'phone'
    # Extra fields required when creating a superuser via CLI
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name} ({self.role})"


# 2. MaidProfile Model

class MaidProfile(models.Model):
    # Link strictly to a User (likely with role='maid')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='maid_profile')
    
    # JSONField allows string lists like ["cleaning", "cooking"]
    skills = models.JSONField(default=list)
    location = models.CharField(max_length=255) # Kept for backward compatibility
    city = models.CharField(max_length=100, null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    availability = models.CharField(max_length=100)
    salary = models.IntegerField()
    fayda_id = models.CharField(max_length=12)
    
    # Logs which 'agent' entered this maid profile into the system
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='registered_maids')

    def __str__(self):
        return f"Maid Profile: {self.user.name} - {self.city}, {self.region}"


# 3. JobPosting Model
class JobPosting(models.Model):
    # Link strictly to an employer User
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_postings')
    
    # Expected structured list of required skills
    required_skills = models.JSONField(default=list)
    location = models.CharField(max_length=255)
    salary = models.IntegerField()

    def __str__(self):
        return f"Job by {self.user.name} at {self.location} (Salary: {self.salary})"
