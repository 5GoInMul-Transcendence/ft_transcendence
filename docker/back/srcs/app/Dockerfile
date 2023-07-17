FROM node:18.16.1-bookworm

RUN mkdir -p /app/script

COPY ./back/web-app /app
COPY ./docker/back/srcs/app/tools/ /app/script

RUN chmod -R 755 /app/script/
    && /app/script/app.sh 

WORKDIR /app/web-app

CMD ["npm", "run", "start:dev"]