FILE_PATH="/var/www/html/index.php"
if [ -f "$FILE_PATH" ]
then
  echo "WordPress already exists!!!"
else
    mv /tmp/wp-config.php /var/www/html/wp-config.php
  
    wp core download --allow-root --path=/var/www/html

    wp	core install \
        --allow-root \
        --path=${WORDPRESS_PATH} \
        --url=${WORDPRESS_URL} \
        --title=Inception \
        --admin_user=${WORDPRESS_ADMIN} \
        --admin_password=${WORDPRESS_ADMIN_PASSWORD} \
        --admin_email=${WORDPRESS_EMAIL} \
        --skip-email

    wp user create  ${WORDPRESS_USER} \
                    ${WORDPRESS_USER_EMAIL} \
                    --user_pass=${WORDPRESS_USER_PASSWORD} \
                    --role=author

  echo "Download and set new WordPress!!"
fi


/usr/sbin/php-fpm8 -F -R
