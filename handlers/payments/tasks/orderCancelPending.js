var co = require('co');
var Order = require('../models/order');

module.exports = function() {

  return function() {

    return co(function*() {

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

