from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model with password write-only"""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'first_name', 
                  'last_name', 'selected_theme', 'roles', 'avatar']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        """Create and return a new user with encrypted password"""
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        """Update user, correctly handling the password if it's changed"""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile data (no password)"""
    role_list = serializers.ListField(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'selected_theme', 'roles', 'role_list', 'avatar']
        read_only_fields = ['id', 'username', 'email', 'roles', 'role_list']
