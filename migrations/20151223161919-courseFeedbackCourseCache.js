'use strict';

var CourseFeedback = require('courses').CourseFeedback;

exports.up = function*() {
  let feedbacks = yield CourseFeedback.find({}).populate('group');
  for (let i = 0; i < feedbacks.length; i++) {
    let feedback = feedbacks[i];
    yield feedback.persist();
  }

};

exports.down = function*() {
  throw new Error("Rollback not implemented");
};
