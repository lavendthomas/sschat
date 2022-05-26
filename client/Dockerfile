FROM nginx:alpine

COPY . /app
WORKDIR /app

RUN apk add nodejs npm
RUN npm install
RUN npm run build
RUN apk del nodejs npm

# Prevent Clickjacking
RUN rm /etc/nginx/nginx.conf && cp /app/nginx.conf /etc/nginx/nginx.conf

RUN cp -r /app/build/* /usr/share/nginx/html

EXPOSE 80
