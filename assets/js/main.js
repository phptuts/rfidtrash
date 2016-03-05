
$(document).ready(function() {
    var ws = new WebSocket("ws://localhost:8001/");

    ws.onopen = function()
    {
        alert("I AM OPEN");
    };

    ws.onmessage = function (evt)
    {
        console.log(evt.data);
        var data = JSON.parse(evt.data);
        $('#title').html(data.title);
        $('#player').attr('src', data.video)[0].play();

    };

});