'use strict';

var path = require('path');
var config = require('config');
var fs = require('mz/fs');

// Group info for a participant, with user instructions on how to login
exports.get = function*() {

  let group = this.groupBySlug;

  let logName = this.params.logName.replace(/[^-.\d\w]/g, '');

  let filePath = path.join(config.jabberLogsRoot, group.webinarId, logName + '.html');

  let exists = yield fs.exists(filePath);
  if (!exists) {
    this.throw(404);
  }

  this.type = 'text/html; charset=utf-8';
  this.body = fs.createReadStream(filePath);

};

