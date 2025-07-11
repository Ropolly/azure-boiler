"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views import static as django_static_views
from django.conf import settings
from django.conf.urls.static import static
import os

# Configure static file serving first
urlpatterns = static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# API endpoints
urlpatterns += [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/users/', include('users.urls')),
]

# Special handling for assets directory
urlpatterns += [
    re_path(r'^assets/(?P<path>.*)$', django_static_views.serve, {
        'document_root': os.path.join(settings.BASE_DIR, '../frontend/dist/assets'),
    }),
]

# Serve frontend SPA for all other routes
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
