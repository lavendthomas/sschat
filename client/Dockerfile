FROM nginx:alpine

COPY . /app
RUN ls -la /app
WORKDIR /app

RUN apk add nodejs npm
RUN npm install
RUN npm run build
RUN apk del nodejs npm

RUN cp -r /app/build/* /usr/share/nginx/html

EXPOSE 80
