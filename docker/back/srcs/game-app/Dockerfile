FROM node:18-alpine3.17

WORKDIR /usr/src/game-app

COPY back/game-app/ ../game-app
COPY docker/back/srcs/game-app/tools/ ../tools

RUN chmod -R 755 ../tools

CMD ["/bin/sh", "../tools/app.sh"]
