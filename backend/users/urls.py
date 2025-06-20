from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, LogoutView, UserProfileView, UpdateThemeView, RegisterView

urlpatterns = [
    # Authentication URLs
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    
    # User profile URLs
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update-theme/', UpdateThemeView.as_view(), name='update_theme'),
]
