'use strict';

var CourseParticipant = require('courses').CourseParticipant;

exports.up = function*() {
  let participants = yield CourseParticipant.find({}).populate('group');
  for (let i = 0; i < participants.length; i++) {
    let participant = participants[i];
    participant.courseCache = participant.group.course;
    yield participant.persist();
  }

};

exports.down = function*() {
  throw new Error("Rollback not implemented");
};
