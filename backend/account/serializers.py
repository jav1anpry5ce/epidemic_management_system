from rest_framework import serializers
from django.contrib.auth import get_user_model
from location_management.serializers import LocationSerializer
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            )

class StaffSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False)
    class Meta:
        model = User
        fields = (
            'first_name', 
            'last_name', 
            'email', 
            'location', 
            'is_location_admin',
            'is_active', 
            'last_login', 
        )

class DetailedStaffSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False)
    class Meta:
        model = User
        fields = (
            'first_name', 
            'last_name', 
            'email', 
            'location', 
            'is_location_admin',
            'can_update_test',
            'can_update_vaccine',
            'can_check_in',
            'can_receive_location_batch',
            'is_active', 
            'last_login', 
        )