import json
from datetime import timedelta

from django.contrib.sessions.models import Session
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from django.db.models import Q, Max, Avg
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from plataforma.serializers import *
from plataforma.utils import Email


@api_view(['GET'])
def room_by_company(request, company, room_name):
    if room_name == "all":
        room = Room.objects.filter(company__slug=company)
    else:
        room = Room.objects.filter(company__slug=company).filter(slug=room_name)
    serializer = RoomSerializer(room, many=True)
    return Response(serializer.data)


@api_view(['POST', 'GET'])
def room_by_company_filter(request):
    name = Profile.objects.filter(user=request.user).values('company__name')

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
    rooms = Room.objects.filter(users__user__username=username).values("name", "slug")
    data = list(rooms)

    if len(data) > 1:
        for key, room in enumerate(data):
            messages = MessageEvent.objects.all().filter(readed=False, room__name=room["name"],
                                                         user_to__user__username=username). \
                values("room__name") \
                .annotate(
                total=Count('readed')) \
                .order_by('room')
            if len(messages) > 0:
                data[key]["un_reader_msg"] = messages[0]['total']
            else:
                data[key]["un_reader_msg"] = 0

    else:
        if len(data) == 1:
            messages = MessageEvent.objects.all().filter(readed=False, room__name=data[0]["name"],
                                                         user_to__user__username=username). \
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


@api_view(['POST'])  # TODO: falta notificar join
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

    return Response({"result": room.name})


@api_view(['GET'])
def profile_by_username(request, username):
    room = Profile.objects.get(user__username__exact=username)
    serializer = ProfileSerializer(room, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def users_by_company(request, company, search=None):
    if search is None:
        profiles = Profile.objects.all().filter(company__slug=company)
        serializer = ProfileSerializer(profiles, many=True)
    else:
        profile = Profile.objects.filter(
            Q(company__slug=company) & (Q(user__username__contains=search) | Q(user__first_name__contains=search) | Q(
                user__last_name__contains=search))).order_by('user__username').distinct()
        serializer = ProfileSerializer(profile, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def get_user_by_company(request):
    if request.method == "POST":
        term = request.POST.get("term")
        if term:
            users = Profile.objects.filter(company__slug=request.user.user_profile.company.slug,
                                           user__username__icontains=term)
        else:
            users = Profile.objects.filter(company__slug=request.user.user_profile.company.slug)
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
        files = type_file_by_user(type=type, me=request.user.username, user=username)
    else:
        files = type_file_by_company(type=type, user=username)

    return Response(get_generic_files(files))


@api_view(['GET'])
def get_files_user_details(request, username):
    user = User.objects.get(username__exact=username)
    files = SlackFile.objects.filter(
        (Q(author__user=user) & Q(shared_to__username__exact=request.user.username)) |
        (Q(author__user=request.user) & Q(shared_to__username__exact=user.username))).order_by(
        '-uploaded').distinct()
    data = []
    for file in files:
        data.append(get_file_by_type(file))
    return Response(data)


@api_view(['GET', 'POST'])
def get_details_file(request, file, user_post=None):
    _file = SlackFile.objects.get(slug=file)  # todo: see the way to get the last 10 comments
    if request.method == "GET":
        return Response(get_file_by_type(_file))
    if request.method == "POST":
        profile = Profile.objects.get(user__username=user_post)
        comment = request.POST['comment']
        FilesComment.objects.create(file_up=_file, comment=comment, user=profile.user)
        return Response({'data': 'save'})


@api_view(['GET'])
def get_comments_files(request, file_slug):
    comments = FilesComment.objects.filter(file_up__slug=file_slug)[:10:1]
    serializer = FileCommentsSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def share_file(request, slug):
    post = request.POST
    try:
        file = SlackFile.objects.get(slug=slug)
        user_from = Profile.objects.get(user__username=request.user.username)
        cond, shrared_to = post['shared'].split('_')
        if cond == "channel":
            room = Room.objects.get(slug=shrared_to)
            for item in room.users.all():
                file.shared_to.add(item.user)
            FileSharedEvent.objects.create(room=room, user_from=user_from, type='file_shared_event', file_up=file)
            file.save()  # TODO: send notifications if user is connect
        else:
            profile = Profile.objects.get(user__username=shrared_to)
            file.shared_to.add(profile.user)
            FileSharedEvent.objects.create(user_to=profile, user_from=user_from, type='file_shared_event', file_up=file)
            file.save()

        if post['comment']:
            FilesComment.objects.create(file_up=file, comment=post['comment'], user=user_from.user)
        return Response({'success': 'ok'})
    except Exception as e:
        print e.message
        return Response({'success': 'false'})


@api_view(['GET'])
def get_message_by_user_recent(request, username, page):
    messages = MessageEvent.objects.filter(
        ((Q(messageinstevent__user_to__user__username=username) & Q(
            messageinstevent__user_from__user__username=request.user.username)) |
         (Q(messageinstevent__user_to__user__username=request.user.username) & Q(
             messageinstevent__user_from__user__username=username))) | Q(
            filesharedevent__user_from__user__username=username)).order_by('-date_pub')

    paginator = Paginator(messages, 10)

    if not page:
        page = 1

    try:
        data = paginator.page(page)
    except (EmptyPage, InvalidPage):
        data = paginator.page(paginator.num_pages)

    response = {'items': get_generic_msg(data.object_list), 'has_next': data.has_next()}
    return Response(response)


@api_view(['GET'])
def get_message_by_room(request, room, page):
    messages = MessageEvent.objects.filter(
        (Q(messageinstevent__room__name=room) & Q(messageinstevent__user_to__user__username=request.user.username)) | Q(
            filesharedevent__room__name=room)).order_by('-date_pub')

    paginator = Paginator(messages, 20)

    if not page:
        page = 1

    try:
        data = paginator.page(page)
    except (EmptyPage, InvalidPage):
        data = paginator.page(paginator.num_pages)

    response = {'items': get_generic_msg(data.object_list), 'has_next': data.has_next()}
    return Response(response)


@api_view(['GET'])
def get_subcrite_room(request):
    reponse = {}
    data = []
    for item in request.user.user_profile.users_room.all():
        msg = MessageEvent.objects.filter(Q(room=item)).order_by('-date_pub')[0]
        data.append(
            {'msg': get_msg(msg), 'room': item.name, 'date': msg.date_pub, 'creator': item.usercreator.user.username,
             'count': item.users.count()})
    reponse['items'] = data
    return Response(reponse)


@api_view(['GET'])
def get_user_history(request):
    reponse = {}
    data = []
    msg = MessageEvent.objects.filter(
        Q(room=None) & (Q(user_to__user__username=request.user.username))
    ).values("user_from") \
        .annotate(
        last=Max('date_pub')) \
        .order_by('user_from')
    for item in msg:
        target = MessageEvent.objects.filter(user_from=item['user_from'], date_pub__exact=item['last'])[0]
        data.append(get_msg(target))
    reponse['items'] = data
    return Response(reponse)


@api_view(['GET'])
def get_comunicaton_me(request, username):
    users = Communication.objects.filter(user_me__username=username)

    serializer = CommunicationSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def check_readed_me(request):
    if request.method == "POST":
        username = request.POST.get("channel")
        MessageEvent.objects.filter(readed=False, user_to__user__username=request.user.username,
                                    user_from__user__username=username) \
            .update(readed=True)
        communication = Communication.objects.all().filter(user_me__username=request.user.username,
                                                           user_connect__username=username) \
            .update(date_pub=datetime.now(), un_reader_msg=0)

    return Response({"result": "ok"})


@api_view(['POST'])
def check_readed_room(request):
    if request.method == "POST":
        room = request.POST.get("room")
        MessageEvent.objects.filter(readed=False, user_to__user__username=request.user.username,
                                    room__name=room) \
            .update(readed=True)

    return Response({"result": "ok"})


@api_view(['POST'])
def check_active(request):
    if request.method == "POST":
        room = True if request.POST.get("status") == "True" else False

        Profile.objects.filter(user__username=request.user.username) \
            .update(active=room)
        Communication.objects.filter(user_connect__username=request.user.username,
                                     user_me__username=request.user.username) \
            .update(active=room)
        return Response({"result": "ok"})


@api_view(['GET'])
def delete_comunicaton_me(request, username):
    user = Communication.objects.get(user_me__username=request.user.username, user_connect__username=username)
    try:
        user.delete()
    except User.DoesNotExist as e:
        return Response({"error": "user not found"})
    return Response({"result": "ok"})


@api_view(['GET'])
def get_recente_message_user(request, username):
    # .exclude(**{'user_from__username' + '__exact': username}) \

    messages = MessageEvent.objects.all().filter(
        ((Q(messageinstevent__user_to__user__username=username) |
          Q(messageinstevent__user_from__user__username=username))) |
        Q(filesharedevent__user_from__user__username=username),

        date_pub__gte=datetime.now() - timedelta(days=8)) \
        .order_by('user_from__user__username', '-date_pub').distinct()

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
        profile = Profile.objects.get(user__username=inst.user_from.user.username)

        result[(len(result) - 1)]['image'] = profile.image.url
        reponse['items'] = result
    return Response(reponse)


@api_view(['GET'])
def get_url_user_path(request, username):
    url_path = {'url': reverse('account:profile', kwargs={'username': username})}
    return Response(url_path)


@api_view(['POST', 'GET'])
def save_files(request, from_user):
    try:
        author = Profile.objects.get(user__username=from_user)
        post = request.POST
        file = request.FILES['file']
        title = file.name
        if post['title']:
            title = post['title']

        if "image" in file.content_type:
            create = ImageUp.objects.create(title=title, image_up=file, author=author)
        else:
            create = FilesUp.objects.create(title=title, file_up=file, author=author)
        shared = (post['isShared'] == 'true')
        if shared and post['shared']:
            cond, channel = post['shared'].split('_')
            if cond == "channel":
                room = Room.objects.get(slug=channel)
                create.shared_in.add(room)
                for item in room.users.all():
                    create.shared_to.add(item.user)
                # FileSharedEvent.objects.create(room=room, user_from=request.user, type='file_shared_event',
                #                                file_up=create)  # TODO: enviar si esta logueado
                create.save()
            else:
                profile = Profile.objects.get(user__username=channel)
                user_from = Profile.objects.get(user__username=request.user.username)
                create.shared_to.add(profile.user)
                FileSharedEvent.objects.create(user_to=profile, user_from=user_from, type='file_shared_event',
                                               file_up=create)
                create.save()

        if post['comment']:
            FilesComment.objects.create(file_up=create, comment=post['comment'], user=author.user)
        return Response({'success': 'ok'})
    except Exception as e:
        print e
        return Response({'success': 'false'})


@api_view(['POST'])
def change_user(request, username):
    user = User.objects.filter(username=username)[0]
    user.username = request.POST['username']
    try:
        user.save()
        return Response({'success': 'ok'})
    except Exception as e:
        print e
        return Response({'success': 'false'})


@api_view(['POST'])
def change_pass(request, username):
    user = User.objects.filter(username=username)[0]
    if user.check_password(request.POST['old']):
        try:
            user.set_password(request.POST['change'])
            user.save()
            return Response({'success': 'ok'})
        except Exception as e:
            print e.message
    return Response({'success': 'false'})


@api_view(['POST'])
def change_email(request, username):
    user = User.objects.filter(username=username)[0]
    if user.check_password(request.POST['password']):
        try:
            user.email = request.POST['email']
            user.save()
            return Response({'success': 'ok'})
        except Exception as e:
            print e
    return Response({'success': 'false'})


@api_view(['DELETE'])
def delete_file(request, slug):
    file = SlackFile.objects.filter(slug=slug)[0]
    try:
        file.delete()
        return Response({'success': 'ok'})
    except Exception as e:
        print e
    return Response({'success': 'false'})


@api_view(['GET'])
def snippet_languages(request):
    return Response(Snippet.CHOICE)


@api_view(['POST'])
def snippet_create(request):
    try:
        author = Profile.objects.filter(user__username=request.user.username)[0]
        if request.POST['title'] is not None and request.POST['title'] != "":
            title = request.POST['title']
        else:
            title = "Snippet created by " + request.user.username
        type = request.POST['type']
        code = request.POST['code']
        shared = request.POST['shared']
        comment = request.POST['comment']

        create = Snippet.objects.create(title=title, type=type, code=code, author=author)
        user_from = Profile.objects.get(user__username__exact=request.user.username)
        if shared is not None and shared != "":
            cond, channel = shared.split('_')
            if cond == "channel":
                room = Room.objects.get(slug=channel)
                create.shared_to.add(room)
                for item in room.users.all():
                    create.shared_to.add(item.user)
                FileSharedEvent.objects.create(room=room, user_from=user_from, type='file_shared_event',
                                               file_up=create)  # TODO: enviar si esta logueado
                create.save()
            else:
                user = Profile.objects.get(user__username=channel)
                create.shared_to.add(user)
                FileSharedEvent.objects.create(user_to=user, user_from=user_from, type='file_shared_event',
                                               file_up=create)
                create.save()
        if comment is not None and comment != "":
            FilesComment.objects.create(file_up=create, comment=comment, user=author.user)
        return Response({'success': 'ok'})
    except Exception as e:
        print e
        return Response({'success': 'false'})


@api_view(['GET'])
def search_option(request, data):
    info = data.split(':')
    try:
        if info[0] == "from":
            from_user = info[1].replace('@', '')
            user = Profile.objects.get(user__username__exact=from_user)
            msg = MessageEvent.objects.filter(user_from__user__username__exact=from_user,
                                              user_to__user__username__exact=request.user.username).order_by(
                '-date_pub')[:10:1]
            files = SlackFile.objects.filter(author__user__username__exact=from_user,
                                             shared_to__username__exact=request.user.username).order_by('-uploaded')[
                    :10:1]
            data = {'msg': get_generic_msg(msg), 'file': get_generic_files(files),
                    'user': ProfileSerializer(user, many=False).data}
        elif info[0] == "before":
            msg = MessageEvent.objects.filter(date_pub__lte=info[1],
                                              user_to__user__username__exact=request.user.username).order_by(
                '-date_pub')[
                  :10:1]
            files = SlackFile.objects.filter(uploaded__lte=info[1],
                                             shared_to__username__exact=request.user.username).order_by('-uploaded')[
                    :10:1]
            data = {'msg': get_generic_msg(msg), 'file': get_generic_files(files),
                    'user': ProfileSerializer(request.user.user_profile, many=False).data}
        elif info[0] == "after":
            msg = MessageEvent.objects.filter(date_pub__gte=info[1],
                                              user_to__user__username__exact=request.user.username).order_by(
                '-date_pub')[:10:1]
            files = SlackFile.objects.filter(uploaded__gte=info[1],
                                             shared_to__username__exact=request.user.username).order_by('-uploaded')[
                    :10:1]
            data = {'msg': get_generic_msg(msg), 'file': get_generic_files(files),
                    'user': ProfileSerializer(request.user.user_profile, many=False).data}

        return Response(data)
    except Exception as e:
        print e.message


@api_view(['POST'])
def send_invitations(request):
    try:
        if request.method == "POST":
            ukeys = request.POST.get('invite')
            invite = json.loads(ukeys)
            site_info = {'protocol': request.is_secure() and 'https' or 'http'}
            site_info['root'] = site_info['protocol'] + '://' + request.get_host()

            for element in invite:
                slug = slugify(datetime.now().__str__() + element['email'])
                UserInvited.objects.create(email=element['email'], company=request.user.user_profile.company,
                                           name=element['fName'], last_name=element['lName'], slug_activation=slug)
                invite_url = site_info['root'] + reverse('app:register_create', kwargs={'slug': slug})
                Email.send(element, 'topic', invite_url)

            return Response({'response': 'ok'})
    except Exception as e:
        return Response({'response': 'error'})
        print e


def type_file_by_user(type, me, user):
    files = None
    if type == "post":
        if me == user:
            files = Post.objects.filter(author__user__username__exact=user).order_by('-uploaded')
        else:
            files = Post.objects.filter(
                Q(shared_to__username__exact=me) & Q(author__user__username__exact=user)).order_by('-uploaded')
    if type == "snippets":
        if me == user:
            files = Snippet.objects.filter(author__user__username__exact=user).order_by('-uploaded')
        else:
            files = Snippet.objects.filter(
                Q(shared_to__username__exact=me) & Q(author__user__username__exact=user)).order_by('-uploaded')
    if type == "gdocs":
        if me == user:
            files = GoogleDocs.objects.filter(author__user__username__exact=user).order_by('-uploaded')
        else:
            files = GoogleDocs.objects.filter(
                Q(shared_to__username__exact=me) & Q(author__user__username__exact=user)).order_by('-uploaded')
    if type == "docs":
        if me == user:
            files = FilesUp.objects.filter(author__user__username__exact=user).order_by('-uploaded')
        else:
            files = FilesUp.objects.filter(
                Q(shared_to__username__exact=me) & Q(author__user__username__exact=user)).order_by('-uploaded')
    if type == "images":
        if me == user:
            files = ImageUp.objects.filter(author__user__username__exact=user).order_by('-uploaded')
        else:
            files = ImageUp.objects.filter(
                Q(shared_to__username__exact=me) & Q(author__user__username__exact=user)).order_by('-uploaded')
    if files is None:
        if me == user:
            files = SlackFile.objects.filter(author__user__username__exact=user).order_by('-uploaded')
        else:
            files = SlackFile.objects.filter(
                Q(shared_to__username__exact=me) & Q(author__user__username__exact=user)).order_by('-uploaded')
    return files


def type_file_by_company(type, user):
    files = None
    if type == "post":
        files = Post.objects.filter(
            Q(shared_to__username__exact=user) |
            Q(author__user__username__exact=user)).order_by('-uploaded', 'slug').distinct()
    if type == "snippets":
        files = Snippet.objects.filter(
            Q(shared_to__username__exact=user) |
            Q(author__user__username__exact=user)).order_by('-uploaded', 'slug').distinct()
    if type == "gdocs":
        files = GoogleDocs.objects.filter(
            Q(shared_to__username__exact=user) |
            Q(author__user__username__exact=user)).order_by('-uploaded', 'slug').distinct()
    if type == "docs":
        files = FilesUp.objects.filter(
            Q(shared_to__username__exact=user) |
            Q(author__user__username__exact=user)).order_by('-uploaded', 'slug').distinct()
    if type == "images":
        files = ImageUp.objects.filter(
            Q(shared_to__username__exact=user) |
            Q(author__user__username__exact=user)).order_by('-uploaded', 'slug').distinct()
    if files is None:
        files = SlackFile.objects.filter(
            Q(shared_to__username__exact=user) |
            Q(author__user__username__exact=user)).order_by('-uploaded', 'slug').distinct()
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


def get_generic_files(files):
    data = []
    for file in files:
        data.append(get_file_by_type(file))
    return data


def get_generic_msg(msg):
    result = []
    for inst in msg:
        if isinstance(inst, MessageInstEvent):
            serializer = MessageInstEventSerializer(inst.messageinstevent)
            result.append(serializer.data)
        if isinstance(inst, FileSharedEvent):
            serializer = FileSharedEventSerializer(inst.filesharedevent)
            result.append(serializer.data)
        if isinstance(inst, FileCommentEvent):
            serializer = FileCommentEventSerializer(inst.filecommentevent)
            result.append(serializer.data)
    print result
    return result


def get_msg(msg):
    result = []
    if isinstance(msg, MessageInstEvent):
        serializer = MessageInstEventSerializer(msg)
        result = serializer.data
    if isinstance(msg, FileSharedEvent):
        serializer = FileSharedEventSerializer(msg)
        result = serializer.data
    if isinstance(msg, FileCommentEvent):
        serializer = FileCommentEventSerializer(msg)
        result = serializer.data
    return result
