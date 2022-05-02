import json
from django.forms import ValidationError
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

from django.contrib.auth.models import User

from .models import Profile

# Create your views here.

def _validate_sign_in(request):
    # Log here!
    raise ValidationError("Invalid request!")

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def ping(request):
    return HttpResponse("pong")


def sign_up(request):
    print(request)
    if request.method == 'POST':
        print(request.POST)
        
        
    # user: User = User.objects.create(username="test", password="test")
    # profile = Profile(username=user, firstname='Joe', lastname='Soe', email='Joe@Soe.com')
    # profile.save()
    return HttpResponse("Welcome")


def sign_in(request):
    body = json.loads(request.body.decode('utf-8'))
    username = body['user']
    password = body['password']

    # Check if the user already exists
    new_user: User = User.objects.get_or_create(username=username, password=password)
    # new_user.set_password(password)       # Better for security
    return HttpResponse("connected" + str(new_user))

def sign_out(request):
    return HttpResponse("disconnect")