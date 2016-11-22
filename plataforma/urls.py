from django.conf.urls import url

urlpatterns = [
    # Chat management
    url(r'^$', 'plataforma.views.homepage_logged', name="homepage"),
    url(r'^login/$', 'plataforma.views.login_page', name="login"),
    url(r'^login/find/$', 'plataforma.views.find_team', name='find_team'),
    url(r'^logout/$', 'plataforma.views.logout_view', name="logout"),
    url(r'^apps/$', 'plataforma.views.apps', name="apps"),
    url(r'^register/$', 'plataforma.views.register', name="register"),
    url(r'^register/create/$', 'plataforma.views.create', name="register_create"),
    url(r'^register/create/(?P<slug>[0-9a-zA-Z_-]+)/$', 'plataforma.views.invite_user', name="register_create"),
    url(r'^invite/$', 'plataforma.views.invite_user', name='invite_user'),
    url(r'^call/$', 'plataforma.views.call', name='call_user'),
]
