# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Count
from datetime import datetime, timedelta
from django.db.models.signals import post_delete, post_save
from django.contrib.auth.signals import user_logged_in
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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, related_name='company')
    type = models.CharField(choices=CHOICE, blank=False, null=False, max_length=5)
    socketsession = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.user.username


class Room(models.Model):
    name = models.CharField(max_length=255, null=False, default="public")
    slug = models.SlugField(null=True, blank=True)
    company = models.ForeignKey(Company, related_name='room')
    created = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(Profile, related_name='users_room')
    purpose = models.CharField(max_length=255, null=False, default="public")

    class Meta:
        ordering = ('created',)

    def __str__(self):
        return self.name + ' ' + self.company.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Room, self).save(*args, **kwargs)


class SlackFile(PolymorphicModel):
    title = models.CharField(null=True, blank=True, max_length=255)
    author = models.ForeignKey(Profile, related_name='file_up_owner')
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


class Post(SlackFile):
    code = models.TextField(blank=False, null=False)

    def __str__(self):
        return 'post - ' + self.date_pub.__str__()


class Snippet(SlackFile):
    code = models.TextField(blank=False, null=False)

    def __str__(self):
        return 'snippets - ' + self.date_pub.__str__()


class GoogleDocs(SlackFile):
    url = models.URLField(null=False, blank=False)

    def __str__(self):
        return 'google_docs - ' + self.date_pub.__str__()


class FilesUp(SlackFile):
    file_up = models.FileField(upload_to='files/', blank=True, null=True)

    def __str__(self):
        return 'files_up - ' + self.uploaded.__str__()


class ImageUp(FilesUp):
    def __str__(self):
        return 'images_up - ' + self.uploaded.__str__()


class FilesComment(models.Model):
    file_up = models.ForeignKey(FilesUp, related_name='files_comments')
    comment = models.TextField(blank=False, null=False)
    published = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name='comment_user')

    class Meta:
        ordering = ('published',)

    def __str__(self):
        return self.user.username + ' - ' + self.file_up.file_up.name + ' - ' + self.published.__str__()


class UserLogger(models.Model):
    user = models.ForeignKey(User, related_name="user_logger")
    time_login = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ('-time_login',)

    def __str__(self):
        return self.user.username + ' ' + self.time_login.__str__()


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
    user_to = models.ForeignKey(User, related_name='user_to')
    user_from = models.ForeignKey(User, related_name='user_from')

    class Meta:
        ordering = ('-date_pub',)


class MessageInstEvent(MessageEvent):
    msg = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.user_from.username + ' <-> ' + self.user_to.username + ' -> ' + self.date_pub.__str__()


class FileSharedEvent(MessageEvent):
    file_up = models.ForeignKey(FilesUp, related_name='files_comments_event_share')


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
def delete_user(sender, instance=None, **kwargs):  # no borrar nada de aqui
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

        communication = Communication.objects.filter(user_me=instance.messageevent_ptr.user_from,
                                                     user_connect=instance.messageevent_ptr.user_to) \
            .update(date_pub=datetime.now())

        if not communication:
            messages = MessageEvent.objects.all().filter(readed=False,
                                                         user_to__username=instance.messageevent_ptr.user_to.username) \
                .values("user_to__username") \
                .annotate(
                total=Count('readed')) \
                .order_by('user_to')

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
