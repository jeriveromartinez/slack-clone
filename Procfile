release: python manage.py migrate auth
web: gunicorn --worker-class socketio.sgusynanicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1