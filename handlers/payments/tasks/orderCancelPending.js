var co = require('co');
var Order = require('../models/order');
var currencyRate = require('currencyRate');

module.exports = function() {

  return function() {

    return co(function*() {
      yield* currencyRate.boot();

      var lastNumber = 0;
      while(true) {

        var order = yield Order.findOne({
          status: Order.STATUS_PENDING,
          number: { $gt: lastNumber }
        }).sort({number: 1}).limit(1).exec();

        if (!order) break;
        lastNumber = order.number;

        yield* order.cancelIfPendingTooLong();
      }
    });

  };
};

