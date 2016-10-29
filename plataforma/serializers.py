from rest_framework import serializers
from plataforma.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('id', 'password', 'is_superuser', 'is_staff', 'user_permissions', 'groups', 'date_joined')
        # fields = ('username', 'email', 'first_name', 'last_name')


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        exclude = ('id',)
        # fields = ('slug', 'name')


class ProfileSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    user = UserSerializer()

    class Meta:
        model = Profile
        exclude = ('id',)


class RoomSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Room
        exclude = ('id',)


class FileCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilesComment


class FileUpSerializer(serializers.ModelSerializer):
    files_comments = FileCommentsSerializer(many=True, read_only=True)

    class Meta:
        model = FilesUp
        fields = ('slug', 'file_up', 'uploaded', 'files_comments')
