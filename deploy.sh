#!/bin/bash

podman build client/ -t sshchat-client
podman run -p 8080:80 localhost/sschat-client