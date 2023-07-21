FROM node:18-alpine3.17

WORKDIR /usr/src/web-app

COPY docker/back/srcs/app/tools/ ../tools

RUN chmod -R 755 ../tools

CMD ["/bin/sh", "../tools/app.sh"]