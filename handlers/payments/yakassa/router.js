var Router = require('koa-router');

var router = module.exports = new Router();

var callback = require('./controller/callback');
var success = require('./controller/success');
var fail = require('./controller/fail');

// payment server redirects here if payment successful
router.all('/success', success.all);

// payment server redirects here if payment failed
router.all('/fail', fail.all);

router.post('/check', callback.check);
router.post('/payment-aviso', callback.paymentAviso);

