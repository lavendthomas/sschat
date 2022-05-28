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

The deployment uses [Podman](https://podman.io/) to build and run [OCI containers])(https://opencontainers.org/). Note that [Docker](https://www.docker.com/) can also be used to build and run these containers. However, standard distributions of Docker run containers with root privileges, which is not desirable for security reasons. Podman runs containers without root privileges by default.

```sh
sudo apt install podman
pip3 install podman-compose
```

## Build Instructions and Deployment

The Django server needs a random `SECRET_KEY` varaible, different for each deployment. Generate it and store it in the environment variables:

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

The app it now available at [http://localhost:8080](http://localhost:8080).

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


## TODO

<!-- - Encrypted localStorage to protect metadata from unconnected users: [SecurityJS](https://github.com/Parking-Master/SecurityJS.128#windowsecurestorage-api) -->
<!-- - Username in sign up form. -->
<!-- - Use IntexedDB instead of localStorage for message history -->
<!-- - Check that the CSRF cookie is invalidated when loggin out. -->
<!-- - Check that the message is signed. Otherwise, show the message in red. -->
<!-- - Show a hash of our public key and the one of our friends so make sure that chats are encrypted to the right person. -->
<!-- - Handle add/remove friends. -->
- Do not decrypt every messages all the time.
- Add logs.
<!-- - HTTPS -->
<!-- - Modal for password prompt or a better way to keep the password at login -->
- We NEED to throttle requests to authenticate users!
- Look if we can patch the security vulnerabilities
- Do not forward to /chat if not loggined in

### Steps

- Set up the logs https://docs.nginx.com/nginx/admin-guide/monitoring/logging/ ¡DONT INCLUDE MESSAGES!  

## Security of Django

Run python manage.py check --deploy

TODO

test:
- https://clickjacker.io/
- https://www.immuniweb.com/websec/
- https://sitecheck.sucuri.net/


### Cross site scripting 

TODO test it, but should be ok.

At least, sending a message with `<script>alert('Test alert');</script>` doesn't pop up an alert on the browser, instead it displays correctly.

Same for the username : `<script>alert('Test alert');</script>` #f505f2 is used

TODO restrict the namespace to only alphanumerical characters.

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/web_application_security


According to https://docs.djangoproject.com/en/4.0/topics/security/, using templates escape specific characters. We are not using templates, it that an issue?

We could also use https://github.com/cure53/DOMPurify every time we fetch from the API or input from the user.


#### React

https://www.stackhawk.com/blog/react-xss-guide-examples-and-prevention/

We don't maupulate the DOM directly, only through React JSX. it looks like React espaces stuff inside of JSX. 

> Now, any JavaScript enclosed by the <script> tags will not be executed


https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks

> It is safe to embed user input in JSX:

> By default, React DOM escapes any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that’s not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent XSS (cross-site-scripting) attacks.

### Cross site request forgery

TODO test it!

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/web_application_security

https://docs.djangoproject.com/en/4.0/ref/csrf/#csrf-limitations

https://www.squarefree.com/securitytips/web-developers.html#CSRF


### SQL injections

https://docs.djangoproject.com/en/4.0/topics/security/

We are not using raw SQL queries. We use only QuerySets, for which the wesite says:

> Django’s querysets are protected from SQL injection since their queries are constructed using query parameterization. A query’s SQL code is defined separately from the query’s parameters. Since parameters may be user-provided and therefore unsafe, they are escaped by the underlying database driver.


### Clickjacking protection

We are probably not protected. Our website can probably be embedded in another webpage.

TODO add X-Frame-Options middleware ?

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/web_application_security

### HTTPS

TODO! Look at https://docs.djangoproject.com/en/4.0/topics/security/#ssl-https to enable all tips!

### Host header validation

TODO update:
- ALLOWED_HOSTS
- CORS_ALLOWED_ORIGINS
- CSRF_TRUSTED_ORIGINS


### Referrer policy

### Cross-origin opener policy

### Session security

### User-uploaded content

We only support test, and it seems to be ok with cross-site scripting.

### Additional security topics

> Django does not throttle requests to authenticate users. To protect against brute-force attacks against the authentication system, you may consider deploying a Django plugin or web server module to throttle these requests.

TODO! We NEED to throttle requests to authenticate users!

> Keep your SECRET_KEY a secret.

TODO change it for the deployment

> look at https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/ and https://infosec.mozilla.org/guidelines/web_security.html

This is also a TODO


### Deployment

https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/