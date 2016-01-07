'use strict';

var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  itemDescription: {
    type: String,
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Item', itemSchema);
