from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.sessions.models import Session
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view
from rest_framework.response import Response

from plataforma.forms import LoginForm
from plataforma.forms import MyRegistrationForm
from plataforma.serializers import *


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
                        return redirect('homepage')
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
def registro(request):
    args = {}
    args.update(csrf(request))
    if request.method == 'POST':
        form = MyRegistrationForm(request.POST, request=request, instance=request.user)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/login')
        else:
            args['form'] = form
    else:
        args['form'] = MyRegistrationForm()

    return render_to_response('registro/index.html', args)


@login_required(login_url='/login/')
def apps(request):
    return render_to_response('welcome.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def logout_view(request):
    logout(request)
    return redirect('homepage')


def find_team(request):
    return render_to_response('find_team.html', context_instance=RequestContext(request))


@api_view(['GET'])
def room_by_company(request, company):
    room = Room.objects.all().filter(company__slug=company)
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
