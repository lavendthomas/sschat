import json
import logging
import re
from datetime import datetime

from django.forms import ValidationError
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
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
    if friendship := Friendships.objects.filter(user=a_profile, friend=b_profile):
        return friendship
    else:
        return Friendships.objects.filter(user=b_profile, friend=a_profile)


def sign_in(request):
    """
    Logs a user. This will create a new session id cookie and send it it to the client.
    This cookie is authentificated to the user, and will expire in two weeks or
    whenever the user logs out.
    """
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
        return HttpResponseForbidden("Invalid credentials")


@csrf_exempt
def sign_up(request):
    """
    Creates a new user. The user is expected to send a json body with the request
    containing the username, password and public_pgp_key.
    If the user not already exists, it will be created if the username is valid.
    csrf_exempt as users are not authentificated, so csrf is not necessary.
    """
    LOGGER.info("sign_up" + str(request))
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']
    public_pgp_key = body['public_pgp_key']

    username_checker = re.compile("^[a-zA-Z0-9_]{3,20}$")
    if not username_checker.match(username):
        return HttpResponseForbidden("Invalid username")

    # Check if the user already exists
    has_user = User.objects.filter(username=username).exists()
    if has_user:
        return HttpResponse("User already exists!")

    new_user: User = User.objects.create(username=username)
    new_user.set_password(password)       # Better for security

    new_profile = Profile.objects.create(
        user=new_user, public_pgp_key=public_pgp_key)

    new_user.save()
    new_profile.save()

    return JsonResponse({"message": "connected"})


def sign_out(request):
    """
    Logs out the user. The session id cookie will be deleted, along with all
    associated data. 
    """
    logout(request)
    return JsonResponse({"message": "disconnected"})


@login_required
def whoami(request):
    """
    Returns a json with the username of the user.
    """
    return JsonResponse({"user": request.user.username})


def csrf(request):
    """
    Returns a json with a new csrf token for the user.
    """
    return JsonResponse({'csrfToken': get_token(request)})


@login_required
def delete_account(request):
    """
    Deletes the user account. This will delete all the data associated with the user, 
    including queues messages, friendships and the user profile.
    """
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']

    user = authenticate(request, username=username, password=password)
    user_profile = Profile.objects.get(user=user)

    if user is not None:
        user_messages = MessageQueue.objects.filter(sender=user_profile)
        if user_messages:
            user_messages.delete()
        user_friendships = Friendships.objects.filter(user=user_profile)
        if user_friendships:
            user_friendships.delete()
        user_profile.delete()
        user.delete()
        return JsonResponse({"message": "Account deleted"})
    else:
        return HttpResponseForbidden("Invalid credentials")


@login_required
def friends_list_detailed(request):
    """
    Returns a json with the list of friends of the user. Two users are friends if both
    accepted to be friendsThis list contains the username of the friend,
    the public pgp key of the friend, the status of the friendship.
    The status outputs whether the user is connected or not
    """
    user = Profile.objects.get(user=request.user)

    # let's get all the friends of the user (where both accepted the friendship)
    friends_list = list(Friendships.objects.filter(user=user).filter(
        user_accepted=True).filter(friend_accepted=True).values_list('friend'))
    friends_list.extend(list(Friendships.objects.filter(friend=user).filter(
        user_accepted=True).filter(friend_accepted=True).values_list('user')))

    friends_list = list(map(lambda id: {"name": Profile.objects.get(id=id[0]).user.username, "status": Profile.objects.get(
        id=id[0]).is_client_connected, "public_pgp_key": Profile.objects.get(id=id[0]).public_pgp_key}, friends_list))

    return JsonResponse({"friends": friends_list})


@login_required
def ask_friend(request):
    """
    This request adds a new relationship between the user and the friend, if no prending relationship
    exists.
    If the potential friend already asked for a friendship, then the friendship
    is simply accepted.
    """
    body = json.loads(request.body.decode('utf-8'))
    friend_username: str = body['friend']

    # Make sure that the friend exists
    if not User.objects.filter(username=friend_username).exists():
        return HttpResponse("Friend does not exist!")

    friend = Profile.objects.get(
        user=User.objects.get(username=friend_username))
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
    new_friendship = Friendships.objects.create(
        user=user, friend=friend, user_accepted=True, friend_accepted=False)
    new_friendship.save()
    return HttpResponse("Friendship created!")


@login_required
def accept_friend(request):
    """
    Accepts the friendship. This will swap the "accepted" boolean for the user who just accepted
    """
    body = json.loads(request.body.decode('utf-8'))
    friend_username: str = body['friend']

    # Make sure that the friend exists
    if not User.objects.filter(username=friend_username).exists():
        return HttpResponse("Friend does not exist!")

    friend = Profile.objects.get(
        user=User.objects.get(username=friend_username))
    user = Profile.objects.get(user=request.user)

    # Check if the user has a friendship with this friend
    pending_friendship = Friendships.objects.get(user=friend, friend=user)

    if (pending_friendship is None):
        return HttpResponse("You are not friends with this user!")
    else:
        pending_friendship.friend_accepted = True
        pending_friendship.save()
        return HttpResponse("Friendship accepted!")


@login_required
def reject_friend(request):
    """
    Rejects a friend. This will delete the friendship and pending messages bewteen the two users.
    """
    body = json.loads(request.body.decode('utf-8'))
    friend_username: str = body['friend']

    # Make sure that the friend exists
    if not User.objects.filter(username=friend_username).exists():
        return HttpResponse("Friend does not exist!")

    friend = Profile.objects.get(
        user=User.objects.get(username=friend_username))
    user = Profile.objects.get(user=request.user)

    # Check if the user has a friendship with this friend
    pending_friendship = pending_or_are_friends(user, friend)
    # delete old messages in queue
    MessageQueue.objects.filter(sender=user, recipient=friend).delete()
    MessageQueue.objects.filter(sender=friend, recipient=user).delete()

    if (pending_friendship is None):
        other_friendship = Friendships.objects.get(user=user, friend=friend)
        if (other_friendship is None):
            return JsonResponse({"message": "You are not friends with this user!"})
        else:
            other_friendship.delete()
            return JsonResponse({"message": "Friendship rejected!"})
    else:
        pending_friendship.delete()
        return JsonResponse({"message": "Friendship rejected!"})


@login_required
def send_message(request):
    """
    Puts the message in the "message" field of the json in the message queue with destination
    "to". This method will not enqueue the message if the two users are not frinds.
    """
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
    new_message = MessageQueue.objects.create(
        sender=user, recipient=to_profile, message=message)
    new_message.save()

    return JsonResponse({"message": "Message sent!"})


@login_required
def get_messages(request):
    """
    Retreive and send all messages from the message queue to the user who submitted the request.
    The messages are deleted from the queue as soon as they are sent.
    """
    user = Profile.objects.get(user=request.user)
    user_profile = Profile.objects.get(user=request.user)

    # Get all the messages that the user has received
    received_messages = MessageQueue.objects.filter(recipient=user_profile)
    received_messages_list = list(map(lambda msg: {"sender": msg.sender.user.username, "message": msg.message,
                                  "id": msg.id, "timestamp": datetime.fromisoformat(str(msg.sent_at)).timestamp()}, received_messages))

    # remove all these messages
    received_messages.delete()

    return JsonResponse({"received": received_messages_list})


@login_required
def get_pgp_key(request):
    """
    Returns the PGP key of a specific user. 
    """
    body = json.loads(request.body.decode('utf-8'))
    user_str: str = body['user']
    user = User.objects.get(username=user_str)
    user_profile = Profile.objects.get(user=user)
    return JsonResponse({"public_pgp_key": user_profile.public_pgp_key})
