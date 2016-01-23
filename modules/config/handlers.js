var path = require('path');
var fs = require('fs');

var handlers = [
  'clsHandler', 'countryCode', 'mongooseHandler', 'requestId', 'requestLog', 'nocache',

  // this middleware adds this.render method
  // it is *before errorHandler*, because errors need this.render
  'render',

  // errors wrap everything
  'errorHandler',

  // this logger only logs HTTP status and URL
  // before everything to make sure it log all
  'accessLogger',

  // before anything that may deal with body
  // it parses JSON & URLENCODED FORMS,
  // it does not parse form/multipart
  'bodyParser',

  // parse FORM/MULTIPART
  // (many tweaks possible, lets the middleware decide how to parse it)
  'multipartParser',

  // right after parsing body, make sure we logged for development
  'verboseLogger',

  'conditional',

  'session',

  'passportSession',

  'passportRememberMe',

  'lastActivity',

  'csrfCheck',

  'flash',

  'paymentsMethods',

  process.env.NODE_ENV == 'development' && 'markup',
  process.env.NODE_ENV == 'development' && 'dev',

  'users', 'auth', 'ebook', 'donate', 'cache', 'search',
  'staticPage', // must be before courses & other arbitrary url stuff
  'profile', 'jb', 'play', 'screencast', 'about', 'imgur',
  'profileGuest', 'quiz', 'currencyRate', 'payments', 'downloadByLink',
  'newsletter', 'mailer', 'courses'
];

if (process.env.NODE_ENV == 'development') {
  handlers.push('qa');
}

var extraHandlersRoot = path.join(process.cwd(), 'extra/handlers');

if (fs.existsSync(extraHandlersRoot)) {
  fs.readdirSync(extraHandlersRoot).forEach(function(extraHandler) {
    if (extraHandler[0] == '.') return;
    handlers.push(extraHandler);
  });
}

// stick to bottom to detect any not-yet-processed /:slug
handlers.push('tutorial');

// filter existing handlers
handlers = handlers.filter(handler => {
  try {
    require.resolve(handler);
    return true;
  } catch (e) {
    return false;
  }
});

module.exports = handlers;
