var User = require('users').User;

exports.up = function*() {
  // mongoose definition changed, must access through the native driver
  var users = yield User.find();

  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    user.roles = [];
    yield user.persist();
  }

};

exports.down = function*() {
  throw new Error("Not implemented");
};
