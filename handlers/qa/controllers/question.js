
exports.get = function*() {

  this.locals.question = {
    title: "QUESTION TITLE"
  };

  this.body = this.render('question');
};
