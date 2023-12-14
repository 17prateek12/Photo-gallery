from django.urls import path, include
from .views import CategoryViewSet, PhotoViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'photos', PhotoViewSet, basename='photos')


urlpatterns = [
    path('api/', include(router.urls)),
]
