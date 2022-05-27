#!/bin/bash

pip3 install Django
export SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

# Generate the key pair
mkdir -p client/env/certs/
cd client/env/certs/
openssl req -newkey rsa:2048 -nodes -keyout sshchat.umons.ac.be.key -x509 -days 365 -out sshchat.umons.ac.be.crt
# Set the key as readable by all
chmod a+r /etc/nginx/certs/sshchat.umons.ac.be.key
cd ../..




podman build client/ -t sshchat-client
podman run -p 8080:80 localhost/sschat-client

podman build server/ -t sschat-server