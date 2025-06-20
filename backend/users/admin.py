from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    """Admin configuration for the custom user model"""
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'selected_theme', 'roles')
    list_filter = ('is_staff', 'is_superuser', 'selected_theme')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'roles')}),
        ('Preferences', {'fields': ('selected_theme',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'roles')
        }),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)


# Register the CustomUser model with the admin site
admin.site.register(CustomUser, CustomUserAdmin)
