'use strict';

var debug = require('debug')('retrospecter');

var util = require('util');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');

var Board = require('./models').Board;
var Action = require('./models').Action;
var Team = require('./models').Team;
var Item = require('./models').Item;

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

app.get('/teams/:teamId/boards', function(req, res, next) {
  return Board.find({
    teamId: req.params.teamId
  }, function(err, boards) {
    if (err) {
      return next(err);
    }

    res.status(200).send(boards);
  });
});

app.post('/teams/:teamId/boards', function(req, res, next) {
  debug(util.format('creating board for teamId: %s', req.params.teamId));
  var body = req.body;
  body.teamId = req.params.teamId;

  var board = new Board(body);

  return board.save(function(err) {
    if(err) {
      return next(err);
    }

    res.status(200).send(board);
  });
});

app.get('/teams/:teamId/boards/:boardId', function(req, res, next) {
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

app.get('/teams/:teamId/boards/:boardId/items', function(req, res, next) {
  debug('attempting to get items for boardId:' + req.params.boardId);

  return Item.find({
    teamId: req.params.teamId,
    boardId: req.params.boardId
  }, function(err, items) {
    if (err) {
      return next(err);
    }

    res.status(200).send(items);
  });
});

app.post('/teams/:teamId/boards/:boardId/items', function(req, res, next) {
  debug('attempting to create action to boardId: ' + req.params.boardId);
  var body = req.body;

  body.teamId = req.params.teamId;
  body.boardId = req.params.boardId;

  var item = new Item(body);

  return item.save(function(err) {
    if (err) {
      return next(err);
    }

    io.sockets.in(req.params.boardId).emit('message:item', {
      boardId: req.params.boardId,
      teamId: req.params.teamId,
      message: item
    });

    res.status(200).send(item);
  });
});

app.post('/teams/:teamId/boards/:boardId/items/:itemId/votes', function(req, res, next) {
  debug('increment vote' + req.params.itemId);

  return Item.findOneAndUpdate({
    teamId: req.params.teamId,
    boardId: req.params.boardId,
    _id: req.params.itemId
  }, {
    '$inc': {
      votes: 1
    }
  }, function(err, item) {
    if (err) {
      return next(err);
    }

    res.status(200).send(item);
  });
});

app.post('/teams/:teamId/boards/:boardId/actions', function(req, res, next) {
  debug('attempting to create a new action');

  var action = new Action(req.body);
  action.teamId = req.params.teamId;
  action.boardId = req.params.boardId;
  return action.save(function(err) {
    if (err) {
      return next(err);
    }

    io.sockets.in(req.params.boardId).emit('message:action', {
      boardId: req.params.boardId,
      teamId: req.params.teamId,
      message: action
    });

    res.status(200).send(action);
  });
});

app.get('/teams/:teamId/boards/:boardId/actions', function(req, res, next) {
  debug('attemping to get actions');

  return Action.find({
    teamId: req.params.teamId,
    boardId: req.params.boardId
  }, function(err, actions) {
    if (err) {
      return next(err);
    }

    res.status(200).send(actions);
  });
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
});

function randBoardId() {
  return Math.floor(Math.random(0, 9000)) + 1000;
}
