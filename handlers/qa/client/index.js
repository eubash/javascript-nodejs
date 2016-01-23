require('./styles');

var Spinner = require('client/spinner');
var xhr = require('client/xhr');

var prism = require('client/prism');
var notification = require('client/notification');

function init() {
  alert("Welcome to Q&A");
  prism.init();
}


init();
