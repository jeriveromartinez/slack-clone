"""
WSGI config for plataforma project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
from django.core.management import execute_from_command_line
from conf.settings.base import SITE_ROOT

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "conf.settings.base")

execute_from_command_line([SITE_ROOT + 'manage.py', 'runserver_socketio'])
# application = get_wsgi_application()
