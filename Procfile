release: python manage.py syncdb
web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1
