from django.urls import path

from . import views

urlpatterns = [
    path('csrf', views.csrf, name='csrf'),
    path('sign_up', views.sign_up, name='sign_up'),
    path('sign_in', views.sign_in, name='sign_in'),
    path('sign_out', views.sign_out, name='sign_out'),
    path('delete_account', views.delete_account, name='delete_account'),
    path('whoami', views.whoami, name='whoami'),
    path('friends_list_detailed', views.friends_list_detailed,
         name='friends_list_detailed'),
    path('ask_friend', views.ask_friend, name='ask_friend'),
    path('reject_friend', views.reject_friend, name='reject_friend'),
    path('send_message', views.send_message, name='send_message'),
    path('get_messages', views.get_messages, name='get_messages'),
]
