from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class SampleItemSerializer(serializers.Serializer):
    """Sample serializer for demonstration purposes"""
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500, required=False)
    created_at = serializers.DateTimeField(read_only=True)
