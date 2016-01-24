const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseTimestamp = require('lib/mongooseTimestamp');

const schema = new Schema({
  user:     {
    type:     Schema.ObjectId,
    ref:      'User',
    required: true,
    index:    true
  },
  question: {
    type:     Schema.ObjectId,
    ref:      'QaQuestion',
    required: true,
    index:    true
  },
  value:    {
    type:     Number,
    required: true
  }
});

schema.plugin(mongooseTimestamp);

schema.index({user: 1, question: 1}, {unique: true});

module.exports = mongoose.model('QaQuestionVote', schema);
