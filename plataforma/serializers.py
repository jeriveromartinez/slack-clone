from rest_framework import serializers
from plataforma.models import *
from rest_framework.reverse import reverse


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
        exclude = ('id', 'socketsession',)


class RoomSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Room
        exclude = ('id',)


class FileCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilesComment
        exclude = ('id', 'user', 'file_up')


class FileUpSerializer(serializers.ModelSerializer):
    files_comments = FileCommentsSerializer(many=True, read_only=True)
    author = ProfileSerializer()

    class Meta:
        model = FilesUp
        fields = ('slug', 'title', 'file_up', 'uploaded', 'author', 'files_comments')


class UrlSerializer(serializers.Serializer):
    url = serializers.SerializerMethodField('url')

    # obj.my_objects.values_list("url_name", flat=True)
    def url(self, obj):
        return obj.my_objects.values_list('url', flat=True)
