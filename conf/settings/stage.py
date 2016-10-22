"""Development settings and globals."""

from base import *

########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
TEMPLATE_DEBUG = DEBUG
########## END DEBUG CONFIGURATION


########## DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'plataforma',
        'USER': 'julio',
        'PASSWORD': 'ju1io',
        'HOST': 'localhost',
        'PORT': 5432,
    }
}
########## END DATABASE CONFIGURATION


########## CACHE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}
########## END CACHE CONFIGURATION


########## EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
########## END EMAIL CONFIGURATION


########## Email configuration
# Route email through Amazon SES via Celery
# EMAIL_BACKEND = 'seacucumber.backend.SESBackend'
# MAILER_EMAIL_BACKEND = 'seacucumber.backend.SESBackend'

DEFAULT_FROM_EMAIL = 'smsqva@gmail.com'
EMAIL_HOST_USER = 'smsqva@gmail.com'
EMAIL_HOST_PASSWORD = 'veritate2012'
EMAIL_PORT = 587
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True

########## END Email configuration
