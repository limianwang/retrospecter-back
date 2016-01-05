'use strict';

var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true
  },
  teamId: {
    type: String,
    lowercase: true
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('Board', boardSchema);
