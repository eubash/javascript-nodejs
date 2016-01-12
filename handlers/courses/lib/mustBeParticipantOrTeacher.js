const _ = require('lodash');
const CourseParticipant = require('../models/courseParticipant');

module.exports = function*(next) {

  var group = this.groupBySlug;

  if (!this.user) {
    this.throw(401);
  }

  if (this.user._id.equals(this.groupBySlug.teacher._id)) {
    this.teacher = this.user;
    yield* next;
    return;
  }

  var participant = yield CourseParticipant.findOne({
    isActive: true,
    group: group._id,
    user: this.user._id
  });

  if (!participant) {
    this.throw(403, "Вы не участвуете в этой группе.");
  }

  this.participant = participant;

  yield* next;
};
