var SerialPort = require("serialport").SerialPort;
var ws = require("nodejs-websocket");
var express = require('express');
var app = express();
var path = require('path');
var connectionSocket = null;



var serialPort = new SerialPort("/dev/cu.usbmodem1451", {//"/dev/tty-usbserial1", {
    baudrate: 9600
});

var server = ws.createServer(function (conn) {
    connectionSocket = conn;
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });
}).listen(8001);


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

var currentRFID = "";



serialPort.on("open", function () {
    serialPort.on('data', function(data) {
        currentRFID += data;
        if(currentRFID.indexOf('END READ') > 0) {
            currentRFID =  currentRFID.replace('END READ', '').replace('BEGIN READ', '').replace(/ /g, '');
            console.log(currentRFID);
            if(currentRFID.indexOf('3491C955') > -1) {
                connectionSocket.sendText(JSON.stringify({title: "Don't Mess With Texas", "video" : 'assets/videos/video1.mp4'}));
            }
            else {
                connectionSocket.sendText(JSON.stringify({title: "Stop Trashing Texas", "video" : 'assets/videos/video2.mp4'}));
            }
            currentRFID = "";
        }
    });
    serialPort.write("ls\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
    });
});