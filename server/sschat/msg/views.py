import json
import logging

from django.forms import ValidationError
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login

from django.contrib.auth.models import User

from django.db import models
from .models import Profile

LOGGER = logging.getLogger(__name__)

# Create your views here.

def _validate_sign_in(request):
    # Log here!
    raise ValidationError("Invalid request!")

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def ping(request):
    return HttpResponse("pong")

def my_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Redirect to a success page.
        pass
    else:
        # Return an 'invalid login' error message.
        pass


def sign_in(request):
    LOGGER.info("sign_in" + str(request))
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']

    # Check if the password is correct
    #user = User.objects.get(username=username)
    user = get_object_or_404(User, username=username)
    print(user, type(user))

    print(request.session)
    print(request.session.session_key)


    if user is None or not user.check_password(password):
        return HttpResponse("Wrong username or password!")
    

    # Give the session cookie to the client

    
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
    return HttpResponse("disconnect")