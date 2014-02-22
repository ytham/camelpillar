var express = require('express'),
    fs = require('fs'),
    url = require('url'),
    ecg = require('echoprint-codegen');


var app = express();
var server = app.listen(8888, "0.0.0.0");
var io = require('socket.io').listen(server);

// Express setup
app.use(express.static(__dirname + '/'));
app.use(express.bodyParser());

var numSamples = 110250,  // Number of samples to read from file (30 seconds)
    songOffset = 0,
    bytesPerSample = 4,     // Samples are 32 bit floats
    bufferSize = numSamples * bytesPerSample,
    buffer = new Buffer(bufferSize);

ecg({file: 'test.wav'}, function (err, data) {
  if (err) return console.error(err);
  console.log(data); // {"metadata":{...}, "code_count": 4098, "code": "eJzFn..."}
});
