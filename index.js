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

      var options = {
        hostname: 'http://developer.echonest.com/api/v4/track/upload?api_key=D28CDJNXBWXV63EDM&filetype=wav',
        port: 80,
        path: '/upload',
        method: 'POST'
      };

      var req = http.request(options, )

      ecg({file: "testdata.wav"}, function (err, data) {
        if (err) return console.error(err);
        //console.log(data.code); // {"metadata":{...}, "code_count": 4098, "code": "eJzFn..."}

        var reqUrl = "http://developer.echonest.com/api/v4/song/identify?api_key=D28CDJNXBWXV63EDM&version=4.2&code=" + data.code;
        http.get(reqUrl, function (res) {
          res.on('data', function (chunk) {
            chunk = JSON.parse(chunk);
            console.log(chunk);
            var songId = chunk.response.songs[0].id;

            var reqUrl2 = "http://developer.echonest.com/api/v4/track/profile?api_key=D28CDJNXBWXV63EDM&format=json&id=" + songId + "&bucket=audio_summary";
            http.get(reqUrl2, function (res) {
              res.on('data', function (chunk) {
                chunk = JSON.parse(chunk);
                console.log(chunk);
                var tempo = chunk.response.track.audio_summary.tempo;
                console.log("FUCK YEAH: " + tempo);
              });
            }).on('error', function(e) {
              console.log("Got error: " + e.message);
            });
          });
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });
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

