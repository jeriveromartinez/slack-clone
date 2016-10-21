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
        # fields = ('user', 'type', 'image', 'company')


class RoomSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Room
        exclude = ('id',)
        # fields = ('slug', 'name', 'company', 'profile')
