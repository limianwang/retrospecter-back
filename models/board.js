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
  }
});

module.exports = mongoose.model('Board', boardSchema);
