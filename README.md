##Install
sudo apt-get install libevent-dev python-dev

## if error db
release: python manage.py migrate auth
release: python manage.py migrate
## if error db

release: python manage.py syncdb --noinput
release: echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python manage.py shell
web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1

less:
1-delete file popup confirmation
file:///media/julio/Datos/Documentos/slack/sitio/data/20161201223015/index.html
2-save post files and redirect to last location