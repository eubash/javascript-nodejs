'use strict';

let config = require('config');
let request = require('request-promise');
let fs = require('fs');
let log = require('log')();
let exec = require('child_process').exec;
let tmpRoot = config.tmpRoot + '/iprotect';
if (!fs.existsSync(tmpRoot)) fs.mkdirSync(tmpRoot);

// protect("/path/to/record.mp4")
function* protect(name, filePath, targetDir) {

  validateName(name);

  yield* del(name);

  log.debug("submit for protect", name, filePath);

  let options = {
    json:     true,
    formData: {
      file: {
        value:   fs.createReadStream(filePath),
        options: {
          filename:    name + '.mp4',
          contentType: 'video/mp4'
        }
      }
    },
    url:      config.iprotect.url.upload
  };

  let response = yield request.post(options);

  log.debug("response", response);
  log.debug("waiting for protect", filePath);

  let date = Date.now();

  let protectedPath = `${tmpRoot}/${name}.zip`;

  while (Date.now() < date + 120 * 1e3) { // wait 120 secounds

    let req = request(config.iprotect.url.files + '/' + name + '_protected.zip');
    req.pipe(fs.createWriteStream(protectedPath));

    log.debug(req.path);

    try {
      let res = yield req;

      // wow downloaded!
      yield* del(name);

      break;

    } catch (e) {

      // if 404 then fine, waiting
      // otherwise, error
      if (e.statusCode != 404) {
        // ouch! strange error!
        log.error("iprotect upload", name, e);
        throw new Error("iprotect upload check failed: " + e.statusCode + '\n' + e.message);
      }
    }

    // check for name.err file, to see if the conversion failed
    let errorDescription;
    try {
      errorDescription = yield request(config.iprotect.url.files + '/' + name + '.err');
    } catch (e) {
      if (e.statusCode != 404) {
        // ouch! strange error!
        log.error("iprotect upload", name, e);
        throw new Error("iprotect err check failed: " + e.statusCode + '\n' + e.message);
      }
    }
    if (errorDescription) {
      throw new Error(errorDescription);
    }

    // wait 1 sec
    yield new Promise((resolve, reject) => setTimeout(resolve, 1000));


  }

  yield function(callback) {
    exec(`unzip -nq ${protectedPath} -d ${targetDir}`, function(error, stdout, stderr) {
      log.debug(arguments);
      if (stderr) {
        callback(new Error(stderr));
      } else {
        callback(null, stdout);
      }
    });
  };

  yield* del(name);

  fs.unlinkSync(protectedPath); // strange bluebird/cls warning if I yield unlink

}

function* del(name) {

  log.debug("iprotect del", name);
  validateName(name);

  let response = yield request.post({
    json:     true,
    url:      config.iprotect.url.delete,
    formData: {
      file: name + '.mp4'
    }
  });

  log.debug("response", response);

}

function validateName(name) {
  if (name.includes('..') || name.includes('/')) {
    throw new Error("Bad name " + name);
  }
}

exports.del = del;

exports.protect = protect;
