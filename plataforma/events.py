from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils.datetime_safe import time
from django.utils.html import strip_tags
from django_socketio import events, send, broadcast, broadcast_channel, NoSocket
from plataforma.models import *
from django.utils import timezone
import json

from plataforma.serializers import ProfileSerializer


def message(request, socket, context, message):
    room = get_object_or_404(Room, name=message["room"])
    if room:
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


def call(request, socket, context, message):
    profile = Profile.objects.get(user__username=message["user_to"])
    room = RoomCall.objects.get(name=message['room'])

    if profile:
        send(profile.socketsession,
             {"action": "call_join_request", "user_from": message["user_from"], "user_to": message["user_to"],
              'avatar': profile.image.url, "room": room.name})
    else:
        send(socket.session.session_id,
             {"action": "call_failed", "message": "No connected sockets exist"})


def callaccept(request, socket, context, message):
    room = RoomCall.objects.get(name=message['room'])
    serializer = ProfileSerializer(room.users.all(), many=True)
    users = json.dumps(serializer.data)
    profile = Profile.objects.get(user__username=message["user_from"])
    send(profile.socketsession,
         {"action": "user_list", "room": room.name, "user_from": request.user.username, "users": users})
    for item in room.users.all():
        if item.user.username != request.user.username:
            try:
                print 'Sending begin to: ' + item.user.username + " " + item.socketsession
                send(item.socketsession,
                     {"action": "join", "room": room.name, "user_from": request.user.username, "users": users})
            except NoSocket as e:
                send(socket.session.session_id, {"action": "error", "message": "No connected sockets exist"})


def calldecline(request, socket, context, message):
    room = RoomCall.objects.get(name=message['room'])

    socket.send_and_broadcast_channel(
        {"action": "call_decline", "user_from": message["user_from"], "room": room.name})


def offer(request, socket, context, message):
    room = RoomCall.objects.get(name=message['room'])
    profile = Profile.objects.get(user__username=message["user_to"])
    print message['offer']

    try:
        print 'Sending offer to: ' + profile.user.username + " " + profile.socketsession
        send(profile.socketsession, {
            'action': "offer",
            'offer': message['offer'],
            'user_from': profile.user.username,
            "room": room.name,

        })
    except NoSocket as e:
        send(socket.session.session_id, {"action": "error", "message": "No connected sockets exist"})


def answer(request, socket, context, message):
    room = RoomCall.objects.get(name=message['room'])
    profile = Profile.objects.get(user__username=message["user_to"])
    print message['answer']

    try:
        print 'Sending answer to: ' + profile.user.username + " " + profile.socketsession
        send(profile.socketsession, {
            'action': "answer",
            'answer': message['answer'],
            'user_from': profile.user.username,
            "room": room.name,

        })
    except NoSocket as e:
        send(socket.session.session_id, {"action": "error", "message": "No connected sockets exist"})


def candidate(request, socket, context, message):
    room = RoomCall.objects.get(name=message['room'])
    profile = Profile.objects.get(user__username=message["user_to"])
    print message['candidate']

    try:
        print 'Sending offer to: ' + profile.user.username + " " + profile.socketsession
        send(profile.socketsession, {
            'action': "candidate",
            'candidate': message['candidate'],
            'user_from': profile.user.username,
            "room": room.name,

        })
    except NoSocket as e:
        send(socket.session.session_id, {"action": "error", "message": "No connected sockets exist"})


def leave(request, socket, context, message):
    socket.send_and_broadcast_channel({
        'action': "leave",

        'user_from': request.user.username

    })


optionchannel = {'message': message,
                 'call': call,
                 'callaccept': callaccept,
                 'calldecline': calldecline,
                 'offer': offer,
                 'answer': answer,
                 'candidate': candidate,
                 'leave': leave,
                 }


@events.on_connect
def on_connect(request, socket, context):
    profile = Profile.objects.get(user__username=request.user.username)
    profile.socketsession = socket.session.session_id
    profile.save()
    print profile.socketsession
    send(socket.session.session_id, {"action": "connected", "message": profile.user.username})


@events.on_message
def message(request, socket, context, message):
    print message
    if message['action'] == "message":
        user_from = User.objects.get(username=message["user_from"])
        if request.user.is_authenticated and user_from:

            try:
                profile = Profile.objects.get(user__username=message["user_to"])
                msg = MessageInstEvent.objects.create(user_to=profile.user, user_from=user_from, msg=message["message"],
                                                      type="message_int_event")
                message["action"] = "message"
                message["user_to"] = profile.user.username
                message["user_from"] = user_from.username
                message["date_pub"] = str(msg.date_pub.isoformat())
                send(profile.socketsession, message)
            except NoSocket as e:
                send(socket.session.session_id, {"action": "error", "message": "No connected sockets exist"})


@events.on_subscribe
def subcribe(request, socket, context, channel):
    room = get_object_or_404(Room, name=channel)
    if room:

        try:
            send(socket.session.session_id, {"message": "Welcome"})
            joined = {"action": "join", "name": request.user.username, "id": request.user.id}
            socket.send_and_broadcast_channel(joined, channel)
        except NoSocket as e:
            send(socket.session.session_id, {"error": "No connected sockets exist"})
    else:
        send(socket.session.session_id, {"error": "Room not exits"})


@events.on_message(channel="^[0-9a-zA-Z_-]+$")
def messagechanel(request, socket, context, message):
    print 'inchannel'
    action = message['action']
    func = optionchannel.get(action, lambda: "nothing")
    func(request, socket, context, message)


@events.on_disconnect(channel="^[0-9a-zA-Z_-]+$")
def disconect(request, socket, context):
    print 'deconect channel'


@events.on_disconnect
def disconect(request, socket, context):
    print 'deconect'

#
# @events.on_finish(channel="^[0-9a-zA-Z_-]+$")
# def finish(request, socket, context):
#     RoomCall.objects.filter(usercreator__user__username=request.user.username).delete()
#     socket.send_and_broadcast_channel({
#         'action': "finish",
#
#     })
