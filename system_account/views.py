from __future__ import print_function
import tempfile
from rexec import FileWrapper

from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect
from django.db.models import Q

from plataforma.forms import SnippetForm, PostForm
from plataforma.models import *
from system_account.forms import *
from conf.settings.base import SITE_ROOT


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
            print(formP.is_valid(), formP.errors, type(formP.errors))
    else:
        formP = ProfileForm(instance=request.user.user_profile)
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


@login_required(login_url='/login/')
def home_profile(request):
    return render_to_response('account/acc_home.html', context_instance=RequestContext(request))


@login_required(login_url='/login/')
def files_profile(request):
    partners = Profile.objects.filter(company__slug=request.user.user_profile.company.slug).exclude(
        user__username=request.user.username)
    return render_to_response('account/acc_files.html', {'partners': partners},
                              context_instance=RequestContext(request))


@csrf_protect
@login_required(login_url='/login/')
def post(request, slug=None):
    post_inst = Post.objects.filter(slug=slug)
    if request.method == "POST":
        if post_inst.__len__() > 0:
            form = PostForm(data=request.POST or None, instance=post_inst[0] or None)
        else:
            form = PostForm(data=request.POST or None)
        if form.is_valid():
            data = form.save(commit=False)
            author = Profile.objects.filter(user__username=request.user.username)[0]
            data.author = author
            data.save()
            return redirect('account:file')
        else:
            print(form.is_valid(), form.errors, type(form.errors))
    else:
        if post_inst.__len__() > 0:
            form = PostForm(instance=post_inst[0] or None)
        else:
            form = PostForm()
    return render_to_response('account/files/post.html', {'form': form}, context_instance=RequestContext(request))


@csrf_protect
@login_required(login_url='/login/')
def snippet(request, slug=None):
    snippet_inst = Snippet.objects.filter(slug=slug)
    if request.method == "POST":
        if snippet_inst.__len__() > 0:
            form = SnippetForm(data=request.POST or None, instance=snippet_inst[0] or None)
        else:
            form = SnippetForm(data=request.POST or None)
        if form.is_valid():
            data = form.save(commit=False)
            author = Profile.objects.filter(user__username=request.user.username)[0]
            data.author = author
            data.save()
            return redirect('account:file')
        else:
            print(form.is_valid(), form.errors, type(form.errors))
    else:
        if snippet_inst.__len__() > 0:
            form = SnippetForm(instance=snippet_inst[0] or None)
        else:
            form = SnippetForm()
    return render_to_response('account/files/snippet.html', {'form': form}, context_instance=RequestContext(request))


@login_required(login_url='/login/')
def file_detail(request, slug):
    file = get_object_or_404(SlackFile, slug=slug)
    comments = FilesComment.objects.filter(file_up=file).order_by('-published')[:10]
    isImage = isFile = False
    if isinstance(file, ImageUp):
        isImage = True
    if isinstance(file, FilesUp):
        isFile = True
    return render_to_response('account/files/details.html',
                              {'file': file, 'isImage': isImage, 'isFile': isFile, 'comments': comments},
                              context_instance=RequestContext(request))


@login_required(login_url='/login/')
def delete_file(request, slug):
    file = get_object_or_404(SlackFile, slug=slug)
    file.delete()
    return redirect('account:file')


def get_file(request, slug):
    item = get_object_or_404(SlackFile, slug=slug)
    if item is not None:
        if isinstance(item, Snippet):
            try:
                name = item.title + ".txt"
                temp = tempfile.TemporaryFile()
                temp.write(item.code)
                temp.flush()
                temp.seek(0)
                wrapper = FileWrapper(temp)
            except Exception as e:
                print(e)
        elif isinstance(item, FilesUp):
            wrapper = FileWrapper(file(SITE_ROOT + item.file_up.url))
            name = item.title + "." + item.extension
        elif isinstance(item, ImageUp):
            wrapper = FileWrapper(file(SITE_ROOT + item.image_up.url))
            name = item.title + "." + item.extension
        elif isinstance(item, Post):
            try:
                name = item.title + ".txt"
                temp = tempfile.TemporaryFile()
                temp.write(item.code)
                temp.flush()
                temp.seek(0)
                wrapper = FileWrapper(temp)
            except Exception as e:
                print(e)

        response = HttpResponse(wrapper, content_type='application/force-download')
        response['Content-Disposition'] = 'attachment; filename=' + name
        return response


@login_required(login_url='/login/')
def get_messages(request):
    msg = MessageEvent.objects.filter(Q(user_to=request.user) | Q(user_from=request.user)).order_by(
        'date_pub').distinct()[:10]
    return render_to_response('account/acc_conversations.html', {'msg': msg}, context_instance=RequestContext(request))


@login_required(login_url='/login/')
def get_team_directory(request):
    profiles = Profile.objects.filter(company=request.user.user_profile.company)
    return render_to_response('account/acc_team_directory.html', {'team': profiles},
                              context_instance=RequestContext(request))
