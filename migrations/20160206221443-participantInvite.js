'use strict';

var CourseParticipant = require('courses').CourseParticipant;
var CourseInvite = require('courses').CourseInvite;

exports.up = function*() {
  let participants = yield CourseParticipant.find();

  for (var i = 0; i < participants.length; i++) {
    let participant = participants[i];
    if (!participant.invite) continue;

    let invite = yield CourseInvite.findById(participant.invite);
    invite.participant = participant;
    //participant.invite = undefined;
    yield invite.persist();
    yield participant.persist();
    console.log(invite);

  }
};

exports.down = function*() {
  //throw new Error("Rollback not implemented");
};
