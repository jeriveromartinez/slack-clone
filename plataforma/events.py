from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils.html import strip_tags
from django_socketio import events, send, broadcast, broadcast_channel, NoSocket
from plataforma.models import *
from django.utils import timezone


@events.on_connect
def on_connect(request, socket, context):
    Profile.objects.filter(user_id=request.user.id).update(socketsession=socket.session.session_id)

    profile = Profile.objects.filter(user_id=request.user.id)
    print profile[0].socketsession
    send(socket.session.session_id, {"action": "connected", "message": profile[0].user.username})


@events.on_message
def message(request, socket, context, message):
    user_to = User.objects.get(username=message["username"])
    print user_to
    if request.user.is_authenticated and user_to:
        profile = Profile.objects.filter(user__username=message["username"])

        MessageInstEvent.objects.create(user_to=profile[0].user, user_from=request.user, msg=message["message"],
                                        type="message_int_event")

        try:

            message["action"] = "message"
            send(profile[0].socketsession, message)
        except NoSocket as e:
            send(socket.session.session_id, {"action": "error", "message": "No connected sockets exist"})


@events.on_subscribe
def subcribe(request, socket, context, channel):
    room = get_object_or_404(Room, name=channel)
    if room:
        # RoomMessage.objects.create(room=room, user_msg=request.user, msg="User joined", date_pub=timezone.now())
        try:
            send(socket.session.session_id, {"message": "Welcome"})
            joined = {"action": "join", "name": request.user.username, "id": request.user.id}
            socket.send_and_broadcast_channel(joined)
        except NoSocket as e:
            send(socket.session.session_id, {"error": "No connected sockets exist"})
    else:
        send(socket.session.session_id, {"error": "Room not exits"})


@events.on_message(channel="^room-")
def messagechanel(request, socket, context, message):
    room = get_object_or_404(Room, name=message["room"])
    if room and message["action"] == "message":
        RoomMessage.objects.create(room=room, user_msg=request.user, msg=message["message"], date_pub=timezone.now())

        message["message"] = strip_tags(message["message"])
        message["name"] = request.user.username
        try:
            socket.send_and_broadcast_channel(message)
        except NoSocket as e:
            send(socket.session.session_id, {"error": "No connected sockets exist"})
    else:
        send(socket.session.session_id, {"error": "Room not exits"})


@events.on_disconnect(channel="^room-")
def disconect(request, socket, context):
    left = {"action": "leave", "name": request.user.username, "id": request.user.id}
    try:
        socket.broadcast_channel(left)
    except NoSocket as e:
        send(socket.session.session_id, {"error": "No connected sockets exist"})


@events.on_disconnect
def disconect(request, socket, context):
    Profile.objects.filter(user_id=request.user.id).update(socketsession="")
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
