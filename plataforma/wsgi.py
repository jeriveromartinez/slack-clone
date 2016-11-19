"""
WSGI config for plataforma project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
# todo: quitar proxy
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "plataforma.settings")
proxyDict = {
              "http": "127.0.0.1:3128",
              "https": "127.0.0.1:3128"
            }

os.environ["PROXIES"] = proxyDict

application = get_wsgi_application()
