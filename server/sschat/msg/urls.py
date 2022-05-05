from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('ping', views.ping, name='ping'),
    path('csrf', views.csrf, name='csrf'),
    path('sign_up', views.sign_up, name='sign_up'),
    path('sign_in', views.sign_in, name='sign_in'),
    path('sign_out', views.sign_out, name='sign_out'),
    path('friends_list', views.friends_list, name='friends_list'),
    path('connected_friends', views.connected_friends, name='connected_friends'),
    path('friends_requests', views.friends_requests, name='friends_requests'),
    path('ask_friend', views.ask_friend, name='ask_friend'),
    path('accept_friend', views.accept_friend, name='accept_friend'),
    path('reject_friend', views.reject_friend, name='reject_friend'),
]