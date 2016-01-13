const config = require('config');
const mongoose = require('mongoose');

exports.all = function* (next) {
  yield* this.loadTransaction('orderNumber');

  this.redirectToOrder();
};
