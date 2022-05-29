FROM nginx:alpine

COPY . /app
WORKDIR /app

ENV API_HOST=${API_HOST}

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
