import json
import uuid

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse
from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect
from rest_framework.reverse import reverse

from plataforma.forms import LoginForm
from plataforma.serializers import *
from plataforma.utils import Email
import shortuuid


def login_page(request):
    message = None

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = request.POST['email']
            password = request.POST['password']
            try:
                username = User.objects.get(email=username).username
                user = authenticate(username=username, password=password)
                if user is not None:
                    if user.is_active:
                        login(request, user)
                        # message = "Se ha logueado de correctamente"
                        return redirect('app:homepage')
                    else:
                        message = "Su usuario esta inactivo"
                else:
                    message = "Nombre de usuario y/o password incorrecto. Por favor vuelva a intentarlo"
            except Exception:
                message = "Nombre de usuario y/o password incorrecto. Por favor vuelva a intentarlo"
    else:
        form = LoginForm()
    return render_to_response('registro/login.html', {'message': message, 'form': form},
                              context_instance=RequestContext(request))


def homepage_logged(request):
    if request.user.is_authenticated():
        return render_to_response('chat/templates.html', context_instance=RequestContext(request))
    else:
        return render_to_response('welcome.html', context_instance=RequestContext(request))


@csrf_protect
def register(request):
    return render_to_response('registro/register_first.html', RequestContext(request))


@csrf_protect
def create(request):
    if request.method == "POST":
        post = json.loads(request.body)

        username = post["username"]
        password = post["password"]
        first_name = post["firstName"]
        last_name = post["lastName"]
        email = post["email"]
        invite = post["invite"]

        user = User.objects.create_user(username, email, password)
        user.first_name = first_name
        user.last_name = last_name
        user.is_active = True
        user.save()

        name_company = post.get("company")
        company = Company.objects.create(name=name_company)
        site_info = {'protocol': request.is_secure() and 'https' or 'http'}
        site_info['root'] = site_info['protocol'] + '://' + request.get_host()

        try:
            for element in invite:
                slug = slugify(datetime.now().__str__() + element)
                UserInvited.objects.create(email=element, company=company, slug_activation=slug)
                invite_url = site_info['root'] + reverse('app:register_create', kwargs={'slug': slug})
                Email.send(element, 'topic', invite_url)
        except Exception as e:
            print e

        Profile.objects.create(user=user, company=company, type="owner")
        user = authenticate(username=username, password=password)
        login(request, user)
        return JsonResponse({'action': 'success'})
    else:
        email = request.GET.get("signup_email")

    return render_to_response('registro/register_steps.html',
                              {'username': email.split("@")[0], 'email': email}, RequestContext(request))


@login_required(login_url='/login/')
def apps(request):
    return render_to_response('welcome.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def logout_view(request):
    logout(request)
    return redirect('app:homepage')


def find_team(request):
    return render_to_response('find_team.html', context_instance=RequestContext(request))


def invite_user(request, slug=None):
    invitation = get_object_or_404(UserInvited, slug_activation=slug)
    if request.method == "POST":
        try:
            first_name = request.POST['firstName']
            last_name = request.POST['lastName']
            username = request.POST['username']
            password = request.POST['password']

            user = User.objects.create_user(username, invitation.email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.is_active = True
            user.save()

            company = Company.objects.filter(slug=invitation.company.slug)[0]
            Profile.objects.create(user=user, company=company, type="guest")
            user = authenticate(username=username, password=password)
            login(request, user)
            invitation.delete()
            return redirect('app:homepage')
        except Exception as e:
            print e

    return render_to_response('registro/register_user_invited.html', {'username': invitation.email.split("@")[0]},
                              context_instance=RequestContext(request))


def call(request, roomname):
    if request.method == "POST":
        usercall = request.POST['usercall']
        profile = Profile.objects.filter(user__username=request.user.username)[0]
        name = shortuuid.uuid()
        room = RoomCall.objects.get_or_create(name=name, usercreator=profile)[0]
        room.users.add(profile)
        room.save()
        serializer = ProfileSerializer(room.users.all(), many=True)
        users = json.dumps(serializer.data)
        return render_to_response('call/template.html',
                                  {'room': room.name, 'users': users, 'usercall': usercall, 'action': "created"},
                                  RequestContext(request))
    if request.method == "GET":
        room = RoomCall.objects.get(name=roomname)

        serializer = ProfileSerializer(room.users.all(), many=True)
        users = json.dumps(serializer.data)
        if request.user == room.usercreator:
            return render_to_response('call/template.html',
                                      {'room': room.name, 'users': users, 'action': "created"},
                                      RequestContext(request))
        else:
            profile = Profile.objects.filter(user__username=request.user.username)[0]
            room.users.add(profile)
            room.save()
            return render_to_response('call/template.html',
                                      {'room': room.name, 'users': users, 'action': "joined"},
                                      RequestContext(request))
