from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from rest_framework import permissions
from location_management.models import Location

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, ** extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    is_moh_admin = models.BooleanField(default=False)
    is_moh_staff = models.BooleanField(default=False)
    is_location_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    can_update_test = models.BooleanField(default=False)
    can_update_vaccine = models.BooleanField(default=False)
    can_check_in = models.BooleanField(default=False)
    can_receive_location_batch = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='uploads/', blank=True, null=True)

    class Meta:
        verbose_name = 'Staff Account'

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name

    def get_image(self):
        if self.profile_picture:
            return 'http://192.168.0.150:8000' + self.profile_picture.url
        return ''

    def __str__(self):
        return self.email


import string    
import random
from django.contrib.auth import get_user_model
User = get_user_model()

def tokenGenerator():
    S = 16
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ran

class ResetAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    token = models.CharField(max_length=16, unique=True, default=tokenGenerator)
    created = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    def __str__(self):
        return self.user.email

class ActivateAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    activate = models.CharField(max_length=16, unique=True, default=tokenGenerator)
    token = models.CharField(max_length=16, unique=True, default=tokenGenerator)
    created = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    def __str__(self):
        return self.user.email

    