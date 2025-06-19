from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('items/', views.sample_api_view, name='sample-items'),
]
