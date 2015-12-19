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
const Order = require('payments').Order;

exports.get = function*() {
  this.locals.siteToolbarCurrentSection = "webpack-screencast";

  let subscription = null;
  if (this.user) {
    subscription = this.locals.subscription = yield Subscription.findOne({
      email: this.user.email
    });
  }

  let donateOrders = yield Order.find({
    module: 'donate',
    status: Order.STATUS_SUCCESS,
    'data.name': {$exists: true}
  }).sort({usdAmount: -1});

  this.locals.donations = donateOrders.map(order => {
    return {
      url: order.data.url,
      name: order.data.name,
      amount: order.amount,
      currency: order.currency
    };
  });

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

  this.body = this.render('index');
};
