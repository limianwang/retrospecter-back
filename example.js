'use strict';

var request = require('request');
var socket = require('socket.io-client')('http://localhost:8080');

socket.on('connect', function() {
  socket.emit('subscribe', 1234);
  request.post({
    url: 'http://localhost:8080/boards/1234/messages',
    body: {
      test: "hello"
    },
    json: true
  });
});

socket.on('message', function(data) {
  console.log([].slice.call(arguments));
});
