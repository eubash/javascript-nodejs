const jade = require('lib/serverJade');
const config = require('config');
const path = require('path');

module.exports = function* (transaction, order) {

  return jade.renderFile(path.join(__dirname, 'templates/form.jade'), {
    amount: transaction.amount,
    number: transaction.number,
    cps_email: order.email || order.user.email,
    customerNumber: order.user ? order.user.id : 0,
    yakassa:  config.payments.modules.yakassa,
    shopSuccessURL: process.env.SITE_HOST + '/payments/yakassa/success?transactionNumber=' + transaction.number,
    shopFailURL: process.env.SITE_HOST + '/payments/yakassa/fail?transactionNumber=' + transaction.number
  });

};


