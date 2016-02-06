'use strict';

exports.get = function*() {
  this.locals.siteToolbarCurrentSection = "about";

  this.body = this.render('index');
};
