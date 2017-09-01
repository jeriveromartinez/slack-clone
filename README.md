Example of the operation of the slack site, should only be used as study material, we are not responsible for its misuse.
# Install
sudo apt-get install libevent-dev python-dev

## heroku deploy
release: python manage.py migrate auth
release: python manage.py migrate

### if error database deploy
release: python manage.py syncdb --noinput
release: echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python manage.py shell
web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1
