release: python manage.py syncdb --noinput

web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1

release: echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python manage.py shell
