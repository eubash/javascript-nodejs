'use strict';

const countries = require('countries');
const CourseFeedback = require('../models/courseFeedback');
const CourseParticipant = require('../models/courseParticipant');
const _ = require('lodash');
const BasicParser = require('markit').BasicParser;

exports.patch = function*() {

  var courseFeedback = yield CourseFeedback.findOne({
    number: this.request.body.number
  }).populate('group');

  if (!courseFeedback) {
    this.throw(404);
  }

  if (!this.isAdmin && String(this.user._id) != String(courseFeedback.group.teacher)) {
    this.throw(403);
  }

  courseFeedback.teacherComment = this.request.body.teacherComment;
  yield courseFeedback.persist();

  this.body = {
    teacherComment: new BasicParser().render(courseFeedback.teacherComment)
  };

};

