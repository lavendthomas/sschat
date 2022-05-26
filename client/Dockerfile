FROM nginx:alpine

COPY . /app
WORKDIR /app

RUN apk add nodejs npm
RUN npm install
RUN npm run build
RUN apk del nodejs npm

# Copy SSL certificates. Should be volumes?
# COPY /etc/nginx/sshchat.umons.ac.be.key ./env/sshchat.umons.ac.be.key
# COPY /etc/nginx/sshchat.umons.ac.be.crt ./env/sshchat.umons.ac.be.crt

# Prevent Clickjacking
RUN rm /etc/nginx/nginx.conf && cp /app/nginx.conf /etc/nginx/nginx.conf

# Set up SSL
RUN rm /etc/nginx/conf.d/default.conf && cp /app/default.conf /etc/nginx/conf.d/default.conf

RUN cp -r /app/build/* /usr/share/nginx/html

EXPOSE 80
