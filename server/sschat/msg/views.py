import json
import logging
from datetime import datetime

from django.forms import ValidationError
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt


from .models import Friendships, MessageQueue, Profile

LOGGER = logging.getLogger(__name__)


def are_friends_names(a: str, b: str):
    a_user = User.objects.get(username=a)
    a_profile = Profile.objects.get(user=a_user)

    b_user = User.objects.get(username=b)
    b_profile = Profile.objects.get(user=b_user)
    
    return are_friends(a_profile, b_profile)

def are_friends(a_profile: Profile, b_profile: Profile):
    return Friendships.objects.filter(user=a_profile, friend=b_profile, user_accepted=True, friend_accepted=True) \
        or Friendships.objects.filter(user=b_profile, friend=a_profile, user_accepted=True, friend_accepted=True)

def pending_friend_request(a_profile: Profile, b_profile: Profile):
    return Friendships.objects.filter(user=a_profile, friend=b_profile, user_accepted=True, friend_accepted=False) \
        or Friendships.objects.filter(user=b_profile, friend=a_profile, user_accepted=True, friend_accepted=False)

def pending_or_are_friends(a_profile: Profile, b_profile: Profile):
    if friendship := Friendships.objects.get(user=a_profile, friend=b_profile):
        return friendship
    else:
        return Friendships.objects.get(user=b_profile, friend=a_profile)


# Create your views here.

def _validate_sign_in(request):
    # Log here!
    raise ValidationError("Invalid request!")



def sign_in(request):
    LOGGER.info("sign_in" + str(request))
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']

    # Give the session cookie to the client
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"message": "Welcome"})
    else:
        return JsonResponse({"message": "Wrong username or password!"})
    
@csrf_exempt
def sign_up(request):
    LOGGER.info("sign_up" + str(request))
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']
    public_pgp_key = body['public_pgp_key']

    # Check if the user already exists
    has_user = User.objects.filter(username=username).exists()
    if has_user:
        return HttpResponse("User already exists!")

    new_user: User = User.objects.create(username=username)
    new_user.set_password(password)       # Better for security

    new_profile = Profile.objects.create(user=new_user, public_pgp_key=public_pgp_key)

    new_user.save()
    new_profile.save()

    return JsonResponse({"message": "connected"})

@login_required(login_url='/login')
def sign_out(request):
    logout(request)
    return HttpResponse("disconnected")

@login_required(login_url='/login')
def whoami(request):
    return JsonResponse({"user" : request.user.username})

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


@login_required(login_url='/login')
def friends_list(request):
    user = Profile.objects.get(user=request.user)

    # let's get all the friends of the user (where both accepted the friendship)
    friends_list = list(Friendships.objects.filter(user=user).filter(user_accepted=True).filter(friend_accepted=True).values_list('friend'))
    friends_list.extend(list(Friendships.objects.filter(friend=user).filter(user_accepted=True).filter(friend_accepted=True).values_list('user')))

    friends_list = list(map(lambda id: Profile.objects.get(id=id[0]).user.username, friends_list))

    return JsonResponse({"friends": friends_list})

@login_required(login_url='/login')
def friends_list_detailed(request):
    user = Profile.objects.get(user=request.user)

    # let's get all the friends of the user (where both accepted the friendship)
    friends_list = list(Friendships.objects.filter(user=user).filter(user_accepted=True).filter(friend_accepted=True).values_list('friend'))
    friends_list.extend(list(Friendships.objects.filter(friend=user).filter(user_accepted=True).filter(friend_accepted=True).values_list('user')))

    friends_list = list(map(lambda id: {"name": Profile.objects.get(id=id[0]).user.username, "status": Profile.objects.get(id=id[0]).is_client_connected, "public_pgp_key": Profile.objects.get(id=id[0]).public_pgp_key}, friends_list))

    return JsonResponse({"friends": friends_list})




@login_required(login_url='/login')
def ask_friend(request):
    body = json.loads(request.body.decode('utf-8'))
    friend_username: str = body['friend']

    # Make sure that the friend exists
    if not User.objects.filter(username=friend_username).exists():
        return HttpResponse("Friend does not exist!")

    friend = Profile.objects.get(user=User.objects.get(username=friend_username))
    user = Profile.objects.get(user=request.user)

    # Check if this user is already a friend
    if are_friends(user, friend):
        return HttpResponse("You are already friends!")
    if pending_friend_request(user, friend):
        if Friendships.objects.filter(user=user, friend=friend, user_accepted=True, friend_accepted=False):
            return HttpResponse("You already sent a friend request to this user!")
        else:
            # let's accept the friend request
            accept_friend(request)
    

    # Everything is ok, create the friendship
    new_friendship = Friendships.objects.create(user=user, friend=friend, user_accepted=True, friend_accepted=False)
    new_friendship.save()
    return HttpResponse("Friendship created!")

@login_required(login_url='/login')
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


@login_required(login_url='/login')
def reject_friend(request):
    body = json.loads(request.body.decode('utf-8'))
    friend_username: str = body['friend']

    # Make sure that the friend exists
    if not User.objects.filter(username=friend_username).exists():
        return HttpResponse("Friend does not exist!")

    friend = Profile.objects.get(user=User.objects.get(username=friend_username))
    user = Profile.objects.get(user=request.user)

    # Check if the user has a friendship with this friend
    pending_friendship = pending_or_are_friends(user, friend)
    # delete old messages in queue
    MessageQueue.objects.filter(sender=user, recipient=friend).delete()
    MessageQueue.objects.filter(sender=friend, recipient=user).delete()

    if (pending_friendship is None):
        other_friendship = Friendships.objects.get(user=user, friend=friend)
        if (other_friendship is None):
            return JsonResponse({"message":"You are not friends with this user!"})
        else:
            other_friendship.delete()
            return JsonResponse({"message":"Friendship rejected!"})
    else:
        pending_friendship.delete()
        return JsonResponse({"message":"Friendship rejected!"})


@login_required(login_url='/login')
def send_message(request):
    body = json.loads(request.body.decode('utf-8'))
    print(body)
    to_username: str = body['to']
    message: str = body['message']

    # Make sure that the friend exists
    if not User.objects.filter(username=to_username).exists():
        return JsonResponse({"message": "Friend does not exist!"})
    
    to_user = User.objects.get(username=to_username)
    to_profile = Profile.objects.get(user=to_user)

    user = Profile.objects.get(user=request.user)

    # Check if the user has a friendship with this friend
    if not are_friends_names(request.user.username, to_username):
        return JsonResponse({"message": "You are not friends with this user!"})
    
    # Everything is ok, create the message
    # Note: the message should be pgp-encrypted on the client side.
    new_message = MessageQueue.objects.create(sender=user, recipient=to_profile, message=message)
    new_message.save()

    return JsonResponse({"message": "Message sent!"})


@login_required(login_url='/login')
def get_messages(request):
    user = Profile.objects.get(user=request.user)
    user_profile = Profile.objects.get(user=request.user)

    # Get all the messages that the user has received
    received_messages = MessageQueue.objects.filter(recipient=user_profile)
    received_messages_list = list(map(lambda msg: {"sender" : msg.sender.user.username, "message": msg.message, "id": msg.id, "timestamp":datetime.fromisoformat(str(msg.sent_at)).timestamp()}, received_messages))

    # remove all these messages
    received_messages.delete()

    return JsonResponse({"received": received_messages_list})


@login_required(login_url='/login')
def get_pgp_key(request):
    body = json.loads(request.body.decode('utf-8'))
    user_str: str = body['user']
    user = User.objects.get(username=user_str)
    user_profile = Profile.objects.get(user=user)
    return JsonResponse({"public_pgp_key": user_profile.public_pgp_key})