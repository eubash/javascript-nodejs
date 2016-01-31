'use strict';

const config = require('config');
const iprotect = require('..');
const should = require('should');
const fs = require('fs');

describe('iprotect', function() {
  if (!config.iprotect) return;

  describe('when invalid file', function() {
    it('fails', function*() {

      let result;
      try {
        result = yield* iprotect.protect('file' + Math.random() * 1e8 ^ 0, __filename);
      } catch (e) {
        return;
      }

      should(result).not.exist;

    });
  });

  describe('when no file', function() {

    it('fails', function*() {

      let result;
      try {
        result = yield* iprotect.protect('no-such-file', '/tmp/no/such/file');
      } catch (e) {
        console.log(e);
        return;
      }

      should(result).not.exist;
    });
  });


  describe('when valid video', function() {

    it.only('succeeds', function*() {

      let protectedPath = yield* iprotect.protect('test', __dirname + '/fixture/mp4.mp4');

      fs.existsSync(protectedPath).should.be.true;

      fs.unlinkSync(protectedPath);
    });

  });
});
