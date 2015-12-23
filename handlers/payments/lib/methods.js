var config = require('config');
var assert = require('assert');

/**
 * Configured (only) payment methods
 */
var paymentMethods = {};
for (var key in config.payments.modules) {
  paymentMethods[key] = require('../' + key);
  assert(paymentMethods[key].renderForm, key + ": no renderForm");
}

// not rendered, assigned by code, so no renderForm
paymentMethods.direct = {

  info: {
    title:    "напрямую",
    name:     "direct",
    hasIcon:  false
  }

};

module.exports = paymentMethods;
