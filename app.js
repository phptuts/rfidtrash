var SerialPort = require("serialport").SerialPort;
var ws = require("nodejs-websocket");
var express = require('express');
var app = express();
var path = require('path');
var connectionSocket = null;
var Engine = require('tingodb')();
var bodyParser = require('body-parser');
var currentRFID = "";

var db = new Engine.Db(__dirname + '/data', {});


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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/tags', function(req, res) {
    var tagCollection = db.collection('tags');
    tagCollection.find(function(err, tags) {
        tags.toArray(function(s, d) {
            res.send(d);
        });
    });
});

app.post('/tags', function(req, res){

    var tagCollection = db.collection('tags');
    tagCollection.remove({tagHexKey: req.body.tagHexKey.replace(/(?:\r\n|\r|\n)/g, '')});
    tagCollection.insert({
        tagHexKey: req.body.tagHexKey.replace(/(?:\r\n|\r|\n)/g, ''),
        videoNumber: parseInt(req.body.videoNumber)
    });
    res.send({success: true});
});

app.get('/manageTag', function(req, res) {
    res.sendFile(path.join(__dirname + '/manageTags.html'));
});

serialPort.on("open", function () {
    serialPort.on('data', function(data) {
        if(null !== connectionSocket) {
            currentRFID += data;
            if(currentRFID.indexOf('END READ') > 0) {
                currentRFID =  currentRFID.replace('END READ', '').replace('BEGIN READ', '').replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '');
                console.log("Using RFID - " + currentRFID);
                var tagCollection = db.collection('tags');
                tagCollection.findOne({tagHexKey: currentRFID}, function(err, tag) {
                    if(tag === undefined || tag === null) {
                        connectionSocket.sendText(JSON.stringify({"tagHexKey" : currentRFID, "videoNumber" : 4}));
                    }
                    else {
                        connectionSocket.sendText(JSON.stringify(tag));
                    }
                    currentRFID = "";
                });
            }
        }
        else {
            console.log("No socket connection available");
        }

    });
    serialPort.write("ls\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
    });
});