from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from config import settings
from django.conf import settings
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.views import static
urlpatterns = [
    path('admin/', admin.site.urls),
    #url(r'^', include('hello_world.urls')),
    path('', include('game.urls.index')),
    url(r'^static/(?P<path>.*)$', static.serve, {'document_root': settings.STATIC_ROOT}, name='static'),
]

