# -*- coding: utf-8 -*-
from datetime import datetime

from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_in
from django.db import models
from django.db.models import Count
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.template.defaultfilters import slugify
from django_user_agents.utils import get_user_agent
from ipware.ip import get_real_ip, get_ip
from polymorphic.models import PolymorphicModel


class Company(models.Model):
    name = models.CharField(max_length=255, default="Company name", null=False)
    slug = models.SlugField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created',)

    def __str__(self):
        return self.name + ' - ' + self.created.__str__()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Company, self).save(*args, **kwargs)


class Profile(models.Model):
    CHOICE = (
        (u'owner', u'Owner'),
        (u'guest', u'Guest'),
    )

    image = models.ImageField(upload_to='images/', blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    company = models.ForeignKey(Company, related_name='company')
    type = models.CharField(choices=CHOICE, blank=False, null=False, max_length=5)
    socketsession = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.user.username


class Room(models.Model):
    name = models.CharField(max_length=255, null=False, default="public")
    slug = models.SlugField(null=True, blank=True)
    company = models.ForeignKey(Company, related_name='room')
    usercreator = models.ForeignKey(Profile, related_name='creator')
    created = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(Profile, related_name='users_room')
    purpose = models.TextField(max_length=255, null=False)
    visibility = models.BooleanField(default=True);

    class Meta:
        ordering = ('created',)

    def __str__(self):
        return self.name + ' ' + self.company.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Room, self).save(*args, **kwargs)


class RoomCall(models.Model):
    name = models.CharField(max_length=255, null=False, )
    usercreator = models.ForeignKey(Profile, related_name='creatorcall')
    created = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(Profile, related_name='users_call')

    class Meta:
        ordering = ('created',)


class SlackFile(PolymorphicModel):
    title = models.CharField(null=True, blank=True, max_length=255)
    author = models.ForeignKey(Profile, related_name='file_up_owner', on_delete=models.CASCADE)
    shared_to = models.ManyToManyField(User, related_name='file_up_shared_to')
    uploaded = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(blank=False, null=False, editable=False)

    class Meta:
        ordering = ('-uploaded',)

    def __str__(self):
        return self.author.user.username + ' - ' + self.uploaded.__str__()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(SlackFile, self).save(*args, **kwargs)

    @staticmethod
    def get_data(self):
        data = None
        if isinstance(self, Snippet):
            data = self.code
        elif isinstance(self, Post):
            data = self.code
        elif isinstance(self, FilesUp):
            data = self.file_up.url
        elif isinstance(self, ImageUp):
            data = self.file_up.url
        return data


class Post(SlackFile):
    text = models.TextField(blank=False, null=False)

    def __str__(self):
        return 'post - ' + self.uploaded.__str__()


class Snippet(SlackFile):
    CHOICE = (
        (u'text', u'Plain Text'),
        (u'applescript', u'AppleScript'),
        (u'boxnote', u'BoxNote'),
        (u'c', u'C'),
        (u'csharp', u'C#'),
        (u'cpp', u'C++'),
        (u'css', u'CSS'),
        (u'csv', u'CSV'),
        (u'clojure', u'Clojure'),
        (u'coffeescript', u'CoffeeScript'),
        (u'cfm', u'Cold Fusion'),
        (u'crystal', u'Crystal'),
        (u'cypher', u'Cypher'),
        (u'd', u'D'),
        (u'dart', u'Dart'),
        (u'diff', u'Diff'),
        (u'dockerfile', u'Docker'),
        (u'erlang', u'Erlang'),
        (u'fsharp', u'F#'),
        (u'fortran', u'Fortran'),
        (u'gherkin', u'Gherkin'),
        (u'go', u'Go'),
        (u'groovy', u'Groovy'),
        (u'html', u'HTML'),
        (u'handlebars', u'Handlebars'),
        (u'haskell', u'Haskell'),
        (u'haxe', u'Haxe'),
        (u'java', u'Java'),
        (u'javascript', u'JavaScript'),
        (u'julia', u'Julia'),
        (u'kotlin', u'Kotlin'),
        (u'latex', u'LaTeX/sTeX'),
        (u'lisp', u'Lisp'),
        (u'lua', u'Lua'),
        (u'matlab', u'MATLAB'),
        (u'mumps', u'MUMPS'),  # a
        (u'markdown', u'Markdown'),
        (u'ocaml', u'OCaml'),
        (u'objc', u'Objective-C'),
        (u'php', u'PHP'),
        (u'pascal', u'Pascal'),
        (u'perl', u'Perl'),
        (u'pig', u'Pig'),
        (u'post', u'Post'),
        (u'powershell', u'PowerShell'),
        (u'puppet', u'Puppet'),
        (u'python', u'Python'),
        (u'r', u'R'),
        (u'ruby', u'Ruby'),
        (u'rust', u'Rust'),
        (u'sql', u'SQL'),
        (u'sass', u'Sass'),
        (u'scala', u'Scala'),
        (u'scheme', u'Scheme'),
        (u'shell', u'Shell'),
        (u'smalltalk', u'Smalltalk'),
        (u'swift', u'Swift'),
        (u'tsv', u'TSV'),
        (u'vb', u'VB.NET'),
        (u'vbscript', u'VBScript'),
        (u'velocity', u'Velocity'),
        (u'verilog', u'Verilog'),
        (u'xml', u'XML'),
        (u'yaml', u'YAML'),
    )
    type = models.CharField(blank=False, null=False, choices=CHOICE, max_length=50)
    code = models.TextField(blank=False, null=False)

    def __str__(self):
        return 'snippets - ' + self.uploaded.__str__()

    def save(self, *args, **kwargs):
        if self.title is None:
            self.title = 'Snippet - ' + self.author.user.username + ' - ' + self.uploaded.__str__()
        self.slug = slugify(self.title)
        super(Snippet, self).save(*args, **kwargs)


class GoogleDocs(SlackFile):
    url = models.URLField(null=False, blank=False)

    def __str__(self):
        return 'google_docs - ' + self.uploaded.__str__()


class FilesUp(SlackFile):
    file_up = models.FileField(upload_to='upload/docs/', blank=True, null=True)

    def __str__(self):
        return 'files_up - ' + self.uploaded.__str__()


class ImageUp(SlackFile):
    image_up = models.FileField(upload_to='upload/images/', blank=True, null=True)

    def __str__(self):
        return 'images_up - ' + self.uploaded.__str__()


class FilesComment(models.Model):
    file_up = models.ForeignKey(SlackFile, related_name='files_comments')
    comment = models.TextField(blank=False, null=False)
    published = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name='comment_user')

    class Meta:
        ordering = ('published',)

    def __str__(self):
        return 'Comment by ' + self.user.username + ' - ' + self.published.__str__()


class UserLogger(models.Model):
    user = models.ForeignKey(User, related_name="user_logger")
    time_login = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ('-time_login',)

    def __str__(self):
        return self.user.username + ' ' + self.time_login.__str__()


class UserInvited(models.Model):
    email = models.EmailField(max_length=255)
    company = models.ForeignKey(Company, related_name='invited_company')
    slug_activation = models.SlugField(null=True, blank=True)


# Message EVENTS Begin
class MessageEvent(PolymorphicModel):
    CHOICE = (
        (u'message_int_event', u'message_int_event'),
        (u'file_shared_event', u'file_shared_event'),
        (u'file_comment_event', u'file_comment_event'),
    )
    type = models.CharField(choices=CHOICE, blank=False, null=False, max_length=40)
    readed = models.BooleanField(default=False)
    date_pub = models.DateTimeField(auto_now_add=True)
    is_stared = models.BooleanField(default=False)
    room = models.ForeignKey(Room, blank=True, null=True, related_name='message_room')
    user_to = models.ForeignKey(User, related_name='user_to', null=True)
    user_from = models.ForeignKey(User, related_name='user_from')

    class Meta:
        ordering = ('-date_pub',)


class MessageInstEvent(MessageEvent):
    msg = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.user_from.username + ' <-> ' + self.user_to.username + ' -> ' + self.date_pub.__str__()


class FileSharedEvent(MessageEvent):
    file_up = models.ForeignKey(SlackFile, related_name='files_comments_event_share')


class FileCommentEvent(MessageEvent):
    file_up = models.ForeignKey(FilesComment, related_name='files_comments_event')


class Communication(models.Model):
    user_me = models.ForeignKey(User, related_name='user_me')
    user_connect = models.ForeignKey(User, related_name='user_connect')
    date_pub = models.DateTimeField(auto_now_add=True)
    un_reader_msg = models.IntegerField()
    stared = models.BooleanField(default=False)


# Message EVENTS End
@receiver(post_delete, sender=Profile)
def delete_user_profile(sender, instance=None, **kwargs):  # no borrar nada de aqui
    try:
        instance.user
        instance.company
    except (User.DoesNotExist, Profile.DoesNotExist) as e:
        print e
    else:
        instance.user.delete()
        instance.company.delete()


# Create Comunication between users
@receiver(post_save, sender=MessageInstEvent)
def delete_user(sender, instance=None, **kwargs):  # no borrar nada de aqui
    try:
        messages = MessageEvent.objects.all().filter(readed=False,
                                                     user_from__username=instance.messageevent_ptr.user_from.username) \
            .values("user_from__username").annotate(total=Count('readed')).order_by('user_to')

        communication = Communication.objects.filter(user_me=instance.messageevent_ptr.user_to,
                                                     user_connect=instance.messageevent_ptr.user_from) \
            .update(date_pub=datetime.now(), un_reader_msg=messages[0]['total'])

        if not communication:
            Communication.objects.create(user_me=instance.messageevent_ptr.user_from,
                                         user_connect=instance.messageevent_ptr.user_to,
                                         un_reader_msg=messages[0]['total'])

    except MessageEvent.DoesNotExist as e:
        print e


# SIGNAL
@receiver(user_logged_in)
def login_logger(request, **kwargs):  # no borrar nada de aqui
    user = User.objects.filter(username=request.user.username)[0]
    browser = get_user_agent(request)  # TODO: mejorar esto despues
    if get_real_ip(request) is not None:
        UserLogger.objects.create(user=user, ip_address=get_real_ip(request), description=browser)
    if get_ip(request) is not None:
        UserLogger.objects.create(user=user, ip_address=get_ip(request), description=browser)
