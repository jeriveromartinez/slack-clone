# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from django.db import models
from django.template.defaultfilters import slugify


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


class Room(models.Model):
    name = models.CharField(max_length=255, null=False, default="public")
    slug = models.SlugField(null=True, blank=True)
    company = models.ForeignKey(Company, related_name='room')
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created',)

    def __str__(self):
        return self.name + ' ' + self.company.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Room, self).save(*args, **kwargs)


# Message EVENTS Begin
class MessageEvent(models.Model):
    CHOICE = (
        (u'message_int_event', u'message_int_event'),
        (u'room_message_event', u'room_message_event'),
        (u'file_shared_event', u'file_shared_event'),
        (u'file_comment_event', u'file_comment_event'),
    )
    type = models.CharField(choices=CHOICE, blank=False, null=False, max_length=5)
    readed = models.BooleanField(default=False)
    date_pub = models.DateTimeField(auto_now_add=True)
    is_stared = models.BooleanField(default=False)

    class Meta:
        ordering = ('date_pub',)


class RoomMessageEvent(MessageEvent):
    room = models.ForeignKey(Room, related_name='room')
    user_msg = models.ForeignKey(User, related_name='user_msg')
    msg = models.TextField(blank=False, null=False)


class MessageInstEvent(MessageEvent):
    user_to = models.ForeignKey(User, related_name='msg_to')
    user_from = models.ForeignKey(User, related_name='msg_from')
    msg = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.user_from.username + ' <-> ' + self.user_to.username + ' -> ' + self.date_pub.__str__()


class FileSharedEvent(MessageEvent):
    file_up = models.ForeignKey(FilesUp, related_name='files_comments')
    user_shared = models.ForeignKey(User, related_name='user_shared')


class FileCommentEvent(MessageEvent):
    file_up = models.ForeignKey(FilesComment, related_name='files_comments')
    user_comment = models.ForeignKey(User, related_name='user_comment')


# Message EVENTS End

class Profile(models.Model):
    CHOICE = (
        (u'owner', u'Owner'),
        (u'guest', u'Guest'),
    )

    image = models.ImageField(upload_to='images/', blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    company = models.ForeignKey(Company, related_name='company', on_delete=models.CASCADE)
    type = models.CharField(choices=CHOICE, blank=False, null=False, max_length=5)
    socketsession = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.user.username

    def delete(self, using=None):
        if self.type == 'owner':
            self.user.delete()
            self.company.delete()


class Snippet(models.Model):
    code = models.TextField(blank=False, null=False)
    date_pub = models.DateTimeField(auto_now_add=True)
    users_shared = models.ManyToManyField(User)
    date_pub = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_pub',)

    def __str__(self):
        return 'snippets - ' + self.date_pub.__str__()


class FilesUp(models.Model):
    file_up = models.FileField(upload_to='files/', blank=True, null=True)
    owner = models.ForeignKey(User, related_name='file_up_owner')
    shared_to = models.ManyToManyField(User, related_name='file_up_shared_to')
    uploaded = models.DateTimeField(auto_now_add=True)
    company = models.ForeignKey(Company, related_name='file_company')
    slug = models.SlugField(blank=False, null=False, editable=False)

    class Meta:
        ordering = ('uploaded',)

    def __str__(self):
        return self.owner.username + ' - ' + self.uploaded.__str__()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.file_up.name)
        super(FilesUp, self).save(*args, **kwargs)


class FilesComment(models.Model):
    file_up = models.ForeignKey(FilesUp, related_name='files_comments')
    comment = models.TextField(blank=False, null=False)
    published = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name='comment_user')

    class Meta:
        ordering = ('published',)

    def __str__(self):
        return self.user.username + ' - ' + self.file_up.file_up.name + ' - ' + self.published.__str__()


class StarItem(models.Model):
    use = models.ForeignKey(User, related_name='user')
    type = models.CharField(max_length=255, null=False)
    refer_id = models.IntegerField(null=False)
