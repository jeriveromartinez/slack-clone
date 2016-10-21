from django.conf.urls import url

urlpatterns = [
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/room/$', 'plataforma.views.room_by_company', name='api-room'),
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/users/$', 'plataforma.views.users_by_company', name='api-company-profile'),
    url(r'^profile/(?P<username>[0-9a-zA-Z_-]+)', 'plataforma.views.profile_by_username', name='api-profile')
]
