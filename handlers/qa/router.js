var Router = require('koa-router');

var index = require('./controllers/index');
var question = require('./controllers/question');

var router = module.exports = new Router();

router.get("/", index.get);
router.get('/question', question.get);

router.get('/questions/:questionId', function*() {});
