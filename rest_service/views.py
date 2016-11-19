import json

from django.contrib.sessions.models import Session
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from django.db.models import Q
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from plataforma.serializers import *


@api_view(['GET'])
def room_by_company(request, company, room_name):
    if room_name == "all":
        room = Room.objects.filter(company__slug=company)
    else:
        room = Room.objects.filter(company__slug=company).filter(slug=room_name)
    serializer = RoomSerializer(room, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def room_by_company_filter(request):
    name = Profile.objects.filter(user=request.user).values('company__name')
    room = []
    if request.method == "POST":

        term = request.POST.get("term")
        if term:
            room = Room.objects.filter(company__name=name).filter(name__icontains=term)
        else:
            room = Room.objects.filter(company__name=name)

    serializer = RoomSerializer(room, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def room_by_user(request, username):
    rooms = Room.objects.filter(users__user__username=username)
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def room_by_user_list(request, username):
    rooms = Room.objects.filter(users__user__username=username).values("name")
    data = list(rooms)

    if len(data) > 1:
        for key, room in enumerate(data):
            print room["name"]
            messages = MessageEvent.objects.all().filter(readed=False, room__name=room["name"]). \
                values("room__name") \
                .annotate(
                total=Count('readed')) \
                .order_by('room')
            if len(messages) > 0:
                data[key]["un_reader_msg"] = messages[0]['total']
            else:
                data[key]["un_reader_msg"] = 0

    else:
        messages = MessageEvent.objects.all().filter(readed=False, room__name=data[0]["name"]). \
            values("room__name") \
            .annotate(
            total=Count('readed')) \
            .order_by('room')
        if len(messages) > 0:
            data[0]["un_reader_msg"] = messages[0]['total']
        else:
            data[0]["un_reader_msg"] = 0

    result = {'items': data}

    return Response(result)


@api_view(['GET'])  # TODO: Agregar a url
def room_subcribe_user(request, roomname, username):
    room = Room.objects.filter(name=roomname)[0]
    profile = Profile.objects.filter(user__username=username)[0]
    room.users.add(profile)
    room.save()

    return Response({"result": "ok"})


@api_view(['GET'])  # TODO: Agregar a url
def room_unsubcribe_user(request, roomname, username):
    room = Room.objects.filter(name=roomname)[0]
    profile = Profile.objects.filter(user__username=username)[0]
    room.users.remove(profile)
    room.save()

    return Response({"result": "ok"})


@api_view(['POST'])  # TODO: falta notificar join y poner en url
def create_room_by_company(request):
    if request.method == "POST":
        name = request.POST.get("title")
        purpose = request.POST.get("purpose")
        visibility = request.POST.get("visibility")
        users_invite = json.loads(request.POST.get("invites"))

        if name and purpose:
            profile = Profile.objects.filter(user__username=request.user.username)[0]
            room = Room.objects.create(name=name, company=profile.company, usercreator=profile, purpose=purpose,
                                       visibility=visibility)
            room.users.add(profile)

            if len(users_invite) > 0:
                for obj in users_invite:
                    user = Profile.objects.filter(user__username=obj)[0]
                    room.users.add(user)
            room.save()
    return Response({"result": "ok"})


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


@api_view(['POST'])
def get_user_by_company(request):
    name = Profile.objects.filter(user=request.user).values('company__name')
    if request.method == "POST":

        term = request.POST.get("term")
        if term:
            users = Profile.objects.filter(company__name=name, user__username__icontains=term)
        else:
            users = Profile.objects.filter(company__name=name)
    serializer = ProfileSerializer(users, many=True)
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
def get_files(request, username, type, company=None):
    if company is None:
        files = type_file_by_user(type=type, username=username)
    else:
        files = type_file_by_company(type=type, company_slug=company)

    data = []
    for file in files:
        data.append(get_file_by_type(file))
    return Response(data)


@api_view(['GET', 'POST'])
def get_details_file(request, file, user_post=None):
    _file = SlackFile.objects.filter(slug=file)[0]  # todo: see the way to get the last 10 comments
    if request.method == "GET":
        return Response(get_file_by_type(_file))
    if request.method == "POST":
        user = User.objects.filter(username=user_post)[0]
        comment = request.POST['comment']
        FilesComment.objects.create(file_up=_file, comment=comment, user=user)
        return Response({'data': 'save'})


@api_view(['GET'])
def get_message_by_user_recent(request, username, page):
    messages = MessageEvent.objects.all().filter(
        ((Q(messageinstevent__user_to__username=username) & Q(messageinstevent__user_from__username=request.user)) |
         (Q(messageinstevent__user_to__username=request.user) & Q(messageinstevent__user_from__username=username))) | Q(
            filesharedevent__user_from__username=username)).order_by('-date_pub')

    paginator = Paginator(messages, 5)

    page = page

    if not page:
        page = 1

    try:
        data = paginator.page(page)
    except (EmptyPage, InvalidPage):
        data = paginator.page(paginator.num_pages)
    reponse = {}
    result = []
    for inst in data.object_list:
        if isinstance(inst, MessageInstEvent):
            serializer = MessageInstEventSerializer(inst.messageinstevent)
            result.append(serializer.data)
        if isinstance(inst, FileSharedEvent):
            serializer = FileSharedEventSerializer(inst)
            result.append(serializer.data)
        if isinstance(inst, FileCommentEvent):
            serializer = FileCommentEventSerializer(inst)
            result.append(serializer.data)
    reponse['items'] = result
    reponse['has_next'] = data.has_next()
    return Response(reponse)


@api_view(['GET'])
def get_comunicaton_me(request, username):
    users = Communication.objects.all().filter(user_me__username=username)

    serializer = CommunicationSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def check_readed_me(request):
    if request.method == "POST":
        username = request.POST.get("channel")
        MessageEvent.objects.filter(readed=False, user_to__username=request.user.username, user_from__username=username) \
            .update(readed=True)
        communication = Communication.objects.all().filter(user_me__username=request.user.username,
                                                           user_connect__username=username) \
            .update(date_pub=datetime.now(), un_reader_msg=0)

    return Response({"result": "ok"})


@api_view(['GET'])  # TODO: poner en url
def delete_comunicaton_me(request, username):
    user = Communication.objects.filter(user_connect__username=username)[0]
    try:
        user.delete()
    except User.DoesNotExist as e:
        return Response({"error": "user not found"})
    return Response({"result": "ok"})


@api_view(['GET'])
def get_recente_message_user(request, username):
    # .exclude(**{'user_from__username' + '__exact': username}) \

    messages = MessageEvent.objects.all().filter(
        date_pub__gte=datetime.now() - timedelta(days=8)) \
        .distinct('user_from__username').order_by('user_from__username', 'date_pub')

    reponse = {}
    result = []
    for inst in messages:
        if isinstance(inst, MessageInstEvent):
            serializer = MessageInstEventSerializer(inst.messageinstevent)
            result.append(serializer.data)
        if isinstance(inst, FileSharedEvent):
            serializer = FileSharedEventSerializer(inst)
            result.append(serializer.data)
        if isinstance(inst, FileCommentEvent):
            serializer = FileCommentEventSerializer(inst)
            result.append(serializer.data)

    reponse['items'] = result

    return Response(reponse)


@api_view(['GET'])
def get_url_user_path(request, username):
    url_path = {'url': reverse('account:profile', kwargs={'username': username})}
    return Response(url_path)


@api_view(['POST', 'GET'])
def save_files(request, type, from_user, to):
    if type == "user":
        user = User.objects.filter(username=to)[0]
        author = Profile.objects.filter(user__username=from_user)[0]
        for key in request.FILES:
            file = request.FILES[key]
            if "image" in file.content_type:
                create = ImageUp.objects.create(title=file.name, file_up=file, author=author)
            else:
                create = FilesUp.objects.create(title=file.name, file_up=file, author=author)
            create.shared_to.add(user)
            create.save()
    else:
        pass
    return Response({'response': from_user + ' ' + type + ' ' + to})


@api_view(['POST'])
def change_user(request, username):
    user = User.objects.filter(username=username)[0]
    user.username = request.POST['username']
    try:
        user.save()
        return Response({'success': 'ok'})
    except:
        return Response({'success': 'false'})


@api_view(['POST'])
def change_pass(request, username):
    user = User.objects.filter(username=username)[0]
    if user.check_password(request.POST['old']):
        try:
            user.set_password(request.POST['change'])
            user.save()
            return Response({'success': 'ok'})
        except:
            pass
    return Response({'success': 'false'})


@api_view(['POST'])
def change_email(request, username):
    user = User.objects.filter(username=username)[0]
    if user.check_password(request.POST['password']):
        try:
            user.email = request.POST['email']
            user.save()
            return Response({'success': 'ok'})
        except:
            pass
    return Response({'success': 'false'})


def type_file_by_user(type, username):
    files = None
    if type == "post":
        files = Post.objects.filter(author__user__username=username)
    if type == "snippets":
        files = Snippet.objects.filter(author__user__username=username)
    if type == "gdocs":
        files = GoogleDocs.objects.filter(author__user__username=username)
    if type == "docs":
        files = FilesUp.objects.filter(author__user__username=username)
    if type == "images":
        files = ImageUp.objects.filter(author__user__username=username)
    if files is None:
        files = SlackFile.objects.filter(author__user__username=username)
    return files


def type_file_by_company(type, company_slug):
    files = None
    if type == "post":
        files = Post.objects.filter(author__company__slug=company_slug)
    if type == "snippets":
        files = Snippet.objects.filter(author__company__slug=company_slug)
    if type == "gdocs":
        files = GoogleDocs.objects.filter(author__company__slug=company_slug)
    if type == "docs":
        files = FilesUp.objects.filter(author__company__slug=company_slug)
    if type == "images":
        files = ImageUp.objects.filter(author__company__slug=company_slug)
    if files is None:
        files = SlackFile.objects.filter(author__company__slug=company_slug)
    return files


def get_file_by_type(file):
    if isinstance(file, Post):
        return PostSerializer(file).data
    elif isinstance(file, Snippet):
        return SnippetSerializer(file).data
    elif isinstance(file, FilesUp):
        return FilesUpSerializer(file).data
    elif isinstance(file, ImageUp):
        return ImageUpSerializer(file).data
    else:
        return SlackFileSerializer(file).data
