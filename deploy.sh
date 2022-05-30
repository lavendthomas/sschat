#!/bin/bash

sudo apt update
sudo apt install python3-pip podman

python3 -m pip install Django podman-compose

export SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

# Generate the SSL key pair
mkdir -p client/env/certs/
cd client/env/certs/
openssl req -newkey rsa:2048 -nodes -keyout sshchat.umons.ac.be.key -x509 -days 365 -out sshchat.umons.ac.be.crt
cd ../../..


# Run the containers
~/.local/bin/podman-compose up