var yourConn;
var stream;
var name;
var connectedUser;

$(document).ready(function () {

        window.history.replaceState("slack call ", "slack call ", "/call/" + roomname);
        var socket = new io.Socket(document.domain, {reconnection: true});


        socket.connect();

        socket.on('connect', function () {

            socket.subscribe(roomname);
            if (action == "created") {
                socket.send({action: "call", user_from: userlogged, user_to: usercall, room: roomname});
            }
            else if (action == "joined") {
                socket.send({action: "callaccept", user_from: userlogged, room: roomname});
            }


        });

        socket.on('message', onmessage);
        socket.on('disconnect', function () {
            console.log(" disconnect")
        });
        var localVideo = $('#localVideo');
        var remoteVideo = $('#remoteVideo');

        function onmessage(msg) {


            switch (msg.action) {

                //when somebody wants to call us
                case "call_begin":
                    Begin();
                    Offer(msg);
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
                //when a remote peer sends an ice candidate to us
                case "candidate":
                    handleCandidate(data.candidate);
                    break;
                case "leave":
                    handleLeave();
                    break;
                default:
                    break;
            }
        };

        function hasUserMedia() {
            //check if the browser supports the WebRTC
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mediaDevices.getUserMedia);
        }


        function Begin() {



            //**********************
            //Starting a peer connection
            //**********************
            if (hasUserMedia()) {
                navigator.getMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
                //getting local audio stream

                if (navigator.webkitGetUserMedia) {
                    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(function (myStream) {
                        stream = myStream;

                        //displaying local audio stream on the page
                        localAudio.src = window.URL.createObjectURL(stream);

                        //using Google public stun server
                        var configuration = {
                            "iceServers": [{"url": "stun:stun2.1.google.com:19302"}]
                        };


                        if (navigator.webkitGetUserMedia) {
                            yourConn = new webkitRTCPeerConnection(null);
                        }

                        // setup stream listening
                        yourConn.addStream(stream);

                        //when a remote user adds stream to the peer connection, we display it
                        yourConn.onaddstream = function (e) {
                            remoteAudio.src = window.URL.createObjectURL(e.stream);
                        };

                        // Setup ice handling
                        yourConn.onicecandidate = function (event) {
                            if (event.candidate) {
                                socket.send({
                                    type: "candidate",
                                    candidate: event.candidate
                                });
                            }
                        };

                    }).catch(function (error) {
                        console.log(error);
                    });
                }
                else {
                    navigator.getMedia({video: false, audio: true},
                        function (myStream) {
                            stream = myStream;

                            //displaying local audio stream on the page
                            localAudio.src = window.URL.createObjectURL(stream);

                            //using Google public stun server
                            var configuration = {
                                "iceServers": [{"url": "stun:stun2.1.google.com:19302"}]
                            };

                            yourConn = new RTCPeerConnection(null);

                            // setup stream listening
                            yourConn.addStream(stream);

                            //when a remote user adds stream to the peer connection, we display it
                            yourConn.onaddstream = function (e) {
                                remoteAudio.src = window.URL.createObjectURL(e.stream);
                            };

                            // Setup ice handling
                            yourConn.onicecandidate = function (event) {
                                if (event.candidate) {
                                    socket.send({
                                        type: "candidate",
                                        candidate: event.candidate
                                    });
                                }
                            };

                        },
                        function (error) {
                            console.log(error);
                        });
                }

            }

        }


        function Offer(data) {


            if (data.length > 0) {


                // create an offer
                yourConn.createOffer(function (offer) {
                    socket.send({
                        type: "offer",
                        offer: offer,
                        user_from: userlogged,
                        room: data.room
                    });

                    yourConn.setLocalDescription(offer);
                }, function (error) {
                    alert("Error when creating an offer");
                });

            }
        }


//when somebody sends us an offer
        function handleOffer(data) {

            connectedUser = name;
            yourConn.setRemoteDescription(new RTCSessionDescription(data.offer));

            //create an answer to an offer
            yourConn.createAnswer(function (answer) {
                yourConn.setLocalDescription(answer);

                socket.send({
                    type: "answer",
                    answer: answer,
                    user_from: userlogged,
                    user_to: data.user_from,
                    room: data.room
                });

            }, function (error) {
                alert("Error when creating an answer");
            });
        };

//when we got an answer from a remote user
        function handleAnswer(data) {
            yourConn.setRemoteDescription(new RTCSessionDescription(data.answer));
        };

//when we got an ice candidate from a remote user
        function handleCandidate(candidate) {
            yourConn.addIceCandidate(new RTCIceCandidate(candidate));
        };

//hang up
//     hangUpBtn.addEventListener("click", function () {
//
//         socket.send({
//             type: "leave"
//         });
//
//         handleLeave();
//     });

        function handleLeave() {
            connectedUser = null;
            remoteVideo.src = null;

            yourConn.close();
            yourConn.onicecandidate = null;
            yourConn.onaddstream = null;
            window.location.href = window.location.href;
        };


    }
);

