'use strict';

var debug = require('debug')('retrospecter');

var util = require('util');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');

var Board = require('./models').Board;
var Team = require('./models').Team;

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server, { serveClient: false });

app.use(bodyParser.json());

app.use(cors());
app.use(function(err, req, res, next) {
  res.status(500).send({
    message: err.message || err,
    stack: err.stack || err
  });
});

/**
 * Team
 */

app.get('/teams', function(req, res, next) {
  return Team.find({}, function(err, teams) {
    if (err) {
      return next(err);
    }

    res.status(200).send(teams);
  });
});

app.post('/teams', function(req, res, next) {
  var team = new Team(req.body);

  return team.save(function(err) {
    if (err) {
      return next(err);
    }

    res.status(200).send(team);
  });
});

app.get('/teams/:teamId/boards', function(req, res) {
  return Board.find({
    teamId: req.params.teamId
  }, function(err, boards) {
    if (err) {
      return next(err);
    }

    res.status(200).send(boards);
  });
});

app.post('/teams/:teamId/boards', function(req, res) {
  debug(util.format('creating board for teamId: %s', req.params.teamId));

  var board = new Board(req.body);

  return board.save(function(err) {
    if(err) {
      return next(err);
    }

    res.status(200).send(board);
  });
});

app.get('/teams/:teamId/boards/:boardId', function(req, res) {
  debug('getting team board', req.params.teamId, req.params.boardId);
  return Board.findOne({
    _id: req.params.boardId,
    teamId: req.params.teamId
  }, function(err, board) {
    if (err) {
      return next(err);
    }

    res.status(200).send(board);
  });
});

app.post('/teams/:teamId/boards/:boardId/messages', function(req, res) {
  debug('attempting to message to boardId: ' + req.params.boardId);
  var message = req.body;

  io.sockets.in(req.params.boardId).emit('message', {
    boardId: req.params.boardId,
    message: message
  });

  res.status(200).send();
});

server.listen(8080, function() {
  debug('server started...');
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
