#!/usr/bin/env bash

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@gmail.com',
        password='1234'
    )
"

