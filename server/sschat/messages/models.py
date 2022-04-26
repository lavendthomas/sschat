from ipaddress import ip_address
import uuid
from debugpy import is_client_connected
from django.db import models

from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    """
    
    """
    # uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # name = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    is_client_connected = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField()


class Friendships(models.Model):
    """
    
    """
    user_id = models.ForeignKey(Profile, on_delete=models.CASCADE)
    friend_id = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='friend_id')
    user_accepted = models.BooleanField(default=False)
    friend_accepted = models.BooleanField(default=False)

