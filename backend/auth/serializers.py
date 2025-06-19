from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    password_confirmation = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirmation']

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirmation')
        return User.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        username = data.get('username', None)
        password = data.get('password', None)

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid credentials')

        return {
            'username': user.username,
            'token': 'sample-token'  # In a real app, generate JWT token here
        }
