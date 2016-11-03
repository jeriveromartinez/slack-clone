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


class FileUpSerializer(serializers.ModelSerializer):
    files_comments = FileCommentsSerializer(many=True, read_only=True)
    author = ProfileSerializer()

    class Meta:
        model = FilesUp
        fields = ('slug', 'title', 'file_up', 'uploaded', 'author', 'files_comments')


class MessageEventSeriallizer(serializers.ModelSerializer):
    class Meta:
        model = MessageEvent
        exclude = ('id',)


class RoomMessageEventSeriallizer(MessageEventSeriallizer):
    room = RoomSerializer()
    user_msg = UserSerializer()

    class Meta(MessageEventSeriallizer.Meta):
        model = RoomMessageEvent
        exclude = ('id',)


class MessageInstEventSeriallizer(MessageEventSeriallizer):
    user_to = UserSerializer()
    user_from = UserSerializer()

    class Meta(MessageEventSeriallizer.Meta):
        model = MessageInstEvent
        exclude = ('id',)


class FileSharedEventSeriallizer(MessageEventSeriallizer):
    file_up = FileUpSerializer()
    user_shared = UserSerializer()

    class Meta(MessageEventSeriallizer.Meta):
        model = FileSharedEvent
        exclude = ('id',)


class FileCommentEventSeriallizer(MessageEventSeriallizer):
    file_up = FileUpSerializer()
    user_comment = UserSerializer()

    class Meta(MessageEventSeriallizer.Meta):
        model = FileCommentEvent
        exclude = ('id',)




