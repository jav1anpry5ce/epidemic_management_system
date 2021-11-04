from djoser.serializers import UserSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = (
            'username',
            'email',
            'first_name',
            'last_name',
            )
