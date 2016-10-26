from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404, redirect

# Create your views here.
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect

from system_account.forms import *


@login_required(login_url='/login/')
def setting_account(request):
    return render_to_response('account/acc_settings.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def setting_log(request):
    return render_to_response('account/acc_logs.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def setting_profile(request):
    return render_to_response('account/acc_profile.html', context_instance=RequestContext(request))


@csrf_protect
@login_required(login_url='/login/')
def setting_profile_edit(request):
    user = get_object_or_404(User, username=request.user.username)
    profile = get_object_or_404(Profile, user=user)

    if request.method == "POST":
        formP = ProfileForm(data=request.POST or None, instance=profile)
        # files=request.FILES, TODO: ver como cono le meto las imagenes
        formU = UserForm(data=request.POST or None, instance=user)
        if formU.is_valid():
            formU.save()
        if formP.is_valid():
            formP.save()
            return redirect('account:profile')
    else:
        formP = ProfileForm(instance=request.user.profile)
        formU = UserForm(instance=request.user)

    return render_to_response('account/acc_edit_profile.html', {'formP': formP, 'formU': formU},
                              context_instance=RequestContext(request))
