from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('ping/', views.ping, name='ping'),
    # path('ping_user/', views.ping_user, name='ping_user'),
]