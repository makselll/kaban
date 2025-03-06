#!/bin/bash
set -e

# Создание файла с паролями
echo "*:5432:replication:replicator:replicator" > /tmp/pgpass
echo "*:5432:postgres:postgres:${PATRONI_SUPERUSER_PASSWORD}" >> /tmp/pgpass
chmod 600 /tmp/pgpass

# Выбор конфигурационного файла на основе PATRONI_NAME
CONFIG_FILE="/etc/patroni/patroni-${PATRONI_NAME}.yml"

# Проверка существования конфигурационного файла
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Configuration file $CONFIG_FILE not found"
    exit 1
fi

# Запуск Patroni с выбранным конфигурационным файлом
exec patroni "$CONFIG_FILE" 