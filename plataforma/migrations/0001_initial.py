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
            name='Profile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.FileField(null=True, upload_to=b'images/', blank=True)),
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
    ]
