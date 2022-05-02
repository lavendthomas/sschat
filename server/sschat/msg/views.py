import json
import logging

from django.forms import ValidationError
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout

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

# @login_required(login_url='/msg/login/')
def ping(request):
    if request.user.is_authenticated:
        return JsonResponse({"result":"pong"})
    return JsonResponse({"result":"plouf"})

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})