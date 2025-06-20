from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import CustomUser


class AuthenticationTests(TestCase):
    """Test cases for authentication endpoints"""
    
    def setUp(self):
        """Set up test data and client"""
        self.client = APIClient()
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.refresh_url = reverse('token_refresh')
        self.profile_url = reverse('profile')
        self.theme_url = reverse('update_theme')
        
        # Test user data - only for testing, not actually creating user
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'securepassword123',
            'first_name': 'Test',
            'last_name': 'User',
            'roles': 'user,admin'
        }
    
    def test_login_endpoint_exists(self):
        """Test that login endpoint is properly configured"""
        response = self.client.options(self.login_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('POST' in response['Allow'])
        
    def test_register_endpoint_exists(self):
        """Test that registration endpoint is properly configured"""
        register_url = reverse('register')
        response = self.client.options(register_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('POST' in response['Allow'])
        
    def test_user_registration(self):
        """Test the user registration functionality"""
        register_url = reverse('register')
        user_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepassword123',
            'first_name': 'New',
            'last_name': 'User',
            'roles': 'user',
            'selected_theme': 'dark'
        }
        
        # Register the user
        response = self.client.post(register_url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify response data
        self.assertIn('user', response.data)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')
        self.assertEqual(response.data['user']['email'], 'newuser@example.com')
        self.assertEqual(response.data['user']['selected_theme'], 'dark')
        self.assertEqual(response.data['user']['first_name'], 'New')
        self.assertEqual(response.data['user']['last_name'], 'User')
        
        # Check that password is not returned
        self.assertNotIn('password', response.data['user'])
        
        # Verify that user was created in the database
        user_exists = CustomUser.objects.filter(username='newuser').exists()
        self.assertTrue(user_exists)
    
    def test_logout_endpoint_exists(self):
        """Test that logout endpoint is properly configured but requires auth"""
        response = self.client.options(self.logout_url)
        # Should return 401 since this endpoint requires authentication
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_refresh_endpoint_exists(self):
        """Test that token refresh endpoint is properly configured"""
        response = self.client.options(self.refresh_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('POST' in response['Allow'])

    def test_profile_endpoint_exists(self):
        """Test that profile endpoint is properly configured but requires auth"""
        response = self.client.options(self.profile_url)
        # Should return 401 since this endpoint requires authentication
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_theme_endpoint_exists(self):
        """Test that theme update endpoint is properly configured but requires auth"""
        response = self.client.options(self.theme_url)
        # Should return 401 since this endpoint requires authentication
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserModelTests(TestCase):
    """Test cases for the CustomUser model"""
    
    def test_user_model_fields(self):
        """Test that CustomUser model has expected fields"""
        fields = CustomUser._meta.get_fields()
        field_names = [field.name for field in fields]
         
        # Test presence of custom fields
        self.assertTrue('email' in field_names)
        self.assertTrue('selected_theme' in field_names)
        self.assertTrue('roles' in field_names)
        self.assertTrue('avatar' in field_names)
    
    def test_user_model_properties(self):
        """Test CustomUser model properties without creating a user"""
        # Get model description without creating instances
        self.assertTrue(hasattr(CustomUser, 'role_list'))
        self.assertTrue(hasattr(CustomUser, 'is_admin'))
        self.assertTrue(hasattr(CustomUser, 'is_super_admin'))
