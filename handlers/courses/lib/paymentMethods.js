'use strict';

const payments = require('payments');
const config = require('config');
var paymentMethods = {};

var methodsEnabled = [ 'yakassa', 'paypal', 'webmoney', 'yandexmoney', 'interkassa', 'banksimple', 'banksimpleua', 'invoice'];

if (process.env.NODE_ENV != 'production') {
  methodsEnabled.push('fail', 'success');
}

methodsEnabled.forEach(function(key) {
  paymentMethods[key] = payments.methods[key].info;
});

module.exports = paymentMethods;
