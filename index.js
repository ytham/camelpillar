var express = require('express'),
    fs = require('fs'),
    url = require('url');


var app = express();
var server = app.listen(8888, "0.0.0.0");
//var io = require('socket.io').listen(server);

// Express setup
app.use(express.static(__dirname + '/'));
app.use(express.bodyParser());

var numSamples = 110250,  // Number of samples to read from file (30 seconds)
    songOffset = 0,
    bytesPerSample = 4,     // Samples are 32 bit floats
    bufferSize = numSamples * bytesPerSample,
    buffer = new Buffer(bufferSize);
/*
fs.open('./song.pcm', 'r', function (err, fd) {
  if (err) throw "Error opening file";

  // Read samples from file
  fs.read(fd, buffer, 0, bufferSize, 0, function (err, bytesRead) {
    if (err) throw "Error reading file";
    if (bytesRead < bufferSize) throw "Couldn't read enough";

    // Generate echoprint code
    ecg(buffer, numSamples, songOffset, console.log);
  });
});
*/