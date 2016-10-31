from django.conf.urls import url

urlpatterns = [
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/room/(?P<room_name>[0-9a-zA-Z_-]+)/$', 'rest_service.views.room_by_company',
        name='api-room'),
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/users/$', 'rest_service.views.users_by_company', name='api-company-profile'),
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/users-logged/$', 'rest_service.views.users_logged', name='api-user-logged'),
    url(r'^profile/(?P<username>[0-9a-zA-Z_-]+)/$', 'rest_service.views.profile_by_username', name='api-profile'),
    url(r'^files/(?P<username>[0-9a-zA-Z_-]+)/(?P<company>[0-9a-zA-Z_-]+)/$', 'rest_service.views.get_files',
        name='api-files'),
    url(r'^files/(?P<username>[0-9a-zA-Z_-]+)/$', 'rest_service.views.get_files', name='api-files-company'),
]
