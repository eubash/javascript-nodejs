'use strict';

let config = require('config');
let request = require('request-promise');
let fs = require('mz/fs');
let log = require('log')();
let exec = require('child_process').exec;
let tmpRoot = config.tmpRoot + '/iprotect';
if (!fs.existsSync(tmpRoot)) fs.mkdirSync(tmpRoot);

// protect("/path/to/record.mp4")
function* protect(name, filePath, targetDir) {

  validateName(name);

  let uniqueName = Date.now().toString();

  log.debug("submit for protect", name, uniqueName, filePath);

  let options = {
    json:     true,
    formData: {
      file: {
        value:   fs.createReadStream(filePath),
        options: {
          filename:    uniqueName + '.mp4',
          contentType: 'video/mp4'
        }
      }
    },
    url:      config.iprotect.url.upload
  };

  //console.log(options);

  let response = yield request.post(options);

  log.debug("response", response);
  log.debug("waiting for protect", filePath);

  let date = Date.now();

  let protectedPath = `${tmpRoot}/${uniqueName}.zip`;

  while (Date.now() < date + 120 * 1e3) { // wait 120 secounds

    let req = request(config.iprotect.url.files + '/' + uniqueName + '_protected.zip');
    req.pipe(fs.createWriteStream(protectedPath));

    log.debug(req.path);

    try {
      let res = yield req;

      // wow downloaded!
      yield* del(uniqueName);

      break;

    } catch (e) {

      // if 404 then fine, waiting
      // otherwise, error
      if (e.statusCode != 404) {
        // ouch! strange error!
        log.error("iprotect upload", name, uniqueName, e);
        throw new Error("iprotect upload check failed: " + e.statusCode + '\n' + e.message);
      }
    }

    // check for name.err file, to see if the conversion failed
    let errorDescription;
    try {
      errorDescription = yield request(config.iprotect.url.files + '/' + uniqueName + '.err');
    } catch (e) {
      if (e.statusCode != 404) {
        // ouch! strange error!
        log.error("iprotect upload", name, uniqueName, e);
        throw new Error("iprotect err check failed: " + e.statusCode + '\n' + e.message);
      }
    }
    if (errorDescription) {
      throw new Error(errorDescription);
    }

    // wait 1 sec
    yield new Promise((resolve, reject) => setTimeout(resolve, 1000));


  }

  log.debug("unzipping", protectedPath, filePath);

  yield function(callback) {
    exec(`unzip -nq ${protectedPath} -d ${targetDir}`, function(error, stdout, stderr) {
      log.debug(arguments);
      if (stderr) {
        callback(new Error(stderr));
      } else {
        fs.renameSync(targetDir + '/' + uniqueName + '.app', targetDir + '/' + name + '.app');
        fs.renameSync(targetDir + '/' + uniqueName + '.exe', targetDir + '/' + name + '.exe');
        fs.renameSync(targetDir + '/data/' + uniqueName + '.ipr', targetDir + '/data/' + name + '.ipr');
        callback(null, stdout);
      }
    });
  };

  log.debug("unzipped", protectedPath, filePath);

  yield* del(uniqueName);

  yield fs.unlink(protectedPath); // strange bluebird/cls warning if I yield unlink

  log.debug("done", protectedPath, targetDir);

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
