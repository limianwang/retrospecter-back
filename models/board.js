'use strict';

var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  period: {
    type: String,
    lowercase: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Board', boardSchema);
