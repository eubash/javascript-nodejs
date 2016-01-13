const mongoose = require('mongoose');
const Transaction = require('../../models/transaction');

exports.all = function* (next) {

  yield* this.loadTransaction('orderNumber');

  yield this.transaction.persist({
    status: Transaction.STATUS_FAIL,
    statusMessage: 'оплата не прошла'
  });

  this.redirectToOrder();

};
