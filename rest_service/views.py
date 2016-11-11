from django.db.models import Q
from django.db.models.query import Prefetch
from django.utils import timezone
from plataforma.serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.sessions.models import Session
from django.core.paginator import Paginator, InvalidPage, EmptyPage

# Create your views here.
from rest_framework.reverse import reverse


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
def get_files(request, username, type, company=None):
    if company is None:
        files = type_file_by_user(type=type, username=username)
    else:
        files = type_file_by_company(type=type, company_slug=company)

    data = []
    for file in files:
        if isinstance(file, Post):
            data.append(PostSerializer(file).data)
        elif isinstance(file, Snippet):
            data.append(SnippetSerializer(file).data)
        elif isinstance(file, FilesUp):
            data.append(FilesUpSerializer(file).data)
        elif isinstance(file, ImageUp):
            data.append(ImageUpSerializer(file).data)
        else:
            data.append(SlackFileSerializer(file).data)
    # TODO: este codigo esta puerco, ver como mejorarlo
    return Response(data)


@api_view(['GET', 'POST'])
def get_details_file(request, username, file):
    _file = FilesUp.objects.filter(author__user__username=username).filter(slug=file)
    if request.method == "GET":
        serializer = SlackFileSerializer(_file, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        user = User.objects.filter(username=username)[0]
        comment = request.POST['comment']
        FilesComment.objects.create(file_up=_file[0], comment=comment, user=user)
        return Response({'data': 'save'})


@api_view(['GET'])
def get_message_by_user(request, username, page):
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
