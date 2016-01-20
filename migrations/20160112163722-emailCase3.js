'use strict';

let User = require('users').User;
let Order = require('payments').Order;
let mailer = require('mailer');
let CourseInvite = require('courses').CourseInvite;
let Subscription = require('newsletter').Subscription;
let SubscriptionAction = require('newsletter').SubscriptionAction;

let counter = 0;

exports.up = function*() {

  let orders = yield Order.find({});
  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];
    if (order.email && order.email != order.email.toLowerCase()) {
      console.log("EMAIL TO LOWER", order);
      order.email = order.email.toLowerCase();
      yield order.persist();
    }
    if (!order.data) continue;
    if (!order.data.emails) continue;
    if (!order.data.emails.length) continue;

    let hasLC = false;
    order.data.emails = order.data.emails.map(email => {
      if (email != email.toLowerCase()) hasLC = true;
      return email.toLowerCase();
    });

    order.markModified('data');
    if (hasLC) {
      console.log("DATA EMAIL TO LOWER", order);
      yield order.persist();
    }
  }

};

exports.down = function*() {
  throw new Error("Rollback not implemented");
};
