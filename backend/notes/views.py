from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Notes
from .serializers import UsersSerializer, NotesSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsersSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer
