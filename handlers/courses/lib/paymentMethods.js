'use strict';

const payments = require('payments');
const config = require('config');
var paymentMethods = {};

var methodsEnabled = [ 'paypal', 'webmoney', 'yandexmoney', 'payanyway', 'interkassa', 'banksimple', 'banksimpleua', 'invoice'];

if (config.env != 'production') {
  methodsEnabled.push('fail', 'success');
}

methodsEnabled.forEach(function(key) {
  paymentMethods[key] = payments.methods[key].info;
});

module.exports = paymentMethods;
