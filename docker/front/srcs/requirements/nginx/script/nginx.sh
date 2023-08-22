openssl req -x509 -nodes \
        -days 365 \
        -newkey rsa:2048 \
        -keyout /etc/ssl/nginx-selfsigned.key \
        -out /etc/ssl/nginx-selfsigned.crt \
        -subj "/C=KR/ST=Seoul/O=42Seoul/OU=kipark/CN=inception/"
    
chown nginx /etc/ssl/nginx-selfsigned.crt    
chown nginx /etc/ssl/nginx-selfsigned.key    

exec nginx -g 'daemon off;';