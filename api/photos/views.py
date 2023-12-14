from rest_framework import viewsets
from .models import Category, Photo
from .serializer import CategorySerializer, PhotoSerializer
from rest_framework.response import Response
from rest_framework import status
import os

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all() 
    serializer_class = CategorySerializer  
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        photos = Photo.objects.filter(category=instance)
        for photo in photos:
            if photo.image:
                try:
                    image_path = photo.image.path
                    photo.image.delete()
                    os.remove(image_path)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()  
    serializer_class = PhotoSerializer  
    
    def create(self, request, *args, **kwargs):
        data = request.data
        new_category_name = data.get('new_category_name')

        if new_category_name:
            new_category, created = Category.objects.get_or_create(name=new_category_name)

            data['category'] = new_category.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        instance.photoname = data.get('photoname', instance.photoname)
        instance.description = data.get('description', instance.description)

        new_category_name = data.get('new_category_name')
        if new_category_name:
            new_category, created = Category.objects.get_or_create(name=new_category_name)
            instance.category = new_category
        elif 'category' in data:
            category_id = data.get('category')
            instance.category_id = category_id
        else:
            instance.category = None

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.image:
            try:
                image_path = instance.image.path
                instance.image.delete()  
                os.remove(image_path) 
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)
    

