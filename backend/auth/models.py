from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Custom user model for extending the Django built-in user model
    Add any additional fields you need for your user model here
    """
    pass
    # Example fields:
    # profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    # phone_number = models.CharField(max_length=15, blank=True, null=True)
