from django.shortcuts import render
from .models import User, Note
from .serializers import UsersSerializer, NoteSerializer
from rest_framework import generics
from rest_framework.response import Response

class NoteListCreateView(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    lookup_field = 'note_id'

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UsersSerializer
