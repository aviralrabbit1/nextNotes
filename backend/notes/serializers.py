from rest_framework import serializers
from .models import User, Note
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'user_name', 'user_email', 'password', 'last_update', 'created_on')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('note_id', 'note_title', 'note_content', 'last_update', 'created_on', 'user')
        read_only_fields = ('user',)

# # Convert to and from Json
# class UsersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = "__all__"

# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ['note_id', 'note_title', 'note_content', 'last_update', 'created_on'] 
#         read_only_fields = ['note_id', 'last_update', 'created_on']