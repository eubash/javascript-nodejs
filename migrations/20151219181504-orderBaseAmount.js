'use strict';

var Order = require('payments').Order;
var currencyRate = require('currencyRate');

exports.up = function*() {
  yield* currencyRate.boot();
  let orders = yield Order.find({});
  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];
    yield function(callback) {
      order.save(function(err) {
        callback(err);
        console.log(order);
      });
    };
  }
};

exports.down = function*() {
};
