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
        return self.name

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


class Profile(models.Model):
    CHOICE = (
        (u'owner', u'Owner'),
        (u'guest', u'Guest'),
    )

    image = models.ImageField(upload_to='images/', blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    company = models.ForeignKey(Company, related_name='company')
    type = models.CharField(choices=CHOICE, blank=False, null=False, max_length=5)

    def __str__(self):
        return self.user.username


class Message(models.Model):
    user_to = models.ForeignKey(User, related_name='msg_to')
    user_from = models.ForeignKey(User, related_name='msg_from')
    msg = models.TextField(blank=False, null=False)
    date_pub = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_pub',)

    def __str__(self):
        return self.user_to + '-' + self.date_pub


class Snippet(models.Model):
    code = models.TextField(blank=False, null=False)
    date_pub = models.DateTimeField(auto_now_add=True)
    users_shared = models.ManyToManyField(User)
    date_pub = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_pub',)

    def __str__(self):
        return self.users_shared + '-' + self.date_pub


class FilesUp(models.Model):
    file_up = models.FileField(upload_to='files/', blank=True, null=True)
    owner = models.OneToOneField(User, related_name='file_up_owner')
    shared_to = models.ManyToManyField(User, related_name='file_up_shared_to')
    uploaded = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(blank=False, null=False, editable=False)

    class Meta:
        ordering = ('uploaded',)

    def __str__(self):
        return self.owner + '-' + self.uploaded

    def save(self, *args, **kwargs):
        self.slug = slugify(self.file_up.name)
        super(FilesUp, self).save(*args, **kwargs)


class FilesComment(models.Model):
    file_up = models.ForeignKey(FilesUp, related_name='comment_file')
    comment = models.TextField(blank=False, null=False)
    published = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name='comment_user')

    class Meta:
        ordering = ('published',)

    def __str__(self):
        return self.user.username + '-' + self.file_up.file_up.name + '-' + self.published.date()
