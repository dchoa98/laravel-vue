# docker image base
ARG BASE_NGINX=nginx:1.21.5-alpine
ARG BASE_PHP=php:8.1.0-fpm-alpine

FROM $BASE_NGINX as nginx-builder
COPY .docker/nginx/templates/* /etc/nginx/templates/
## php-fpm-alpine-builder image: install common php extension need for project
FROM $BASE_PHP AS php-fpm-alpine-builder
LABEL maintainer="admin"
ENV TZ=Asia/Tokyo
ENV PYTHONUNBUFFERED=1
RUN set -eux; \
        \
        apk update; \
        \
        echo "CHANGE TIME ZONE TO '$TZ' AT BUILD TIME ONLY"; \
            apk add --no-cache tzdata; \
            cp /usr/share/zoneinfo/$TZ /etc/localtime; \
            echo $TZ > /etc/timezone; \
            echo "Test current date: $(date)"; \
            echo "timezone will reset to UTC if we run command 'apk del tzdata' so no run command until this bug fixed by alpine maintainer"; \
        \
        echo "INSTALL  PHP EXTENSION NEEDED 'pdo_mysql' 'opcache'"; \
            apk add --no-cache --virtual .build-deps $PHPIZE_DEPS; \
            docker-php-ext-install -j "$(nproc)" pdo_mysql; \
        \
        echo 'CLEAN UP TEMP TO REDUCE DOCKER IMAGE SIZES'; \
        rm -rf /tmp/* /var/cache/apk/*
#####################################################################################################################
## mirai-public: bundle  public source code (js,css). use this image on read-only env (production, staging) ##
#####################################################################################################################
FROM nginx-builder as mirai-public

# tag help inspect docker image in the future
ARG GIT_COMMIT_HASH=unspecified
ARG GIT_BRANCH_NAME=unspecified

LABEL maintainer="admin" \
    git.commit=$GIT_COMMIT_HASH \
    git.branch=$GIT_BRANCH_NAME

WORKDIR /var/www/html/mirai_test/public
COPY .docker/nginx/conf.d/mirai-app.conf /etc/nginx/conf.d/default.conf
COPY .docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx public .
EXPOSE 80

##########################################################################################################
## mirai-vendor ##
##########################################################################################################
FROM composer:2.3.5 AS vendor
WORKDIR /var/www/html/mirai_test
COPY --chown=www-data:www-data composer.json artisan ./
RUN set -eux; \
composer install \
        --quiet \
        --ignore-platform-reqs \
        --no-interaction \
        --no-progress \
        --no-suggest \
        --no-scripts \
        --prefer-dist \
        --no-autoloader \
        --no-dev;
##########################################################################################################
## mirai-app: bundle  web app source code. use this image on read-only env (production, staging) ##
##########################################################################################################
FROM php-fpm-prod AS mirai-app

# tag help inspect docker image in the future
ARG GIT_COMMIT_HASH=unspecified
ARG GIT_BRANCH_NAME=unspecified

LABEL maintainer="admin" \
    git.commit=$GIT_COMMIT_HASH \
    git.branch=$GIT_BRANCH_NAME

ENV APPLICATION_ENV=production

WORKDIR /var/www/html/mirai_test
COPY --chown=www-data:www-data app app
COPY --chown=www-data:www-data bootstrap bootstrap
COPY --chown=www-data:www-data config config
COPY --chown=www-data:www-data database database
COPY --chown=www-data:www-data lang lang
COPY --chown=www-data:www-data storage storage
COPY --chown=www-data:www-data resources resources
COPY --chown=www-data:www-data routes routes

COPY --chown=www-data:www-data composer.json artisan
COPY --chown=www-data:www-data public/*.php public/mix-manifest.json public/
COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer
COPY --from=vendor --chown=www-data:www-data /var/www/html/mirai_test/vendor /var/www/html/mirai_test/vendor
VOLUME ["/var/www/html/mirai_test/storage/app/public"]
RUN set -eux; \
        echo "$GIT_BRANCH_NAME - $GIT_COMMIT_HASH" > VERSION; \
        echo "DUMP autoload class for production"; \
        cd /var/www/html/mirai_test && \
        composer dumpautoload -a;

CMD ["php-fpm"]
EXPOSE 9000

## php-fpm-dev image: install php extension support for developer
FROM php-fpm-alpine-builder AS php-fpm-dev
ARG USER_ID=1000
ARG GROUP_ID=1000
ENV COMPOSER_CACHE_DIR=/tmp
WORKDIR /var/www/html/mirai_test
RUN set -eux; \
        echo "INSTALL NPM nodejs"; \
            apk add nodejs-current;\
            apk add --update npm;\
            apk add --no-cache --virtual .build-deps $PHPIZE_DEPS; \
        \
        apk del .build-deps; \
        cp "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"; \
        \
        echo 'CLEAN UP TEMP TO REDUCE DOCKER IMAGE SIZES'; \
        rm -rf /tmp/* /var/cache/apk/*
COPY .docker/php/conf.d/z-xdebug.dev.ini .docker/php/conf.d/z-php.dev.ini $PHP_INI_DIR/conf.d/
COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer