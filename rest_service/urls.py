from django.conf.urls import url

urlpatterns = [
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/room/(?P<room_name>[0-9a-zA-Z_-]+)/$', 'rest_service.views.room_by_company',
        name='api-room'),
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/users/$', 'rest_service.views.users_by_company', name='api-company-profile'),
    url(r'^(?P<company>[0-9a-zA-Z_-]+)/users-logged/$', 'rest_service.views.users_logged', name='api-user-logged'),

    url(r'^profile/(?P<username>[0-9a-zA-Z_-]+)/$', 'rest_service.views.profile_by_username', name='api-profile'),
    url(r'^profile/(?P<username>[0-9a-zA-Z_-]+)/path/$', 'rest_service.views.get_url_user_path',
        name='api-profile-path'),
    url(r'^profile/(?P<username>[0-9a-zA-Z_-]+)/change/$', 'rest_service.views.change_user',
        name='api-profile-path'),

    url(r'^files/upload/(?P<from_user>[0-9a-zA-Z_-]+)/(?P<type>[a-z]+)/(?P<to>[0-9a-zA-Z_-]+)/$',
        'rest_service.views.save_files', name='api-files-save'),
    url(r'^files/(?P<username>[0-9a-zA-Z_-]+)/detail/(?P<file>[0-9a-zA-Z_-]+)/$', 'rest_service.views.get_details_file',
        name='api-file-detail'),
    url(r'^files/(?P<username>[0-9a-zA-Z_-]+)/(?P<company>[0-9a-zA-Z_-]+)/$', 'rest_service.views.get_files',
        name='api-files'),
    url(r'^files/(?P<username>[0-9a-zA-Z_-]+)/$', 'rest_service.views.get_files', name='api-files-company'),

    url(r'^messages/(?P<username>[0-9a-zA-Z_-]+)/(?P<page>[0-9]+)$', 'rest_service.views.get_message_by_user',
        name='api-message'),
]
