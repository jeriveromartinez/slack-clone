from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils.datetime_safe import time
from django.utils.html import strip_tags
from django_socketio import events, send, broadcast, broadcast_channel, NoSocket
from plataforma.models import *
from django.utils import timezone


@events.on_connect
def on_connect(request, socket, context):
    profile = Profile.objects.get(user__username=request.user.username)
    profile.socketsession = socket.session.session_id
    profile.save()
    send(socket.session.session_id, {"action": "connected", "message": profile.user.username})


@events.on_message
def message(request, socket, context, message):
    user_to = User.objects.get(username=message["user_from"])

    if request.user.is_authenticated and user_to:
        profile = Profile.objects.get(user__username=message["user_to"])
        msg = MessageInstEvent.objects.create(user_to=profile.user, user_from=request.user, msg=message["message"],
                                              type="message_int_event")

        try:

            message["action"] = "message"
            message["user_to"] = profile.user.username
            message["user_from"] = user_to.username
            message["date_pub"] = str(msg.date_pub.isoformat())
            send(profile.socketsession, message)
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
        MessageInstEvent.objects.create(room=room, user_from=request.user, msg=message["message"],
                                        date_pub=timezone.now())

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
        socket.broadcast(left)
    except NoSocket as e:
        send(socket.session.session_id, {"error": "No connected sockets exist"})


@events.on_disconnect
def disconect(request, socket, context):
    print 'deconect'


@events.on_finish(channel="^room-")
def finish(request, socket, context):
    """
    Algo
    """
