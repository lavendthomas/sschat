#!/bin/bash

pip3 install Django
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Generate the key pair
cd client
touch env
cd env
openssl req -newkey rsa:2048 -nodes -keyout sshchat.umons.ac.be.key -x509 -days 365 -out sshchat.umons.ac.be.crt
cd ../..




podman build client/ -t sshchat-client
podman run -p 8080:80 localhost/sschat-client

podman build server/ -t sschat-server