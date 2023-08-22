FROM alpine:3.16

EXPOSE 443
RUN apk update && \
    apk add nginx && \
    apk add openssl && \
    apk add curl iputils
RUN mkdir -p /etc/ssl

ADD config/default.conf /etc/nginx/http.d/default.conf
ADD script/nginx.sh /tmp/nginx.sh

CMD ["/bin/sh", "/tmp/nginx.sh"]
