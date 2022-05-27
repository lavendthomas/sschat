FROM nginx:alpine

COPY . /app
WORKDIR /app

# The official NGINX image link logs to STDOUT and STDERR
# see : https://github.com/nginxinc/docker-nginx/blob/5971de30c487356d5d2a2e1a79e02b2612f9a72f/mainline/alpine/Dockerfile#L103
RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log


# Install nodejs and build the React website into a static site.
RUN apk add nodejs npm
RUN npm install
RUN npm run build
RUN apk del nodejs npm

# Copy SSL certificates. Should be volumes?
COPY ./env/certs/ /etc/nginx/certs/

# Prevent Clickjacking
RUN rm /etc/nginx/nginx.conf && cp /app/nginx.conf /etc/nginx/nginx.conf

# Set up SSL
COPY ./templates/ /etc/nginx/templates/

# Copy the static React website
RUN cp -r /app/build/* /usr/share/nginx/html

EXPOSE 80
