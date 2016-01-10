'use strict';

let User = require('users').User;
let mailer = require('mailer');

exports.up = function*() {
  let users = yield User.find({
    deleted: false
  });

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

  emailsMap = {
    'iliakan@gmail.com': ['iliakan@gmail.com', 'mk@javascript.ru']
  };

  for (let email in emailsMap) {
    let emailMapItem = emailsMap[email];

    yield* mailer.send({
      from:         'ikantor',
      templatePath: __dirname + '/emailCase',
      email1:       emailMapItem[0],
      email2:       emailMapItem[1],
      to:           [{email: emailMapItem[0]}, {email: emailMapItem[1]}],
      subject:      'Удалите дубликат email-аккаунта на сайте',
      label:        'dupe-email'
    });
  }

  console.log(emailsMap);


  process.exit(1);
};

exports.down = function*() {
  throw new Error("Rollback not implemented");
};
