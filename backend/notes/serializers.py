from rest_framework import serializers
from .models import User, Note

# Convert to and from Json
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['note_id', 'note_title', 'note_content', 'last_update', 'created_on'] 
        read_only_fields = ['note_id', 'last_update', 'created_on']