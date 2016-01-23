const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');
const mongooseTimestamp = require('lib/mongooseTimestamp');

const schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  // how to count views?
  // we need no google/yandex/etc bots
  viewsCount: {
    type: Number,
    required: true
  },
  slug: {
    type:     String,
    required: true,
    index:    true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  tags: [{
    type: Schema.ObjectId,
    ref: 'QaTag'
  }]
});

schema.plugin(mongooseTimestamp);


module.exports = mongoose.model('QaQuestion', schema);
