var fs = require('fs');
var co = require('co');
var path = require('path');
var gutil = require('gulp-util');
var dataUtil = require('lib/dataUtil');
var mongoose = require('lib/mongoose');
var yargs = require('yargs');

var CourseGroup = require('courses').CourseGroup;
var Course = require('courses').Course;
var User = require('users').User;
var CourseFeedback = require('courses').CourseFeedback;

exports.up = function*() {

  var groups = yield CourseGroup.find().populate('course');
  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];
    group.videoKeyTagCached = group.course.videoKeyTag;
    yield group.persist();
  }

};

exports.down = function*() {
  throw new Error("Rollback not implemented");
};
