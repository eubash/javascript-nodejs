const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const assert = require('assert');
const mongooseTimestamp = require('lib/mongooseTimestamp');

const schema = new Schema({
  user:     {
    type:     Schema.ObjectId,
    ref:      'User',
    required: true,
    index:    true
  },
  answer: {
    type:     Schema.ObjectId,
    ref:      'QaAnswer',
    required: true,
    index:    true
  },
  value:    {
    type:     Number,
    required: true
  }
});

schema.plugin(mongooseTimestamp);

schema.index({user: 1, answer: 1}, {unique: true});

module.exports = mongoose.model('QaAnswerVote', schema);
