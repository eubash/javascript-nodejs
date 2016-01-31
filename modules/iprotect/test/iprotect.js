'use strict';

const config = require('config');
const iprotect = require('..');
const should = require('should');
const fse = require('fs-extra');
const fs = require('fs');

describe('iprotect', function() {
  if (!config.iprotect) return;

  describe('when invalid file', function() {
    it('fails', function*() {

      let err;
      try {
        yield* iprotect.protect('file' + Math.random() * 1e8 ^ 0, __filename, '/tmp');
      } catch (e) {
        err = e;
      }

      err.should.exist;
    });
  });

  describe('when no file', function() {

    it('fails', function*() {

      let err;
      try {
        yield* iprotect.protect('no-such-file', 'no-such-file', '/tmp/no/such/file');
      } catch (e) {
        err = e;
        return;
      }

      err.should.exist;
    });
  });


  describe('when valid video', function() {

    it('succeeds', function*() {

      let targetDir = config.tmpRoot + '/test';
      yield* iprotect.protect('result', __dirname + '/fixture/mp4.mp4', targetDir);

      fs.existsSync(targetDir + '/result').should.be.true;

      fse.removeSync(targetDir);
    });

  });
});
