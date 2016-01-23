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
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

schema.plugin(mongooseTimestamp);


module.exports = mongoose.model('QaTag', schema);
