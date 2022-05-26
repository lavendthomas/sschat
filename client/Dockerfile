FROM nginx:alpine

COPY . /app
WORKDIR /app

RUN apk add nodejs npm
RUN npm install
RUN npm run build
RUN apk del nodejs npm

# Copy SSL certificates. Should be volumes?
COPY ./env/certs/sshchat.umons.ac.be.key /etc/nginx/certs/sshchat.umons.ac.be.key 
COPY ./env/certs/sshchat.umons.ac.be.crt /etc/nginx/certs/sshchat.umons.ac.be.crt 

# Prevent Clickjacking
RUN rm /etc/nginx/nginx.conf && cp /app/nginx.conf /etc/nginx/nginx.conf

# Set up SSL
RUN rm /etc/nginx/conf.d/default.conf && cp /app/default.conf /etc/nginx/conf.d/default.conf

RUN cp -r /app/build/* /usr/share/nginx/html

EXPOSE 80
