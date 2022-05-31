# SSChat

## Group members

- Thomas Lavend'Homme (181386)
- Ryan Byloos (182167)


## Installation Instructions

This installation guide has been tested on Ubuntu 22.04 LTS. It is also available in this repo at [the deployment script deploy.sh](deploy.sh)

```sh
sudo apt update
sudo apt install python3-pip
```

The deployment uses [Podman](https://podman.io/) to build and run [OCI containers](https://opencontainers.org/). Note that [Docker](https://www.docker.com/) can also be used to build and run these containers. However, standard distributions of Docker run containers with root privileges, which is not desirable for security reasons. Podman runs containers without root privileges by default.

```sh
sudo apt install podman
pip3 install podman-compose
```

## Build Instructions and Deployment

The Django server needs a random `SECRET_KEY` variable, different for each deployment. Generate it and store it in the environment variables:

```sh
pip3 install Django
export SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
```

Go to the root of this repository, and then generate the self-signed certificate:


```sh
mkdir -p client/env/certs/
cd client/env/certs/
openssl req -newkey rsa:2048 -nodes -keyout sshchat.umons.ac.be.key -x509 -days 365 -out sshchat.umons.ac.be.crt
cd ../..
```

Run the following command to build the OCI images and run the web server:

```sh
podman-compose up
```

The app is now available at [https://localhost:8080](https://localhost:8080).

## Uninstallation prodedure

Stop the web server:

```sh
podman-compose down
```

Remove OCI containers and images. Warning, this will erase all existing podman containers and images on the system.

```sh
podman rm -a
podman image rm -a
podman system prune -a
```

Then, uninstall unnecessary system and python packages.

