"""Development settings and globals."""

########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True
########## END DEBUG CONFIGURATION

########## DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'plataforma',
        'USER': 'julio',
        'PASSWORD': 'ju1io',
        'HOST': '127.0.0.1',
        'PORT': '3306',
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

SECRET_KEY = 'j2lz^0_c8&aoat9!bh*kf%6$iickatff585yxjm&#a!v@-c$_$'
########## END CACHE CONFIGURATION
