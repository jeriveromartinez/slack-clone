import logging

from plataforma.serializers import ProfileSerializer
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin
from socketio.mixins import BroadcastMixin
from socketio.sdjango import namespace
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils.datetime_safe import time
from django.utils.html import strip_tags
from plataforma.models import *
from django.utils import timezone
import json


def message(self, message):
    room = get_object_or_404(Room, name=message["room"])
    if room:
        MessageInstEvent.objects.create(room=room, user_from=message["user_from"], msg=message["message"],
                                        date_pub=timezone.now())

        message["message"] = strip_tags(message["message"])
        message["name"] = message["user_from"]
        self.emit_to_room(self.room, 'message', message)
    else:
        profile = Profile.objects.get(user__username=message["user_from"])
        self.sendMessage(profile.socketsession, 'message', {"error": "Room not exits"})


def call(self, message):
    profile = Profile.objects.get(user__username=message["user_to"])
    room = RoomCall.objects.get(name=message['room'])

    if profile:
        self.sendMessage(profile.socketsession, 'message',
                         {"action": "call_join_request", "user_from": message["user_from"],
                          "user_to": message["user_to"],
                          'avatar': profile.image.url, "room": room.name})

    else:
        profile = Profile.objects.get(user__username=message["user_from"])
        self.sendMessage(profile.socketsession, 'message',
                         {"action": "call_failed", "message": "No connected sockets exist"})


def callaccept(self, message):
    room = RoomCall.objects.get(name=message['room'])
    serializer = ProfileSerializer(room.users.all(), many=True)
    users = json.dumps(serializer.data)
    profile = Profile.objects.get(user__username=message["user_from"])
    self.sendMessage(profile.socketsession, 'message',
                     {"action": "user_list", "room": room.name, "user_from": message["user_from"], "users": users})
    for item in room.users.all():
        print 'Sending begin to: ' + item.user.username + " " + item.socketsession
        self.sendMessage(item.socketsession, 'message',
                         {"action": "join", "room": room.name, "user_from": message["user_from"], "users": users})


def calldecline(self, message):
    room = RoomCall.objects.get(name=message['room'])

    self.broadcast_event('message', {"action": "call_decline", "user_from": message["user_from"], "room": room.name})


def offer(self, message):
    room = RoomCall.objects.get(name=message['room'])
    profile = Profile.objects.get(user__username=message["user_to"])

    print 'Sending offer to: ' + profile.user.username + " " + profile.socketsession
    self.sendMessage(profile.socketsession, 'message', {
        'action': "offer",
        'offer': message['offer'],
        'user_from': message["user_from"],
        "room": room.name,

    })


def answer(self, message):
    room = RoomCall.objects.get(name=message['room'])
    profile = Profile.objects.get(user__username=message["user_to"])

    print 'Sending answer to: ' + profile.user.username + " " + profile.socketsession
    self.sendMessage(profile.socketsession, 'message', {
        'action': "answer",
        'answer': message['answer'],
        'user_from': message["user_from"],
        "room": room.name,

    })


def candidate(self, message):
    room = RoomCall.objects.get(name=message['room'])
    profile = Profile.objects.get(user__username=message["user_to"])
    print 'candidate' + message["user_to"]

    print 'Sending offer to: ' + profile.user.username + " " + profile.socketsession
    self.sendMessage(profile.socketsession, 'message', {
        'action': "candidate",
        'candidate': message['candidate'],
        'user_from': message["user_from"],
        "room": room.name,

    })


def leave(self, message):
    self.broadcast_event('message', {
        'action': "leave",
        'user_from': message["user_from"]

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


@namespace('/chat')
class ChatNamespace(BaseNamespace, RoomsMixin, BroadcastMixin):
    nicknames = []

    # self.socket.server.sockets.get_socket
    def initialize(self):
        self.logger = logging.getLogger("socketio.chat")
        self.log("Socketio session started")

    def log(self, message):
        self.logger.info("[{0}] {1}".format(self.socket.sessid, message))

    def subcribe(self, data):
        self.room = data['room']
        self.join(data['room'])
        return True

    def on_join(self, data):
        user = data['user']
        profile = Profile.objects.get(user__username=user)
        profile.socketsession = self.socket.sessid
        profile.save()
        self.sendMessage(self.socket.sessid, 'connected', {"action": "connected", "message": profile.user.username})
        return True

    def on_message(self, msg):

        if msg['action'] == "message":
            user_from = User.objects.get(username=msg["user_from"])
            if user_from:
                profile = Profile.objects.get(user__username=msg["user_to"])
                message = MessageInstEvent.objects.create(user_to=profile.user, user_from=user_from,
                                                          msg=msg["message"],
                                                          type="message_int_event")
                msg["action"] = "message"
                msg["user_to"] = profile.user.username
                msg["user_from"] = user_from.username
                msg["date_pub"] = str(message.date_pub.isoformat())
                self.sendMessage(profile.socketsession, 'message', msg)

        return True

    def on_messagechanel(self, msg):
        print 'inchannel'
        action = msg['action']
        func = optionchannel.get(action, lambda: "nothing")
        func(self, message)

        return True

    def sendMessage(self, sessid, event, *args):
        socket = self.socket.server.get_socket(sessid)
        if socket:
            pkt = dict(type="event",
                       name=event,
                       args=args,
                       endpoint=self.ns_name)
            socket.send_packet(pkt)
