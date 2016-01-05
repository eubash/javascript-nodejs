'use strict';

const mountHandlerMiddleware = require('lib/mountHandlerMiddleware');

const t = require('i18n');

const LANG = require('config').lang;

t.requirePhrase('tutorial.article', require('./locales/article/' + LANG + '.yml'));
t.requirePhrase('tutorial.task', require('./locales/task/' + LANG + '.yml'));


exports.init = function(app) {
  app.use(mountHandlerMiddleware('/', __dirname));

  // for "node" middleware which executes server.js inside the content
  addNodeIgnores(app);
};

// these urls may only contain example scripts for the "node" middleware
function addNodeIgnores(app) {
  app.csrfChecker.ignore.add('/task/:any*');
  app.csrfChecker.ignore.add('/article/:any*');
  app.multipartParser.ignore.add('/task/:any*');
  app.multipartParser.ignore.add('/article/:any*');
  app.bodyParser.ignore.add('/task/:any*');
  app.bodyParser.ignore.add('/article/:any*');
}


exports.Article = require('./models/article');
exports.Task = require('./models/task');

exports.TaskRenderer = require('./renderer/taskRenderer');
exports.ArticleRenderer = require('./renderer/articleRenderer');
