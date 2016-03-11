
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
        $('#player').attr('src', 'assets/videos/' + data.videoName);
    };

    var timer = 0;
    video.addEventListener('progress', function (e) {
        if (this.buffered.length > 0) {

            if (timer != 0) {
                clearTimeout(timer);
            }

            timer = setTimeout(function () {
                if(parseInt(video.buffered.end() / video.duration * 100) == 100) {
                    // video has loaded....
                    $('#player')[0].play();
                };
            }, 100);

        }
    }, false);


    setInterval(function() {
        ws.send("I am still connected");
    }, 1000);



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