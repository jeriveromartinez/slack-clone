from django.conf.urls import include, url

urlpatterns = [
    # User management
    url(r'^$', 'plataforma.views.homepage_logged', name="homepage"),
    url(r'^login/$', 'plataforma.views.login_page', name="login"),
    url(r'^login/find/$', 'plataforma.views.find_team', name='find_team'),
    url(r'^register/$', 'plataforma.views.register', name="register"),
    url(r'^logout/$', 'plataforma.views.logout_view', name="logout"),
    url(r'^apps/$', 'plataforma.views.apps', name="apps"),
]
