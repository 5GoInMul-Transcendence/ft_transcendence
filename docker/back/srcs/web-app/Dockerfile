FROM node:18-alpine3.17

WORKDIR /usr/src/web-app

COPY back/web-app/ ../web-app
COPY docker/back/srcs/web-app/tools/ ../tools

RUN chmod -R 755 ../tools

CMD ["/bin/sh", "../tools/app.sh"]