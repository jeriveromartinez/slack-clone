# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'Company name', max_length=255)),
                ('slug', models.SlugField(null=True, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ('created',),
            },
        ),
        migrations.CreateModel(
            name='FilesComment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('comment', models.TextField()),
                ('published', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ('published',),
            },
        ),
        migrations.CreateModel(
            name='FilesUp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('file_up', models.FileField(null=True, upload_to=b'files/', blank=True)),
                ('uploaded', models.DateTimeField(auto_now_add=True)),
                ('slug', models.SlugField(editable=False)),
                ('owner', models.OneToOneField(related_name='file_up_owner', to=settings.AUTH_USER_MODEL)),
                ('shared_to', models.ManyToManyField(related_name='file_up_shared_to', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('uploaded',),
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('msg', models.TextField()),
                ('date_pub', models.DateTimeField(auto_now_add=True)),
                ('user_from', models.ForeignKey(related_name='msg_from', to=settings.AUTH_USER_MODEL)),
                ('user_to', models.ForeignKey(related_name='msg_to', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('date_pub',),
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.ImageField(null=True, upload_to=b'images/', blank=True)),
                ('type', models.CharField(max_length=5, choices=[('owner', 'Owner'), ('guest', 'Guest')])),
                ('company', models.ForeignKey(related_name='company', to='plataforma.Company')),
                ('user', models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'public', max_length=255)),
                ('slug', models.SlugField(null=True, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(related_name='room', to='plataforma.Company')),
            ],
            options={
                'ordering': ('created',),
            },
        ),
        migrations.CreateModel(
            name='Snippet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.TextField()),
                ('date_pub', models.DateTimeField(auto_now_add=True)),
                ('users_shared', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('date_pub',),
            },
        ),
        migrations.AddField(
            model_name='filescomment',
            name='file_up',
            field=models.ForeignKey(related_name='comment_file', to='plataforma.FilesUp'),
        ),
        migrations.AddField(
            model_name='filescomment',
            name='user',
            field=models.ForeignKey(related_name='comment_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
