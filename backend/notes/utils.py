from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from .models import Notes
from .serializers import NotesSerializer
from rest_framework.decorators import api_view

# Create your views here.

  # This function will return the notes list
@api_view(["GET"])
def getNotesList(request):
    notes = Notes.objects.all().order_by('-last_update')
    serializer = NotesSerializer(notes, many=True)
    return Response(serializer.data)


# This function will return the note detail
@api_view(["GET"])
def getNoteDetail(request, pk):
    notes = Notes.objects.get(id=pk)
    serializer = NotesSerializer(notes, many=False)
    return Response(serializer.data)

# This function will create a note
@api_view(["POST"])
def createNote(request):
    data = request.data
    note = Note.objects.create(
      note_title=data['note_title'],
      note_content=data['note_content'],
    )
    serializer = NotesSerializer(note, many=False)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

# This function will update a note
@api_view(["PUT"])
def updateNote(request, pk):
    data = request.data
    note = Note.objects.get(note_id=pk)
    serializer = NotesSerializer(instance=note, data=data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

# This function will delete a note
@api_view(["DELETE"])
def deleteNote(request, pk):
    note = Note.objects.get(note_id=pk)
    note.delete()
    return Response('Note was deleted!')