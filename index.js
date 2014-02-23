var express = require('express'),
    fs = require('fs'),
    atob = require('atob'),
    url = require('url'),
    http = require('http'),
    BinaryServer = require('binaryjs').BinaryServer,
    ecg = require('echoprint-codegen');


var app = express();
var server = app.listen(8888, "0.0.0.0");
var io = require('socket.io').listen(server);
//var server = http.createServer(app).listen(8888);

// Express setup
app.use(express.static(__dirname + '/'));
app.use(express.bodyParser());

// Get post data
app.post('/', function (req, res) {
  var data = req.body;
  console.log(data);

  // Execute movement data
  movement(data);

  res.writeHead(200, {"Content-Type": "text/html"});
  res.end()
});


var numSamples = 110250,  // Number of samples to read from file (30 seconds)
    songOffset = 0,
    bytesPerSample = 4,     // Samples are 32 bit floats
    bufferSize = numSamples * bytesPerSample,
    buffer = new Buffer(bufferSize);


io.sockets.on('connection', function (socket) {
  socket.on("audio", function (blob) {
    var data = blob.split(',')[1];
    data = new Buffer(data, 'base64');
    fs.writeFile("testdata.wav", data, "binary", function () {
      console.log("File write complete");
      ecg({file: "testdata.wav"}, function (err, data) {
        if (err) return console.error(err);
        console.log(data.code); // {"metadata":{...}, "code_count": 4098, "code": "eJzFn..."}
      });
    });
  });
});

/*
var binaryserver = new BinaryServer({server: server});
binaryserver.on('connection', function (srv){
  srv.on("audio", function (stream, meta){
    var file = fs.createWriteStream(meta.file);
    stream.pipe(file);
    fs.writeFileSync("output.wav", file);
  }); 
});
*/

/*
ecg({file: 'mjtest2.wav'}, function (err, data) {
  if (err) return console.error(err);
  console.log(data.code); // {"metadata":{...}, "code_count": 4098, "code": "eJzFn..."}
});*/

