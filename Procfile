release: python manage.py syncdb
web: gunicorn --worker-class socketio.sgusynanicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1