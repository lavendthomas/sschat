#!/bin/bash

pip3 install Django
export SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

# Generate the SSL key pair
mkdir -p client/env/certs/
cd client/env/certs/
openssl req -newkey rsa:2048 -nodes -keyout sshchat.umons.ac.be.key -x509 -days 365 -out sshchat.umons.ac.be.crt
cd ../..

# Build the OCI containers for the React frontend and the Django backend
# podman build client/ -t sshchat-client
# podman build server/ -t sschat-server

# Run the containers
podman-compose up
# sudo docker-compose up