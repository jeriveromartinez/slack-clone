from django.conf.urls import include, url

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from conf.settings.base import MEDIA_ROOT

admin.autodiscover()

urlpatterns = [
    # User management
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^login/$', 'plataforma.views.login_page', name="login"),
    url(r'^login/find/$', 'plataforma.views.find_team', name='find_team'),
    url(r'^registro/$', 'plataforma.views.registro', name="registro"),
    url(r'^$', 'plataforma.views.homepage_logged', name="homepage"),
    url(r'^logout/$', 'plataforma.views.logout_view', name="logout"),
    url(r'^apps/$', 'plataforma.views.apps', name="apps"),
    url(r'^account/', include('system_account.urls', namespace='account')),
    url(r'^api/', include('rest_service.urls', namespace='api')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': MEDIA_ROOT}),

    # url(r'^proto/', include('proto.urls', namespace="proto")),
    # url(r'^conceptboard/', include('conceptboard.urls', namespace="conceptboard")),
    # url(r'^sharedocs/', include('sharedocs.urls', namespace="sharedocs")),
    # url(r'^solidify/', include('solidifyapp.urls', namespace="solidifyapp")),
    # url(r'^lucid/', include('lucid.urls', namespace="lucid")),
]  # + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += staticfiles_urlpatterns()

"""
if settings.DEBUG:
   # This allows the error pages to be debugged during development, just visit
   # these url in browser to see how these error pages look like.
   urlpatterns += [
       url(r'^400/$', default_views.bad_request),
       url(r'^403/$', default_views.permission_denied),
       url(r'^404/$', default_views.page_not_found),
       url(r'^500/$', default_views.server_error),
   ]
   """
