from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect

from system_account.forms import *
from plataforma.models import UserLogger


@login_required(login_url='/login/')
def setting_account(request):
    return render_to_response('account/acc_settings.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def setting_log(request):
    logs = UserLogger.objects.filter(user__username=request.user.username)[:10]
    return render_to_response('account/acc_logs.html', {'logs': logs},
                              context_instance=RequestContext(request))


@login_required(login_url='/login/')
def setting_profile(request, username):
    user = get_object_or_404(User, username=username)
    return render_to_response('account/acc_profile.html', {'user_profile': user},
                              context_instance=RequestContext(request))


@csrf_protect
@login_required(login_url='/login/')
def setting_profile_edit(request):
    user = get_object_or_404(User, username=request.user.username)
    profile = get_object_or_404(Profile, user__username=user)

    if request.method == "POST":
        formP = ProfileForm(data=request.POST or None, files=request.FILES or None, instance=profile)
        formU = UserForm(data=request.POST or None, instance=user)
        if formU.is_valid():
            formU.save()
        if formP.is_valid():
            formP.save()
            return redirect('account:profile', username=request.user.username)
        else:
            print formP.is_valid(), formP.errors, type(formP.errors)
    else:
        formP = ProfileForm(instance=request.user.profile)
        formU = UserForm(instance=request.user)

    return render_to_response('account/acc_edit_profile.html', {'formP': formP, 'formU': formU},
                              context_instance=RequestContext(request))


@login_required(login_url='/login/')
def deactivate_account(request, username):
    user = get_object_or_404(User, username=username)
    user.is_active = False
    user.save()
    logout(request)
    return redirect('app:login')
