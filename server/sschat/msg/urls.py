from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('ping/', views.ping, name='ping'),
    path('sign_up/', views.sign_up, name='sign_up'),
    path('sign_in/', views.sign_in, name='sign_in'),
    path('sign_out/', views.sign_out, name='sign_out'),
    # path('ping_user/', views.ping_user, name='ping_user'),
]