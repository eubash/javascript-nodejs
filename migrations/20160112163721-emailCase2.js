'use strict';

let User = require('users').User;
let Order = require('payments').Order;
let mailer = require('mailer');
let CourseInvite = require('courses').CourseInvite;
let Subscription = require('newsletter').Subscription;
let SubscriptionAction = require('newsletter').SubscriptionAction;

let counter = 0;

function* migrateUsers() {

  let users = yield User.find({
    deleted: false
  }).sort({lastActivity: 1});

  let emailsMap = {};
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let email = user.email.toLowerCase();
    if (!emailsMap[email]) emailsMap[email] = [];
    emailsMap[email].push(user.email);
  }

  for (let email in emailsMap) {
    if (emailsMap[email].length == 1) {
      delete emailsMap[email];
    }
  }

  console.log("TO MIGRATE", emailsMap);
  for (let email in emailsMap) {
    let emailMapItem = emailsMap[email];

    for (var i = 0; i < emailMapItem.length - 1; i++) {
      let em = emailMapItem[i];
      let user = yield User.findOne({email: em});
      console.log("User delete email", em);
      user.email = `migration.${counter++}.deleted.${user.email}`;
      yield user.persist();
    }
  }

}

function* migrateSubscriptions() {

  let subscriptions = yield Subscription.find({}).sort({created: 1});

  let emailsMap = {};
  for (let i = 0; i < subscriptions.length; i++) {
    let subscription = subscriptions[i];
    let email = subscription.email.toLowerCase();
    if (!emailsMap[email]) emailsMap[email] = [];
    emailsMap[email].push(subscription);
  }

  for (let email in emailsMap) {
    if (emailsMap[email].length == 1) {
      delete emailsMap[email];
    }
  }

  for (let email in emailsMap) {
    let emailMapItem = emailsMap[email];

    let lastSubscription = emailMapItem.pop();

    console.log("Migrate subscription into ", lastSubscription);
    for (var i = 0; i < emailMapItem.length; i++) {
      let migrateSubscription = emailMapItem[i];
      for (var j = 0; j < migrateSubscription.newsletters.length; j++) {
        lastSubscription.newsletters.addToSet(migrateSubscription.newsletters[j]);
      }

      migrateSubscription.email = `migration.${counter++}.deleted.${migrateSubscription.email}`;
      yield migrateSubscription.persist();
    }

    console.log("Now ", lastSubscription);
    yield lastSubscription.persist();
  }

}


exports.up = function*() {
  yield* migrateUsers();

  console.log(1);
  let invites = yield CourseInvite.find({});
  for (let i = 0; i < invites.length; i++) {
    let invite = invites[i];
    invite.email = invite.email.toLowerCase();
    yield invite.persist();
  }

  console.log(2);


  let subscriptionActions = yield SubscriptionAction.find({});
  for (let i = 0; i < subscriptionActions.length; i++) {
    let subscriptionAction = subscriptionActions[i];
    subscriptionAction.email = subscriptionAction.email.toLowerCase();
    yield subscriptionAction.persist();
  }

  console.log(3);

  yield* migrateSubscriptions();

  let subscriptions = yield Subscription.find({});
  for (let i = 0; i < subscriptions.length; i++) {
    let subscription = subscriptions[i];
    subscription.email = subscription.email.toLowerCase();
    yield subscription.persist();
  }

  console.log(4);

  let users = yield User.find({deleted: false});
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    console.log("User email to lower", user.email);
    user.email = user.email.toLowerCase();
    yield user.persist();
  }

  console.log(5);


  let orders = yield Order.find({});
  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];
    if (order.email) {
      order.email = order.email.toLowerCase();
      yield order.persist();
    }
    if (!order.data) continue;
    if (!order.data.emails) continue;
    if (!order.data.emails.length) continue;
    order.data.emails = order.data.emails.map(email => email.toLowerCase());

    yield order.persist();
  }

  console.log(6);
};

exports.down = function*() {
  throw new Error("Rollback not implemented");
};
