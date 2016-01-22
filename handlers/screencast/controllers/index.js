'use strict';

var sendMail = require('mailer').send;
var path = require('path');
var config = require('config');

var CourseGroup = require('courses').CourseGroup;
var Course = require('courses').Course;
var money = require('money');
var moment = require('momentWithLocale');
const Subscription = require('newsletter').Subscription;
const Newsletter = require('newsletter').Newsletter;
const fs = require('mz/fs');

exports.get = function*() {
  this.locals.siteToolbarCurrentSection = "screencast";

  let slug = this.params.slug;
  this.locals.slug = slug;

  if (slug.includes('/') || slug.includes('.')) {
    this.throw(404);
  }

  let hasTemplate = yield fs.exists(path.join(this.templateDir, slug + '.jade'));

  if (!hasTemplate) {
    this.throw(404);
  }

  let subscription = null;
  if (this.user) {
    subscription = this.locals.subscription = yield Subscription.findOne({
      email: this.user.email
    });
  }

  var newsletters = yield Newsletter.find({}).sort({weight: 1}).exec();

  this.locals.newsletters = newsletters.map(function(newsletter) {
    return {
      slug:       newsletter.slug,
      title:      newsletter.title,
      period:     newsletter.period,
      // mongoose array can #indexOf ObjectIds
      subscribed: subscription && ~subscription.newsletters.indexOf(newsletter._id)
    };
  });

  this.body = this.render(slug);
};
