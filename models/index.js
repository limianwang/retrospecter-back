'use strict';

var util = require('util');
var mongoose = require('mongoose');

var config = require('../config');

var connstr = util.format('mongodb://%s:%s/%s', config.db.host, config.db.port, config.db.name);

mongoose.connect(connstr);

module.exports = {
  Board: require('./board')
};
