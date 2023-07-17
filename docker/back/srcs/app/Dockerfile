FROM node:18.16.1-bookworm

WORKDIR /usr/src

# COPY /back/web-app /usr/src
COPY /docker/back/srcs/app/tools .

RUN chmod -R 755 .
    && tools/app.sh 

CMD ["npm", "run", "start:dev"]
# CMD ["/bin/bash"]