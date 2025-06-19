from rest_framework import viewsets, views, response, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from .serializers import SampleItemSerializer


# Sample data for demo purposes
SAMPLE_ITEMS = [
    {'id': 1, 'name': 'Item 1', 'description': 'Sample item 1', 'created_at': datetime.now()},
    {'id': 2, 'name': 'Item 2', 'description': 'Sample item 2', 'created_at': datetime.now()},
]


@api_view(['GET'])
def sample_api_view(request):
    """Sample API endpoint that returns a list of items"""
    serializer = SampleItemSerializer(SAMPLE_ITEMS, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def api_root(request):
    """API root endpoint with available endpoints"""
    return Response({
        'status': 'online',
        'version': '1.0.0',
        'endpoints': {
            'items': '/api/items/',
        }
    })
