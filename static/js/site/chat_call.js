$(document).ready(function () {

    window.history.replaceState("slack call ", "slack call ", "/call/" + roomname);
    console.log("server", document.domain);


    window.room = {
        localStream: null,
        users: {},
        name: roomname,
        cons: {
            camera: {'video': true, 'audio': true},
            audioOnly: {'video': false, 'audio': true},
            screen: {'video': {mandatory: {chromeMediaSource: 'screen'}}, 'audio': false}
        },

        status: {
            connected: false,
            muted: false,
            smuted: false,
            vmuted: false,
            mod: false,
            streamType: 'camera',
        }
    };

    initUserList();
    initStream(room.cons.audioOnly);
    userAuteticated();
    initView();

    var socket = io.connect("/chat");

    socket.on('connect', function () {
        socket.emit('join', {"user": userlogged});
        

        if (action == "created") {
            // # TODO: verificar si ya esta en la sala
            socket.emit("messagechanel", {action: "call", user_from: userlogged, user_to: usercall, room: roomname});
        }
        else if (action == "joined") {
            socket.emit("messagechanel", {action: "callaccept", user_from: userlogged, room: roomname});
        }


    });


    socket.on('message', onmessage);
    socket.on('disconnect', function () {
        console.log(" disconnect")
    });
    room.localAudio = $('#localAudio');

    function onmessage(msg) {

        console.log("Got message", msg);
        switch (msg.action) {
            case "user_list":
                users = JSON.parse(msg.users);
                initUserList();
                initStream(room.cons.audioOnly);
                break;
            case "join":
                userAdd(msg.user_from);
                break;
            case "leave":
                userDel(msg.user_from);
                break;
            case "call_decline":
                alert("se fue");
                break;
            case "offer":
                handleOffer(msg);
                break;
            case "answer":
                handleAnswer(msg);
                break;
            case "candidate":
                handleCandidate(msg);
                break;

            default:
                break;
        }
    };


    function handleOffer(data) {
        members(users);
        var from = data.user_from;
        console.log('call', 'Call received: ' + from + JSON.stringify(data.offer));
        if (!room.status.muted)
            room.users[from].pc.addStream(room.localStream);

        room.users[from].pc.setRemoteDescription(new RTCSessionDescription(data.offer), function () {
            room.users[from].pc.createAnswer(function (answer) {
                room.users[from].pc.setLocalDescription(answer);
                console.log("anwer to", from);
                socket.emit("messagechanel", {
                    action: 'answer',
                    room: roomname,
                    user_from: userlogged,
                    user_to: from,
                    answer: answer
                });
            }, function (err) {
                console.log('error', err);
            }, {});
        });


    };


    function handleAnswer(data) {
        members(users);
        var from = data.user_from;
        console.log('call', 'Response received: ' + room.users[from].pc);
        room.users[from].pc.setRemoteDescription(new RTCSessionDescription(data.answer));

    };


    function handleCandidate(data) {

        var from = data.user_from;
        if (data.candidate)
            room.users[from].pc.addIceCandidate(new RTCIceCandidate(data.candidate));

    };


    function hasUserMedia() {

        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mediaDevices.getUserMedia);
    }

    function userAuteticated() {


        var avatar = "";
        if (image.length) {
            avatar = "url('/media/" + image + "')";
        }
        else {
            avatar = "url('/static/images/ava_0022-48.png')";
        }
        $('.participant .member_preview_link').css("background-image", avatar);


    };
    function initUserList() {


        $.each(users, function (index, item) {
            console.log(item.user.username);
            room.users[item.user.username] = {
                'pc': '',
                'streams': [],
                'dc': {},
                'stats': {},
                'status': {'muted': false}
            };

        });

        members(users);


    };
    function initStream(cons) {
        if (hasUserMedia()) {
            navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mediaDevices.getUserMedia ||
            navigator.msGetUserMedia);
            if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia(cons, onMediaSuccess, onMediaError);
            }
            else {
                navigator.mediaDevices.getUserMedia(cons).then(onMediaSuccess).catch(onMediaError);

            }

        }


    };
    function onMediaSuccess(stream) {
        var oldStream = room.localStream;

        console.log("stream", stream)
        room.localStream = stream;
        console.log(" room.localStream", room.localStream)
        for (var user in room.users) {
            if (user != userlogged) {
                console.log("adicionar usuario", user);
                if (room.users[user].pc === '')
                    userAdd(user);
                if (oldStream)
                    room.users[user].pc.removeStream(oldStream);
                if (!room.status.muted)
                    room.users[user].pc.addStream(room.localStream);

                call(user);
            }
        }
        if (oldStream != null) {
            console.log("oldStream", oldStream)
            var track = oldStream.getTracks()[0]
            track.stop();
        }
        room.localAudio.src = window.URL.createObjectURL(stream);
    };
    function onMediaError(error) {
        console.log("Error on getUserMedia: " + error);
    };

    function userAdd(user) {
        console.log("usario adicionar", user)
        if (user) {
            if (!room.users[user])
                room.users[user] = {'pc': '', 'streams': [], 'dc': {}, 'stats': {}, 'status': {'muted': false}};


            room.users[user].pc = new webkitRTCPeerConnection({iceServers: [{url: "stun:stun.l.google.com:19302"}]}, {optional: [{RtpDataChannels: true}]});
            console.log('Peer', user + " " + room.users[user].pc)


            room.users[user].pc.onconnecting = function (message) {
                console.log('call', 'Connecting..');
            };
            room.users[user].pc.onopen = function (message) {
                console.log('call', 'Call established.');
            };
            room.users[user].pc.ontrack = function (event) {
                console.log('call', 'Stream coming from the other side.' + event.streams);
                room.users[user].streams.push(event.streams);
                var url = room.users[user].streams.map(function (stream) {
                    console.log("stream", stream);
                    return window.URL.createObjectURL(stream);
                });
                $("#" + user).attr("src", url);
                room.users[user].stats.catcher = setInterval(getBitrate(user), 5000);
            };
            room.users[user].pc.onremovestream = function (event) {
                console.log('call', 'Stream removed from the other side' + event.streams);
                room.users[user].streams.splice(room.users[user].streams.indexOf(event.streams), 1);
                var url = room.users[user].streams.map(function (stream) {
                    console.log("stream", stream);
                    return window.URL.createObjectURL(stream);
                });
                $("#" + user).attr("src", url);
                clearInterval(room.users[user].stats.catcher);
                room.users[user].stats = {};
            };
            console.log(" user", user)
            room.users[user].pc.onicecandidate = function (event) {
                console.log("candidate user", user)
                if (user != userlogged)
                    socket.emit("messagechanel", {
                        action: 'candidate',
                        room: roomname,
                        user_to: user,
                        user_from: userlogged,
                        candidate: event.candidate
                    });
            };
            if (!room.status.muted)
                console.log("stream", room.localStream);
            console.log("conection", room.users[user].pc);
            room.users[user].pc.addStream(room.localStream);
            room.users[user].pc.ondatachannel = function (event) {
                if (!room.users[user].dc.channel) initDC(user, event.channel);
            };
            userlistUpdate();
        }
    };
    function userDel(user) {
        if (room.users[user]) {
            clearInterval(room.users[user].stats.catcher);
            delete room.users[user];
            $("audio#" + user).remove();
        }

    };
    function call(user) {
        console.log("call user", user);
        if (typeof(room.users[user]) !== 'undefined') {
            if (!room.users[user].dc.channel)
                initDC(user, room.users[user].pc.createDataChannel('data'));
            room.users[user].pc.createOffer(function (offer) {
                room.users[user].pc.setLocalDescription(offer);
                socket.emit("messagechanel", {
                    action: 'offer', room: roomname, user_to: user, user_from: userlogged, offer: offer
                })
                ;
            }, function (err) {
                console.log('error', err);
            }, {});
        }
    };
    function initDC(user, channel) {
        console.log('channel', channel);
        room.users[user].dc = {};
        room.users[user].dc.buffer = [];
        room.users[user].dc.sending = false;
        room.users[user].dc.channel = channel;

        channel.onopen = function () {
            console.log('channel', 'Channel created with ' + user);
        };
        channel.onclose = function () {
            console.log('channel', 'Channel closed with ' + user);
        };
        channel.onerror = function (err) {
            console.log('channel', 'Channel error: ' + err);
        };
        // Receiving files
        channel.onmessage = function (event) {
            {
                var data = JSON.parse(event.data);
                users[user].dc.buffer.push(data.message);

                if (data.last) {
                    var save = document.createElement('a');
                    save.href = room.users[user].dc.buffer.join('');
                    save.target = '_blank';
                    save.download = data.name;
                    save.click();
                    // var event = document.createEvent('Event');
                    // event.initEvent('click', true, true);
                    // save.dispatchEvent(event);
                    // (window.URL || window.webkitURL).revokeObjectURL(save.href);
                    room.users[user].dc.buffer = [];
                }
            }

            console.log('channel', channel.readyState)
        }
    };
    function getBitrate(user) {
        room.users[user].pc.getStats(function f(stats) {
            var results = stats.result();
            results.map(function (res) {
                if (res.type == 'ssrc' && res.stat('googFrameHeightReceived')) {
                    var bytesNow = res.stat('bytesReceived');
                    if (room.users[user].stats.timestampPrev) {
                        var bitRate = Math.round((bytesNow - room.users[user].stats.bytesPrev) * 8 / (res.timestamp - room.users[user].stats.timestampPrev));
                        log('stats', user + ': ' + bitRate + ' kbits/sec');
                        room.users[user].stats.bitRate = bitRate;
                    }
                    room.users[user].stats.bytesPrev = bytesNow;
                    room.users[user].stats.timestampPrev = res.timestamp;
                }
            });
        });
    };


    function userlistUpdate() {
        var region = $("#audioregion");

        for (var user in users) {

            if (!$("audio#" + users[user].user.username).length) {
                region.append(' <audio id="' + users[user].user.username + '" autoplay></audio>');
            }
        }

    };


    window.request = function (urlSend, typeRequest, dataType, dataSend, doneFunction, errorFunction, type) {
        $('#convo_loading_indicator').show();
        if (type == 'file') {
            $.ajax({
                type: typeRequest,
                url: urlSend,
                data: dataSend,
                cache: false,
                contentType: false,
                processData: false,
                dataType: dataType,
                crossDomain: true,
                headers: {"X-CSRFToken": getCookie("csrftoken")},
                success: doneFunction,
                error: errorFunction,
                complete: function () {
                    $('#convo_loading_indicator').hide();
                }
            });
        } else {
            $.ajax({
                type: typeRequest,
                url: urlSend,
                data: dataSend,
                dataType: dataType,
                headers: {"X-CSRFToken": getCookie("csrftoken")},
                success: doneFunction,
                error: errorFunction,
                complete: function () {
                    $('#convo_loading_indicator').hide();
                }
            });
        }
    };
    window.getCookie = function (c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    };

    function members(members) {

        var participants = $("#participants");
        participants.empty();
        $.each(members, function (indes, item) {
            var avatar = "";
            if (item.user.username != userlogged) {
                if (item.image.length) {
                    avatar = "url('" + item.image + "')";
                }
                else {
                    avatar = "url('/static/images/ava_0022-48.png')";
                }
                var image = '<div class="member member_preview_link member_image thumb_48"' +
                    ' style="background-image:' + avatar + '" ></div>'
                participants.append(item_participan(avatar, item.user.username));
            }
        });


    };

    function updateView() {

        var spinner = $(".spinner");
        spinner.hide()


    };
    function initView() {
        var clicked, muted = false;
        $("#calls_conference_content").append(calls_popover_invite());
        $("#calls_conference_content").append(calls_popover_settings());
        $("#calls_conference_content").append(calls_emoji_panel());
        $('#invite_icon').on('click', function () {
            var invitemenu = new inviteMenu();
            if (!clicked) {
                $(this).addClass('active');
                $('.invite_menu').addClass('show');
                clicked = true;
                invitemenu.startView();
            }
            else {
                $(this).removeClass('active');
                $('.invite_menu').removeClass('show');
                clicked = false;
                invitemenu.close();
            }

        });
        $('#settings_icon').on('click', function () {

            if (!clicked) {
                $(this).addClass('active');
                clicked = true;
                $('.settings_menu').addClass('show');

            }
            else {
                $(this).removeClass('active');
                $('.settings_menu').removeClass('show');
                clicked = false;

            }

        });
        $('#emoji_icon').on('click', function () {

            if (!clicked) {
                $(this).addClass('active');
                clicked = true;
                $('.emoji_panel').addClass('show');

            }
            else {
                $(this).removeClass('active');
                $('.emoji_panel').removeClass('show');
                clicked = false;

            }

        });
        $('#mute_audio').on('click', function () {

            if (!muted) {
                $(this).addClass('muted');
                muted = true;


            }
            else {
                $(this).removeClass('muted');
                muted = false;

            }

        });

    };

    function inviteMenu() {
        var $invite_list_holder = $("#invite_list_holder");
        var invite_users = [];
        var $input_container;
        var $lfs_value;
        var i$input;
        var $list_container;
        var $list;
        var $empty;


        inviteMenu.prototype.startView = function () {

            $invite_list_holder.append(filter_select_container());
            $input_container = $invite_list_holder.find(".lfs_input_container");
            $lfs_value = $invite_list_holder.find(".lfs_value");
            i$input = $invite_list_holder.find(".lfs_input");
            $list_container = $invite_list_holder.find(".lfs_list_container");
            $list = $invite_list_holder.find(".lfs_list");
            $empty = $invite_list_holder.find(".lfs_empty");
            filterView('');
            $list_container.on("input", "#lfs_input", function () {
                var input = $("#lfs_input").val();
                filterView(input);
            });
            $list_container.on("click", ".calls_invite_member", function () {
                _selectRow($(this))

            });
            $("#invite_button").on("click", function () {


            });
            $(".invite_menu .open_share_ui_trigger").on("click", function () {
                if (!$(".share_menu").length)
                    initSharePopover();

            });

        };

        inviteMenu.prototype.close = function () {
            $invite_list_holder.empty();
            $list_container.unbind('input').off("input", "#lfs_input", function () {

            });
            $list_container.unbind('click').off("click", ".calls_invite_member", function () {


            });
            $("#invite_button").unbind('click').off("click", function () {


            });
        };

        function _selectRow(row) {
            var member = row.attr('data-member-id');
            var avatar = row.attr('data-img');

            invite_users.push(member);
            $(".lfs_input_container .lfs_value ").append(item_member_token(member, avatar));
            $(".lfs_input_container .lfs_input").focus().val('').removeAttr('placeholder');
            var input = $("#lfs_input").val();
            filterView(input);
            _updateGo();


        }

        function filterView(input) {


            var exc = function (data) {
                $list.empty();

                $.each(data, function (index, item) {
                    if ($.inArray(item.user.username, invite_users) == -1) {
                        $list.append(calls_invitee(item));
                    }


                });
            };
            var urlapi = apiUrl + 'usercomapny/';
            $.when(users_online()).done(function () {
                request(urlapi, 'POST', null, {term: input}, exc, null);
            });
        }

        function _updateGo() {
            if (invite_users.length) {
                $("#invite_button").removeAttr("disabled")
            } else {
                $("#invite_button").attr("disabled")
            }

        };

    };
    function initSharePopover() {

    };
    function users_online() {
        var exc = function (response) {
            $('#active_members_count_value').html(response.length);
            window.users_logged = response.length;
        };

        var urlapi = apiUrl + companyuser + '/users-logged/';
        request(urlapi, 'GET', null, null, exc, null);
    };
});
