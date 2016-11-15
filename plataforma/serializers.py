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


class SlackFileSerializer(serializers.ModelSerializer):
    files_comments = FileCommentsSerializer(many=True, read_only=True)
    author = ProfileSerializer()

    class Meta:
        model = FilesUp
        fields = ('slug', 'title', 'uploaded', 'author', 'files_comments')


class PostSerializer(SlackFileSerializer):
    class Meta(SlackFileSerializer.Meta):
        model = Post
        fields = ('slug', 'title', 'code', 'uploaded', 'author', 'files_comments')


class SnippetSerializer(SlackFileSerializer):
    class Meta(SlackFileSerializer.Meta):
        model = Snippet
        fields = ('slug', 'title', 'code', 'uploaded', 'author', 'files_comments')


class FilesUpSerializer(SlackFileSerializer):
    class Meta(SlackFileSerializer.Meta):
        model = FilesUp
        fields = ('slug', 'title', 'file_up', 'uploaded', 'author', 'files_comments')


class ImageUpSerializer(FilesUpSerializer):
    class Meta(FilesUpSerializer.Meta):
        model = ImageUp
        fields = ('slug', 'title', 'file_up', 'uploaded', 'author', 'files_comments')


class MessageEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageEvent
        exclude = ('id',)


class MessageInstEventSerializer(MessageEventSerializer):
    user_to = UserSerializer()
    user_from = UserSerializer()

    class Meta(MessageEventSerializer.Meta):
        model = MessageInstEvent
        exclude = ('id',)


class FileSharedEventSerializer(MessageEventSerializer):
    file_up = SlackFileSerializer()
    user_shared = UserSerializer()

    class Meta(MessageEventSerializer.Meta):
        model = FileSharedEvent
        exclude = ('id',)


class FileCommentEventSerializer(MessageEventSerializer):
    file_up = SlackFileSerializer()
    user_comment = UserSerializer()

    class Meta(MessageEventSerializer.Meta):
        model = FileCommentEvent
        exclude = ('id',)


class CommunicationSerializer(serializers.ModelSerializer):
    user_me = UserSerializer()
    user_connect = UserSerializer()

    class Meta:
        model = Communication
        exclude = ('id',)
