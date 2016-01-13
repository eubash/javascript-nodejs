
var Subscription = require('newsletter').Subscription;

exports.up = function*() {

  yield function(callback) {
    Subscription.collection.remove({confirmed: false}, callback);
  };

  yield function(callback) {
    Subscription.collection.update(
        {},
        { $unset: { confirmed: 1 } },
        {multi: true},
        callback);
  };

};

exports.down = function*() {
  throw new Error("Rollback not implemented");
};
