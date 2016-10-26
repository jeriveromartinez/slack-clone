from django.conf.urls import url, include

urlpatterns = [
    url(r'^settings/$', 'system_account.views.setting_account', name='settings'),
    url(r'^logs/$', 'system_account.views.setting_log', name='logs'),
    url(r'^profile/$', 'system_account.views.setting_profile', name='profile'),
    url(r'^profile/edit/$', 'system_account.views.setting_profile_edit', name='profile_edit'),
    url("", include("django_socketio.urls")),
]
