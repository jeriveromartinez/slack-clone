release: python manage.py migrate auth
release: python manage.py migrate
web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1
