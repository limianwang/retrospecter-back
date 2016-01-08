'use strict';

var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Team', teamSchema);
