from django.db import models
import uuid
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class User(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_name = models.CharField(max_length=255)
    user_email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # store hashed password
    last_update = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)
    def __str__(self):
      return self.user_name


class Note(models.Model):
    note_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note_title = models.CharField(max_length=255)
    note_content = models.TextField()
    last_update = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    
    def __str__(self):
      return self.note_title  
    
    class Meta:
      ordering = ['-last_update']
