'use strict';

var mongoose = require('mongoose');

var actionSchema = new mongoose.Schema({
  actionName: {
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
  status: {
    type: String,
    enum: ['TODO','IN PROGRESS','DONE'],
    default: 'TODO'
  },
  endDate: {
    type: Date
  },
});

module.exports = mongoose.model('Action', actionSchema);
