from django.utils import timezone
from plataforma.serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.sessions.models import Session


# Create your views here.

@api_view(['GET'])
def room_by_company(request, company, room_name):
    if room_name == "all":
        room = Room.objects.filter(company__slug=company)
    else:
        room = Room.objects.filter(company__slug=company).filter(slug=room_name)
    serializer = RoomSerializer(room, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def profile_by_username(request, username):
    room = Profile.objects.all().filter(user__username=username)
    serializer = ProfileSerializer(room, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def users_by_company(request, company):
    profiles = Profile.objects.all().filter(company__slug=company)
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def users_logged(request, company):
    sessions = Session.objects.filter(expire_date__gte=timezone.now())
    uid_list = []
    for session in sessions:
        data = session.get_decoded()
        uid_list.append(data.get('_auth_user_id', None))

    profile = Profile.objects.filter(user__pk__in=uid_list).filter(company__slug=company)
    serializer = ProfileSerializer(profile, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_files(request, username, type):
    if type == "only":
        files = FilesUp.objects.filter(owner__username=username)
    serializer = FileUpSerializer(files, many=True)
    return Response(serializer.data)
