from django.conf.urls import url

urlpatterns = [
    url(r'^$', 'system_account.views.home_profile', name='profile_home'),
    url(r'^settings/$', 'system_account.views.setting_account', name='settings'),
    url(r'^logs/$', 'system_account.views.setting_log', name='logs'),
    url(r'^profile/edit/$', 'system_account.views.setting_profile_edit', name='profile_edit'),
    url(r'^profile/(?P<username>[0-9a-zA-Z_-]+)/$', 'system_account.views.setting_profile', name='profile'),
    url(r'^deactivate/(?P<username>[0-9a-zA-Z_-]+)/$', 'system_account.views.deactivate_account', name='deactivate'),
    url(r'^file/$', 'system_account.views.files_profile', name='file'),
]
