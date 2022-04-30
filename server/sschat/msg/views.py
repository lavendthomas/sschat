from django.forms import ValidationError
from django.http import HttpResponse
from django.shortcuts import render

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
    # user: User = User.objects.create(username="test", password="test")
    # profile = Profile(username=user, firstname='Joe', lastname='Soe', email='Joe@Soe.com')
    # profile.save()
    pass


def sign_in(request):
    return HttpResponse("connect")

def sign_out(request):
    return HttpResponse("disconnect")