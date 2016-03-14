/**
 * Created by noahglaser on 3/6/16.
 */

$(document).ready(function() {
    var ws = new WebSocket("ws://localhost:8001/");

    ws.onopen = function()
    {
        alert("Ready to scan RFID Sticker. :)");
    };

    ws.onmessage = function (evt)
    {
        var data = JSON.parse(evt.data);
        var key = data.tagHexKey;
        $("[name='tagHexKey']").val(key);
        $("p#tag span").html(key);
        $("#videoId").val(data.videoName);
        $("title").html("Save Your Tag.");
    };

    $("#submitBtn").on("click", function() {
        var data = {};
        var tagHexKey = $("[name='tagHexKey']").val();
        var videoName = $("#videoId").val();
        if(tagHexKey === "" || undefined === tagHexKey || null === tagHexKey) {
            alert("Please scan a rfid sticker");
            return false;
        }

        data.tagHexKey = tagHexKey;
        data.videoName = videoName;

        $.ajax({
            url: 'http://localhost:3000/tags',
            type: 'POST',
            data: data,
            success: function() {
                alert("Successfully Saved RFID.");
            },
            error: function() {
                alert("Error in saving RFID.");
            }
        });

    })
});

