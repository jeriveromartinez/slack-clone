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


class ProfileFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        exclude = ('id', 'socketsession', 'type', 'company',)


class UserFileSerializer(serializers.ModelSerializer):
    user_profile = ProfileFileSerializer()

    class Meta:
        model = User
        fields = ('username', 'email', 'user_profile',)


class RoomSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    usercreator = ProfileSerializer()
    users = serializers.StringRelatedField(many=True)

    class Meta:
        model = Room
        exclude = ('id',)


class FileCommentsSerializer(serializers.ModelSerializer):
    user = UserFileSerializer(many=False)

    class Meta:
        model = FilesComment
        fields = ('comment', 'published', 'user')


class SlackFileSerializer(serializers.ModelSerializer):
    files_comments = FileCommentsSerializer(many=True, read_only=False)
    author = ProfileSerializer()
    count_comment = serializers.IntegerField(source='files_comments.count', read_only=True)

    class Meta:
        model = SlackFile
        fields = ('slug', 'title', 'uploaded', 'author', 'count_comment', 'extension')


class TypeSerializer(serializers.Serializer):
    types = serializers.ChoiceField(choices=Snippet.CHOICE)


class PostSerializer(SlackFileSerializer):
    class Meta(SlackFileSerializer.Meta):
        model = Post
        fields = ('slug', 'title', 'text', 'uploaded', 'author', 'count_comment')


class SnippetSerializer(SlackFileSerializer):
    class Meta(SlackFileSerializer.Meta):
        model = Snippet
        fields = ('slug', 'title', 'extension', 'code', 'uploaded', 'author', 'count_comment')


class FilesUpSerializer(SlackFileSerializer):
    class Meta(SlackFileSerializer.Meta):
        model = FilesUp
        fields = ('slug', 'title', 'file_up', 'extension', 'size', 'uploaded', 'author', 'count_comment')


class ImageUpSerializer(FilesUpSerializer):
    class Meta(FilesUpSerializer.Meta):
        model = ImageUp
        fields = ('slug', 'title', 'image_up', 'uploaded', 'author', 'count_comment')


class MessageEventSerializer(serializers.ModelSerializer):
    user_to = UserSerializer()
    user_from = UserSerializer()

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
