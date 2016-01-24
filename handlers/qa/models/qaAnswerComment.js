const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');
const mongooseTimestamp = require('lib/mongooseTimestamp');

const schema = new Schema({
  content:    {
    type:     String,
    required: true,
    trim:     true
  },
  user:       {
    type: Schema.ObjectId,
    ref:  'User',
    required: true
  },
  answer:       {
    type: Schema.ObjectId,
    ref:  'QaAnswer',
    required: true
  },
  created:    {
    type:     Date,
    required: true,
    default:  Date.now
  }
});

schema.plugin(mongooseTimestamp);


module.exports = mongoose.model('QaAnswerComment', schema);
