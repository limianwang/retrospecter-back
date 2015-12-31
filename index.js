'use strict';

var http = require('http');
var express = require('express');

var app = express();
app.get('/', function(req, res) {
  console.log('root');
  res.status(200).send({a: 'b'});
});

var server = http.createServer(app);

server.listen(8080, function() {
  console.log('server started ...');
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('some user connected..');
});
