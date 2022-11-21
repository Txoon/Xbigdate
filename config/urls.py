from django.conf.urls import url, include

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    #url(r'^', include('hello_world.urls')),
    path('', include('game.urls.index')),
]
