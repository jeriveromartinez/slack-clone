from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils.html import strip_tags
from django_socketio import events, send, broadcast, broadcast_channel, NoSocket
from plataforma.models import Room


@events.on_connect
def on_connect(request, socket, context):
    socket.session.session_id = request.user.id


@events.on_message
def message(request, socket, context, message):
    user = get_object_or_404(User, username=message["username"])
    try:
        send(user.id, message["message"])
    except NoSocket as e:
        send(socket.session.session_id, {"error": "No connected sockets exist"})


@events.on_subscribe
def subcribe(request, socket, context, channel):
    room = get_object_or_404(Room, id=message["name"])
    try:
        send(socket.session.session_id, {"message": "Welcome"})
        joined = {"action": "join", "name": request.user.username, "id": request.user.id}
        socket.send_and_broadcast_channel(joined)
    except NoSocket as e:
        send(socket.session.session_id, {"error": "No connected sockets exist"})


@events.on_message(channel="^room-")
def messagechanel(request, socket, context, message):
    if message["action"] == "message":
        message["message"] = strip_tags(message["message"])
        message["name"] = request.user.username
        try:
            socket.send_and_broadcast_channel(message)
        except NoSocket as e:
            send(socket.session.session_id, {"error": "No connected sockets exist"})


@events.on_disconnect(channel="^room-")
def disconect(request, socket, context):
    left = {"action": "leave", "name": request.user.username, "id": request.user.id}
    try:
        socket.broadcast_channel(left)
    except NoSocket as e:
        send(socket.session.session_id, {"error": "No connected sockets exist"})


@events.on_finish(channel="^room-")
def finish(request, socket, context):
    """
    Algo
    """
