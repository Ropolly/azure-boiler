from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView

from .models import CustomUser
from .serializers import UserSerializer, UserProfileSerializer


class LoginView(TokenObtainPairView):
    """Custom token obtain view to get JWT token for login"""
    
    def post(self, request, *args, **kwargs):
        # Use the parent class to validate credentials and get tokens
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            # Get the user from the validated credentials
            username = request.data.get('username')
            user = CustomUser.objects.get(username=username)
            
            # Add user profile data to the response
            user_data = UserProfileSerializer(user).data
            
            # Combine the token and user data
            response_data = {
                'tokens': response.data,
                'user': user_data
            }
            
            return Response(response_data)
        
        return response


class LogoutView(APIView):
    """Blacklist the refresh token to implement logout"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # Get the refresh token from request
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            
            # Blacklist the token
            token.blacklist()
            
            return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """View for retrieving and updating user profile"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get the current user's profile"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        """Update the current user's profile"""
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateThemeView(APIView):
    """View for updating user theme preference"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        theme = request.data.get('theme')
        
        if not theme:
            return Response({'detail': 'Theme is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.selected_theme = theme
        user.save()
        
        return Response({'selected_theme': theme}, status=status.HTTP_200_OK)


class RegisterView(CreateAPIView):
    """View for registering new users"""
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Create the user
            user = serializer.save()
            
            # Return user data without password
            user_data = UserProfileSerializer(user).data
            
            return Response(
                {
                    'user': user_data,
                    'message': 'User registered successfully. Please log in.',
                }, 
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
