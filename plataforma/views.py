from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect

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
    args = {}
    args.update(csrf(request))
    if request.method == 'POST':
        form = MyRegistrationForm(request.POST, request=request, instance=request.user)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/login')
        else:
            args['form'] = form

    return render_to_response('registro/register_first.html', RequestContext(request))


@login_required(login_url='/login/')
def apps(request):
    return render_to_response('welcome.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def logout_view(request):
    logout(request)
    return redirect('homepage')


def find_team(request):
    return render_to_response('find_team.html', context_instance=RequestContext(request))
