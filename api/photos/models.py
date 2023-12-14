from django.db import models
from django.utils import timezone


def upload_to(instance, filename):
    return f'media/{filename}'

    
# Create your models here.
class Category(models.Model):
    name=models.CharField(max_length=100, null=False, blank=False)
    
    def __str__(self):
        return self.name
    
class Photo(models.Model):
    category= models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    photoname=models.CharField(max_length=255, null=False, blank=False, unique=True)
    image =models.ImageField(upload_to=upload_to, null=True, blank=True)
    description=models.TextField(max_length=500, null=False, blank=False, default='default_value_here')
    upload_datetime = models.DateTimeField(default=timezone.now)
    
    
    def __str__(self):
        return self.photoname
    
    