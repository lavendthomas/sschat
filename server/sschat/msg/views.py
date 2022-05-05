import json
import logging

from django.forms import ValidationError
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User


from django.db import models
from .models import Friendships, Profile

LOGGER = logging.getLogger(__name__)


def authentificated(function):
    def inner(request):
        LOGGER.info(str(request))
        if request.user.is_authenticated:
            return function(request)
        else:
            LOGGER.info("User not authenticated!" + str(request))
            return HttpResponse("User is not authentificated.")


# Create your views here.

def _validate_sign_in(request):
    # Log here!
    raise ValidationError("Invalid request!")

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def sign_in(request):
    LOGGER.info("sign_in" + str(request))
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']

    # Give the session cookie to the client
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
    else:
        return HttpResponse("Wrong username or password!")
    
    return HttpResponse("Welcome")
    

def sign_up(request):
    LOGGER.info("sign_up" + str(request))
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']
    
    client_ip = request.META['REMOTE_ADDR']

    # Check if the user already exists
    has_user = User.objects.filter(username=username).exists()
    if has_user:
        return HttpResponse("User already exists!")

    new_user: User = User.objects.create(username=username)
    new_user.set_password(password)       # Better for security

    new_profile = Profile.objects.create(user=new_user, ip_address=client_ip)

    new_user.save()
    new_profile.save()

    return HttpResponse("connected" + str(new_user) + "-" + str(new_profile))

def sign_out(request):
    logout(request)
    return HttpResponse("disconnected")

#@login_required(login_url='/msg/login/')
def ping(request):
    if request.user.is_authenticated:
        return JsonResponse({"result":"pong"})
    return JsonResponse({"result":"plouf"})

@login_required(login_url='/msg/sign_in')
def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


@login_required(login_url='/msg/sign_in')
def friends_list(request):
    # let's get all the friends of the user (where both accepted the friendship)
    friends_list = Profile.objects.filter(user=request.user).filter(user_accepted=True).filter(friend_accepted=True)
    friends_list.extend(Profile.objects.filter(friend=request.user).filter(user_accepted=True).filter(friend_accepted=True))
    print(friends_list)
    return HttpResponse("Your friends are: " + str(friends_list))


@login_required(login_url='/msg/sign_in')
def connected_friends(request):
    # let's get all the friends of the user (where both accepted the friendship)
    friends_list = Friendships.objects.filter(user_id=request.user).filter(user_accepted=True).filter(friend_accepted=True)
    friends_list.extend(Friendships.objects.filter(friend_id=request.user).filter(user_accepted=True).filter(friend_accepted=True))
    # filter only connected friends
    connected_friends = friends_list.filter(friend_id__is_client_connected=True)
    # TODO Get their IPs
    return HttpResponse("Your friends are: " + str(connected_friends))

@login_required(login_url='/msg/sign_in')
def friends_requests(request):
    # Get the requests of the user
    friends_requests = Friendships.objects.filter(user=request.user).filter(user_accepted=False)
    return HttpResponse("Your friends requests are: " + str(friends_requests))


@login_required(login_url='/msg/sign_in')
def ask_friend(request):
    body = json.loads(request.body.decode('utf-8'))
    friend_username: str = body['friend']

    # Make sure that the friend exists
    if not User.objects.filter(username=friend_username).exists():
        return HttpResponse("Friend does not exist!")

    friend = Profile.objects.get(user=User.objects.get(username=friend_username))
    user = Profile.objects.get(user=request.user)

    # Check if this user is already a friend
    if Friendships.objects.filter(user=user).filter(friend=friend).exists():
        return HttpResponse("You are already friends!")
    if Friendships.objects.filter(user=friend).filter(friend=user).exists():
        return HttpResponse("You are already friends!")
    

    # Everything is ok, create the friendship
    new_friendship = Friendships.objects.create(user=user, friend=friend, user_accepted=True, friend_accepted=False)
    new_friendship.save()
    return HttpResponse("Friendship created!")

@login_required(login_url='/msg/sign_in')
def accept_friend(request):
    body = json.loads(request.body.decode('utf-8'))
    friend_username: str = body['friend']

    # Make sure that the friend exists
    if not User.objects.filter(username=friend_username).exists():
        return HttpResponse("Friend does not exist!")

    friend = Profile.objects.get(user=User.objects.get(username=friend_username))
    user = Profile.objects.get(user=request.user)

    # Check if the user has a friendship with this friend
    pending_friendship = Friendships.objects.get(user=friend, friend=user)

    if (pending_friendship is None):
        return HttpResponse("You are not friends with this user!")
    else:
        pending_friendship.friend_accepted = True
        pending_friendship.save()
        return HttpResponse("Friendship accepted!")


@login_required(login_url='/msg/sign_in')
def reject_friend(request):
    body = json.loads(request.body.decode('utf-8'))
    friend = body['friend']

    # Check if the user has a friendship with this friend
    has_friendship_request = Friendships.objects.filter(user=friend).filter(friend=request.user).exists()

    if (has_friendship_request):
        friendship = Friendships.objects.get(user=request.user, friend=friend)
        friendship.delete()
        return HttpResponse("Friendship rejected!")

