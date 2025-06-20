from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# Theme choices that match our frontend theme options
THEME_CHOICES = [
    ('light', 'Light'),
    ('dark', 'Dark'),
    ('blue', 'Blue'),
    ('system', 'System'),
]

# User roles matching the frontend permission levels
ROLE_CHOICES = [
    ('public', 'Public'),
    ('user', 'User'),
    ('admin', 'Admin'),
    ('super_admin', 'Super Admin'),
]


class CustomUser(AbstractUser):
    """Custom user model with additional fields for theme preferences and roles"""
    email = models.EmailField(_('email address'), unique=True)  # Make email required and unique
    selected_theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='system')
    
    # User profile fields
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    avatar = models.URLField(max_length=500, blank=True, null=True)
    
    # Roles - Stored as comma-separated values
    roles = models.CharField(max_length=255, default='user')  # Default role is 'user'
    
    # Required fields for creating a user
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']
    
    def __str__(self):
        return self.username
    
    @property
    def role_list(self):
        """Return the list of roles as a Python list"""
        if self.roles:
            return [role.strip() for role in self.roles.split(',')]
        return []
    
    @property
    def is_admin(self):
        """Check if user has admin role"""
        return 'admin' in self.role_list or 'super_admin' in self.role_list
    
    @property
    def is_super_admin(self):
        """Check if user has super_admin role"""
        return 'super_admin' in self.role_list
