from django.db import models

from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    """
    
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    is_client_connected = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField()
    last_connected = models.DateTimeField(auto_now=True)


class Friendships(models.Model):
    """
    
    """
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='friendship_user', null=True)
    friend = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='friendship_friend', null=True)
    user_accepted = models.BooleanField(default=False)
    friend_accepted = models.BooleanField(default=False)
