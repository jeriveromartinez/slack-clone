from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect

from plataforma.forms import LoginForm
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
    return render_to_response('registro/register_first.html', RequestContext(request))


@csrf_protect
def create(request):
    if request.method == "POST":
        post = request.POST

        username = post.get("username")
        password = post.get("password")
        first_name = post.get("firstName")
        last_name = post.get("lastName")
        email = post.get("email")

        user = User.objects.create_user(username, email, password)
        user.first_name = first_name
        user.last_name = last_name
        user.is_active = True
        user.save()

        name_company = post.get("company")
        company = Company.objects.create(name=name_company)
        Profile.objects.create(user=user, company=company, type="owner")
        user = authenticate(username=username, password=password)
        login(request, user)
        return JsonResponse({'action': 'success'})
    else:
        email = request.GET.get("signup_email")

    return render_to_response('registro/register_steps.html', {'username': email.split("@")[0], 'email': email},
                              RequestContext(request))


@login_required(login_url='/login/')
def apps(request):
    return render_to_response('welcome.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def logout_view(request):
    logout(request)
    return redirect('app:homepage')


def find_team(request):
    return render_to_response('find_team.html', context_instance=RequestContext(request))


def invite_user(request):
    return render_to_response('chat/invite.html', context_instance=RequestContext(request))
