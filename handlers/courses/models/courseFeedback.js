var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var countries = require('countries');
var CourseGroup = require('./courseGroup');

var schema = new Schema({

  group: {
    type: Schema.Types.ObjectId,
    ref:  'CourseGroup',
    required: true,
    index: true
  },

  courseCache: {
    type: Schema.Types.ObjectId,
    ref:  'Course',
//    required: true, autoassigned by hook
    index: true
  },

  stars: {
    type: Number,
    required: "Не стоит оценка.",
    min: 1,
    max: 5
  },

  content: {
    type: String,
    required: "Отсутствует текст отзыва."
  },

  teacherComment: {
    type: String
  },

  participant: {
    type: Schema.Types.ObjectId,
    ref:  'CourseParticipant',
    required: true,
    index: true
  },

  teacherCache: {
    type: Schema.Types.ObjectId,
    ref:  'User',
    required: true,
    index: true
  },

  userCache: {
    type: Schema.Types.ObjectId,
    ref:  'User',
    required: true,
    index: true
  },

  // todo (not used now)
  // for selected reviews, to show at the courses main, cut them at this point
  // todo: add an intelligent cutting function like jQuery dotdotdot, but w/o jquery
  cutAtLength: {
    type: Number
  },

  // copy from avatar if exists
  photo: {
    type: String
  },

  country: {
    type: String,
    enum: Object.keys(countries.all),
    required: "Страна не указана."
  },

  city: {
    type: String
  },

  isPublic: {
    type: Boolean,
    required: true
  },

  recommend: {
    type: Boolean,
    required: true
  },

  aboutLink: {
    type: String
  },

  occupation: {
    type: String
  },

  created: {
    type:    Date,
    default: Date.now
  }
});



schema.pre('save', function(next) {
  var self = this;

  if (this.group.course) {
    if (this.group.course._id) {
      this.courseCache = this.group.course._id;
    } else {
      this.courseCache = this.group.course;
    }
    next();
  } else {
    CourseGroup.findOne({_id: this.group}, function(err, group) {
      if (err) return next(err);
      self.courseCache = group.course;
      next();
    });
  }
});

schema.plugin(autoIncrement.plugin, {model: 'CourseFeedback', field: 'number', startAt: 1});

module.exports = mongoose.model('CourseFeedback', schema);

