release: python manage.py makemigrations
release: python manage.py migrate
release: python manage.py syncdb --noinput
web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1


