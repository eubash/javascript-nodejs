'use strict';

const payments = require('payments');
const config = require('config');
const paymentMethods = {};

const methodsEnabled = [ 'yakassa', 'paypal', 'webmoney', 'yandexmoney', 'banksimple', 'banksimpleua', 'invoice', 'payanyway', 'interkassa'];

if (process.env.NODE_ENV != 'production') {
  methodsEnabled.push('fail', 'success');
}

methodsEnabled.forEach(function(key) {
  paymentMethods[key] = payments.methods[key].info;
});

module.exports = paymentMethods;
