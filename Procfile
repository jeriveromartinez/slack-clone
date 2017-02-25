release: python manage.py migrate
web: gunicorn --worker-class socketio.sgusynanicorn.GeventSocketIOWorker plataforma.wsgi --preload --workers 1