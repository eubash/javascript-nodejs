'use strict';

const yakassaConfig = require('config').payments.modules.yakassa;
const mongoose = require('mongoose');
const Order = require('../../models/order');
const Transaction = require('../../models/transaction');
const md5 = require('MD5');

// ONLY ACCESSED from YAKASSA SERVER
exports.check = function* (next) {

  yield* this.loadTransaction('orderNumber', {skipOwnerCheck: true});

  if (!checkSignature(this.request.body)) {
    this.log.debug("wrong signature");
    this.body = respond('checkOrderResponse', {
      code:      1,
      invoiceId: this.request.body.invoiceId
    });
    return;
  }

  yield this.transaction.logRequest('check', this.request);

  this.log.debug("check");


  if (this.transaction.status != Transaction.STATUS_PENDING ||
    this.transaction.amount != this.request.body.orderSumAmount ||
    this.request.body.shopId != yakassaConfig.shopId
  ) {
    this.log.debug("no pending transaction " + this.request.body.orderNumber);

    this.body = respond('checkOrderResponse', {
      code:      100,
      invoiceId: this.request.body.invoiceId,
      message:   'pending transaction with given params not found'
    });
    return;
  }

  this.body = respond('checkOrderResponse', {
    code:      0,
    invoiceId: this.request.body.invoiceId
  });

};


exports.paymentAviso = function* (next) {

  yield* this.loadTransaction('orderNumber', {skipOwnerCheck: true});

  if (!checkSignature(this.request.body)) {
    this.log.debug("wrong signature");
    this.body = respond('paymentAvisoResponse', {
      code:      1,
      invoiceId: this.request.body.invoiceId
    });
    return;
  }

  // if should not be needed, if responce is corect
  if (this.transaction.status != Transaction.STATUS_SUCCESS) {
    this.log.debug("will call order onPaid module=" + this.order.module);
    yield* this.order.onPaid(this.transaction);
  }

  this.body = respond('paymentAvisoResponse', {
    code:      0,
    invoiceId: this.request.body.invoiceId
  });

};

function checkSignature(body) {

  var signature = [
    body.action,
    body.orderSumAmount,
    body.orderSumCurrencyPaycash,
    body.orderSumBankPaycash,
    body.shopId,
    body.invoiceId,
    body.customerNumber,
    yakassaConfig.secret
  ].join(';');

  //console.log("MD5 pre", signature);

  signature = md5(signature).toUpperCase();

  //console.log("MD5", signature, body.md5);

  return signature == body.md5;
}


function escapeHtml(str) {
  var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
  var HTML_REPLACEMENTS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  };

  return String(str).replace(HTML_ESCAPE_REPLACE_RE, function(ch) {
    return HTML_REPLACEMENTS[ch];
  });
}

function renderAttrs(attrs) {
  var result;

  result = '';

  for (var key in attrs) {
    result += ' ' + escapeHtml(key) + '="' + escapeHtml(attrs[key]) + '"';
  }

  return result;
}

function respond(type, attrs) {
  attrs = Object.assign({}, attrs, {
    performedDatetime: new Date().toJSON(),
    shopId:            yakassaConfig.shopId
  });

  console.log("Yakassa RESPOND", type, attrs);
  return `<?xml version="1.0" encoding="UTF-8"?><${type} ` + renderAttrs(attrs) + '/>';
}

