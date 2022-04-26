"""
ASGI config for sschat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os

import django
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sschat.settings')
django.setup()

application = ProtocolTypeRouter({
  "http": AsgiHandler(),
  ## IMPORTANT::Just HTTP for now. (We can add other protocols later.)
})