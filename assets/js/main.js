
$(document).ready(function() {
    var ws = new WebSocket("ws://localhost:8001/");

    ws.onopen = function()
    {
        alert("I am ready to play informational videos on trash. :)");
    };

    ws.onmessage = function (evt)
    {
        console.log(evt.data);
        var data = JSON.parse(evt.data);
        $('#player').attr('src', 'assets/videos/' + data.videoName)[0].play();

    };

});