'use strict';

const CourseGroup = require('../models/courseGroup');
const log = require('log')();
const CourseParticipant = require('../models/courseParticipant');
const config = require('config');
const XmppClient = require('xmppClient');
const VideoKey = require('videoKey').VideoKey;
const User = require('users').User;
const co = require('co');

module.exports = grantKeysAndChatToGroup;

function* grantKeysAndChatToGroup(group) {
  yield CourseGroup.populate(group, 'course');

  var participants = yield CourseParticipant.find({
    group:    group._id,
    isActive: true
  }).populate('user');

  var teacher = yield User.findById(group.teacher);

  yield* grantXmppChatMemberships(group, participants, teacher);

  if (group.course.videoKeyTag) {
    yield *grantVideoKeys(group, participants);
  }
}


function* grantVideoKeys(group, participants) {

  var participantsWithoutKeys = participants.filter(function(participant) {
    return !participant.videoKey;
  });

  // everyone has the key => exit
  if (!participantsWithoutKeys.length) return;

  var otherSameVideoTagGroups = yield CourseGroup.find({
    videoKeyTagCached: group.videoKeyTagCached,
    _id: {
      $ne: group._id
    }
  }, {_id: 1});

  var otherSameVideoTagGroupIds = otherSameVideoTagGroups.map(group => group._id);

  log.debug("Other same course groups", otherSameVideoTagGroupIds);

  for (var i = 0; i < participantsWithoutKeys.length; i++) {
    var participant = participantsWithoutKeys[i];

    // try to find same user participanting in same course before
    var pastParticipantWithKey = yield CourseParticipant.findOne({
      user: participant.user,
      group: {
        $in: otherSameVideoTagGroupIds
      }
    }, {videoKey: 1}).sort({created: -1}).limit(1);


    if (pastParticipantWithKey) {
      participant.videoKey = pastParticipantWithKey.videoKey;
    } else {

      let videoKey = yield VideoKey.findOne({
        tag: group.videoKeyTagCached,
        used: false
      });

      if (!videoKey) {
        throw new Error(`Недостаточно серийных номеров ${group.videoKeyTagCached}`);
      }

      participant.videoKey = videoKey.key;
      videoKey.used = true;
      yield videoKey.persist();
    }

    yield participant.persist();
  }


}




function* grantXmppChatMemberships(group, participants, teacher) {
  log.debug("Grant xmpp chat membership");
  // grant membership in chat
  var client = new XmppClient({
    jid:      config.xmpp.admin.login + '/host',
    password: config.xmpp.admin.password
  });

  yield client.connect();

  var roomJid = yield client.createRoom({
    roomName:    group.webinarId,
    membersOnly: 1
  });

  var jobs = [];
  for (var i = 0; i < participants.length; i++) {
    var participant = participants[i];

    log.debug("grant " + roomJid + " to", participant.user.profileName, participant.firstName, participant.surname);

    jobs.push(client.grantMember(roomJid, participant.user.profileName + '@' + config.xmpp.server,  participant.fullName, 'member'));
  }

  // grant all in parallel
  yield jobs;

  log.debug("adding user");

  yield client.grantMember(roomJid, teacher.profileName + '@' + config.xmpp.server, teacher.displayName, 'owner');

  client.disconnect();
}

// when user updates his details, regrant his groups IF changed profileName
User.schema.pre('save', function(next) {
  var user = this;
  co(function*() {

    var paths = user.modifiedPaths();

    next();

    if (paths.indexOf('profileName') == -1) return;

    // wait 1 sec for db to save all changes,
    // that's for grant calls to populate user correctly
    yield function(callback) {
      setTimeout(callback, 1000);
    };

    var participants = yield CourseParticipant.find({
      user:    user._id
    }).populate('group').exec();

    var groups = participants.map(function(participant) {
      return participant.group;
    });

    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      yield grantKeysAndChatToGroup(group);
    }

  }).catch(function(err) {
    log.error("Grant error", err);
  });

});
