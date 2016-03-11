
$(document).ready(function() {

    var video = document.getElementById("player");
    video.addEventListener('ended', endVideo, false);


    function endVideo() {
        $('#player').hide();
    }

    var ws = new WebSocket("ws://localhost:8001/");

    ws.onopen = function()
    {
        alert("I am ready to play informational videos on trash. :)");
    };

    ws.onmessage = function (evt)
    {
        console.log(evt.data);
        var data = JSON.parse(evt.data);
        $('#player').show();
        $('#player').attr('src', 'assets/videos/' + data.videoName)[0].play();
    };



    $("body").on("click", function() {
        var i = document.getElementById("player");

// go full-screen
        if (i.requestFullscreen) {
            i.requestFullscreen();
        } else if (i.webkitRequestFullscreen) {
            i.webkitRequestFullscreen();
        } else if (i.mozRequestFullScreen) {
            i.mozRequestFullScreen();
        } else if (i.msRequestFullscreen) {
            i.msRequestFullscreen();
        }
    });

});