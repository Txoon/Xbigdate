from django.urls import path, include
from game.views.index import index
from django.conf import settings
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.views import static

urlpatterns = [
    path("", index, name="index"),
    path("menu/", include("game.urls.menu.index")),
    path("playground/", include("game.urls.playground.index")),
    path("settings/", include("game.urls.settings.index")),
    url(r'^static/(?P<path>.*)$', static.serve, {'document_root': settings.STATIC_ROOT}, name='static'),
]



