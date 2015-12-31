'use strict';

var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server, { serveClient: false });

app.get('/', function(req, res) {
  res.status(200).send({a: 'b'});
});

// Create a new board
app.post('/boards', function(req, res) {

});

// Get/Connect a new board
app.get('/boards/:boardId', function(req, res) {
});

server.listen(8080, function() {
  console.log('server started ...');
});

io.on('connection', function(socket) {
  console.log('someone connected..');

  socket.emit('event', 'welcome to the club...');
  socket.on('some response message', function() {
    console.log([].slice.call(arguments));
  });
});
