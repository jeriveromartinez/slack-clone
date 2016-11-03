from django.conf.urls import url, include

urlpatterns = [
    url(r'^settings/$', 'system_account.views.setting_account', name='settings'),
    url(r'^logs/$', 'system_account.views.setting_log', name='logs'),
    url(r'^profile/edit/$', 'system_account.views.setting_profile_edit', name='profile_edit'),
    url(r'^profile/(?P<username>[0-9a-zA-Z_-]+)/$', 'system_account.views.setting_profile', name='profile'),
]
