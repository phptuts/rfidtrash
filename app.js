var SerialPort = require("serialport").SerialPort;
var ws = require("nodejs-websocket");
var express = require('express');
var app = express();
var path = require('path');
var connectionSocket = null;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var currentRFID = "";


var Schema = mongoose.Schema;

var tagsSchema = mongoose.model('tags', {
    tagHexKey: String,
    videoNumber: Number
});

var Tag = mongoose.model('tags', tagsSchema);

var serialPort = new SerialPort("/dev/cu.usbmodem1411", {//"/dev/tty-usbserial1", {
    baudrate: 9600
});

var server = ws.createServer(function (conn) {
    connectionSocket = conn;
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });
}).listen(8001);



var server = app.listen(3000, function () {
    mongoose.connect('mongodb://localhost/rfidvids');
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
    mongoose.model('tags').find(function(err, tags) {
        res.send(tags);
    });
});

app.post('/tags', function(req, res){
    mongoose.model('tags').findOne({'tagHexKey': req.body.tagHexKey}, function(err, tag){
        if(null === tag) {
            tag = new Tag({
                tagHexKey: req.body.tagHexKey,
                videoNumber: parseInt(req.body.videoNumber)
            });
        }
        else {
            tag.videoNumber = req.body.videoNumber;
        }
        tag.save(function(err) {
            if(err) {
                console.log(err);
                throw err;
            }
            else {
                res.send(tag);
            }
        });
    });
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
                mongoose.model('tags').findOne({tagHexKey: currentRFID}, function(err, tag) {
                    if(null === tag || undefined === tag) {
                        connectionSocket.sendText(JSON.stringify({"tagHexKey" : currentRFID, "videoNumber" : 4}));
                    }
                    else {
                        connectionSocket.sendText(JSON.stringify(tag.toObject()));
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