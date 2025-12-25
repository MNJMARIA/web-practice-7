# Базовий образ з PHP та Apache
FROM php:8.3-apache

# Вмикаємо потрібні Apache-модулі
RUN a2enmod rewrite

# Копіюємо всі файли проєкту у веб-каталог Apache
COPY . /var/www/html/

# Права на запис для лог-файлів подій
RUN chmod 666 /var/www/html/events_immediate.txt \
    && chmod 666 /var/www/html/events_batch.txt || true

# (опціонально) встановлюємо часовий пояс сервера
RUN echo "date.timezone=Europe/Kyiv" > /usr/local/etc/php/conf.d/timezone.ini

# Відкриваємо порт 80
EXPOSE 80
