'use strict';

var debug = require('debug')('retrospecter');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

var models = require('./models');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server, { serveClient: false });

app.use(bodyParser.json());

app.post('/boards', function(req, res) {
  var boardId = randBoardId();
  debug('creating boardId:' + boardId);

  res.status(200).send(boardId);
});

app.post('/boards/:boardId/messages', function(req, res) {
  debug('attempting to message to boardId: ' + req.params.boardId);
  var message = req.body;

  io.sockets.in(req.params.boardId).emit('message', {
    boardId: req.params.boardId,
    message: message
  });

  res.status(200).send();
});

server.listen(8080, function() {
  console.log('server started ...');
});

io.sockets.on('connection', function(socket) {
  debug('someone connected...');
  socket.on('subscribe', function(boardId) {
    debug('joining boardId' + boardId);
    socket.join(boardId);
  });

  socket.on('unsubscribe', function(boardId) {
    debug('leaving boardId' + boardId);
    socket.leave(boardId);
  });

  socket.on('send', function(data) {
    debug('sending message');
    io.sockets.in(data.boardId).emit('message', data);
  });
});

function randBoardId() {
  return Math.floor(Math.random(0, 9000)) + 1000;
}
