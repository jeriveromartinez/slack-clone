var yourConn;
var stream;
var name;
var connectedUser;
$(document).ready(function () {


    var socket = new io.Socket(document.domain, {reconnection: true});


    socket.connect();
    setInterval(function () {
        socket.connect();
    }, 5000);

    socket.on('connect', function () {
        var data = {title: title, purpose: purpose, visibility: visibility, invites: JSON.stringify(usersjoined)};


        function exc() {
            Begin();
        }

        var urlapi = apiUrl + 'create_room';
        request(urlapi, 'POST', null, data, exc, null);

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
            case "offer":
                handleOffer(data.offer, data.name);
                break;
            case "answer":
                handleAnswer(data.answer);
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

        loginPage.style.display = "none";
        callPage.style.display = "block";

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


    callBtn.addEventListener("click", function () {
        var callToUsername = callToUsernameInput.value;

        if (callToUsername.length > 0) {

            connectedUser = use;

            // create an offer
            yourConn.createOffer(function (offer) {
                socket.send({
                    type: "offer",
                    offer: offer
                });

                yourConn.setLocalDescription(offer);
            }, function (error) {
                alert("Error when creating an offer");
            });

        }
    });

//when somebody sends us an offer
    function handleOffer(offer, name) {
        connectedUser = name;
        yourConn.setRemoteDescription(new RTCSessionDescription(offer));

        //create an answer to an offer
        yourConn.createAnswer(function (answer) {
            yourConn.setLocalDescription(answer);

            socket.send({
                type: "answer",
                answer: answer
            });

        }, function (error) {
            alert("Error when creating an answer");
        });
    };

//when we got an answer from a remote user
    function handleAnswer(answer) {
        yourConn.setRemoteDescription(new RTCSessionDescription(answer));
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


});

