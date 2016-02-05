'use strict';

var bytes = require('bytes');
var Course = require('../models/course');
var sendMail = require('mailer').send;
var path = require('path');
var CourseGroup = require('../models/courseGroup');
var CourseParticipant = require('../models/courseParticipant');
var _ = require('lodash');
var multiparty = require('multiparty');
var config = require('config');
var fs = require('mz/fs');
var fse = require('fs-extra');
var transliterate = require('textUtil/transliterate');
var exec = require('child_process').exec;
var glob = require('glob');
var iprotect = require('iprotect');
var moment = require('momentWithLocale');

// Group info for a participant, with user instructions on how to login
exports.get = function*() {

  var group = this.locals.group = this.groupBySlug;

  if (!group.materials) {
    this.throw(404);
  }

  this.locals.title = "Материалы для обучения\n" + group.title;

  this.locals.participant = this.participant;

  this.locals.teacher = this.teacher;

  var materials = this.locals.materials = [];
  for (var i = 0; i < group.materials.length; i++) {
    var material = group.materials[i];
    materials.push({
      title:   material.title,
      created: material.created,
      filename: material.filename,
      comment: material.comment || '',
      url:     group.getMaterialUrl(material),
      size:    bytes(yield* group.getMaterialFileSize(material))
    });
  }

  let logs;
  try {
    logs = yield fs.readdir(config.jabberLogsRoot + '/' + group.webinarId);
  } catch (e) { // no logs
    logs = [];
  }

  logs = logs.sort().map(file => ({
    title: file,
    link:  `/courses/groups/${group.slug}/logs/${file.replace(/\.html$/, '')}`
  }));

  this.locals.chatLogs = logs;


  this.body = this.render('groupMaterials');
};

exports.del = function*() {

  let group = this.groupBySlug;
  let found = false;

  for (let i = 0; i < group.materials.length; i++) {
    console.log(group.materials[i].filename, this.request.body.filename);
    if (group.materials[i].filename == this.request.body.filename) {
      found = true;
      group.materials.splice(i--, 1);
      break;
    }
  }

  if (!found) {
    this.throw(404, 'No such file');
  }

  yield group.persist();
  this.body = 'ok';

};

exports.post = function*() {

  this.res.setTimeout(3600 * 1e3, () => { // default timeout is too small
    this.res.end("Timeout");
  });
  var group = this.groupBySlug;

  let files = [];
  yield new Promise((resolve, reject) => {

    var form = new multiparty.Form({
      autoFields:   true,
      autoFiles:    true,
      maxFilesSize: 512 * 1024 * 1024 // 512MB max file size
    });

    // multipart file must be the last
    form.on('file', (name, file) => {
      if (!file.originalFilename) return; // empty file field
      // name is "materials" always
      files.push(file);
    });

    form.on('error', reject);

    form.on('field', (name, value) => {
      this.request.body[name] = value;
    });

    form.on('close', resolve);

    form.parse(this.req);
  });

  /*
   file example: (@see multiparty)
   { fieldName: 'materials',
   originalFilename: '10_types_intro_protected.zip',
   path: '/var/folders/41/nsmzxxxn0fx7c656wngnq_wh0000gn/T/3o-PzBrAMsX5W35KZ5JH0HKw.zip',
   headers:
   { 'content-disposition': 'form-data; name="materials"; filename="10_types_intro_protected.zip"',
   'content-type': 'application/zip' },
   size: 14746520 }
   */


  // now process files

  let materialsFileBasenameStem = this.request.body.filename ?
    transliterate(this.request.body.filename).replace(/[^-_\w\d]/gim, '') :
    moment().format('YYYY_MM_DD_HHmm');

  let materialsFileBasename = materialsFileBasenameStem + '.zip';

  let processedMaterialsZip;
  try {
    processedMaterialsZip = yield* processFiles.call(this, materialsFileBasenameStem, files);
  } catch (e) {
    this.log.debug(e);
    // error, so delete all tmp files
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      yield fs.unlink(file.path);
    }
    this.addFlashMessage('error', e.message);
    this.redirect(this.originalUrl);
    return;
  }


  // store uploaded files in archive under the title chosen by uploader
  let archiveDir = config.archiveRoot + '/groupMaterials/' + Date.now() + '/' + materialsFileBasenameStem;
  yield function(callback) {
    fse.ensureDir(archiveDir, callback);
  };

  // use original names
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let originalFilename = transliterate(file.originalFilename).replace(/[^\d\w_.-]/gim, '');
    yield* move(file.path, path.join(archiveDir, originalFilename));
    this.log.debug("Moved to archive", file.path, '->', path.join(archiveDir, originalFilename));
  }

  // move zipped materials to download dir
  let filePath = `${config.downloadRoot}/courses/${group.slug}/${materialsFileBasename}`;

  yield function(callback) {
    fse.ensureDir(path.dirname(filePath), callback);
  };

  yield* move(processedMaterialsZip, filePath);

  this.log.debug("Moved zipped result to", filePath);

  // update the database
  var participants = yield CourseParticipant.find({
    isActive:              true,
    shouldNotifyMaterials: true,
    group:                 group._id
  }).populate('user');

  // remove old material with the same name (Adding the same file replaces it)
  for (let i = 0; i < group.materials.length; i++) {
    if (group.materials[i].filename == materialsFileBasename) {
      group.materials.splice(i--, 1);
    }
  }

  var material = {
    title:    materialsFileBasenameStem,
    filename: materialsFileBasename,
    comment:  this.request.body.comment
  };

  group.materials.unshift(material);

  yield group.persist();

  if (this.request.body.notify) {
    var recipients = participants
      .map(function(participant) {
        return {email: participant.user.email, name: participant.fullName};
      });

    yield sendMail({
      templatePath: path.join(__dirname, '../templates/email/materials'),
      subject:      "Добавлены материалы курса",
      to:           recipients, // recipients
      comment:      material.comment,
      link:         config.server.siteHost + `/courses/groups/${group.slug}/materials`,
      fileLink:     config.server.siteHost + `/courses/download/${group.slug}/${material.filename}`,
      fileTitle:    material.title
    });

    this.addFlashMessage('success', 'Материал добавлен, уведомления разосланы.');
  } else {
    this.addFlashMessage('success', 'Материал добавлен, уведомления НЕ рассылались.');
  }
  this.redirect(this.originalUrl);
};

function* clean() {

  let entries = [];
  yield function(callback) {
    let g = new glob.Glob(config.tmpRoot + '/groupMaterials/*', {stat: true}, callback);
    g.on('stat', function(dir, stat) {
      // get entries modified more than 1 day ago
      if (stat.mtime < Date.now() - 86400 * 1e3) entries.push(dir);
    });
  };

  this.log.debug("clean", entries);
  for (let i = 0; i < entries.length; i++) {
    yield function(callback) {
      fse.remove(entries[i], callback);
    };
  }
}

function* processFiles(name, files) {

  yield* clean.call(this);

  let workingDir = config.tmpRoot + '/groupMaterials/' + Date.now() + '/' + name;
  yield function(cb) {
    fse.ensureDir(workingDir, cb);
  };

  let jobs = [];

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    let originalFilename = transliterate(file.originalFilename).replace(/[^\d\w_.-]/gim, '');

    if (originalFilename.match(/\.zip$/)) {
      // extract directly to workingdir
      //let extractDir = path.join(workingDir, originalFilename.replace(/\.zip$/, ''));
      //yield fs.mkdir(extractDir);
      jobs.push((callback) => {
        exec(`unzip -nq ${file.path} -d ${workingDir}`, (error, stdout, stderr) => {
          if (stderr) {
            callback(new Error(stderr));
          } else {
            this.log.debug(stdout);
            callback(null, stdout);
          }
        });
      });
    } else if (originalFilename.match(/\.mp4$/)) {
      jobs.push(iprotect.protect(originalFilename.replace(/\.mp4$/, ''), file.path, workingDir));
    } else {
      let filePath = path.join(workingDir, originalFilename);
      jobs.push(function(callback) {
        fse.copy(file.path, filePath, callback);
      });
    }

  }

  yield jobs;

  yield function(callback) {
    exec(`chmod -R 777 ${workingDir}`, callback);
  };

  yield function(callback) {
    exec(`zip -r ${name} ${name}`, {cwd: path.dirname(workingDir)}, callback);
  };

  yield function(callback) {
    fse.remove(workingDir, callback);
  };

  return workingDir + '.zip';

}


// fs.rename does not work across devices/mount points
function* move(src, dst) {
  yield function(callback) {
    fse.copy(src, dst, callback);
  };
  yield fs.unlink(src);
}
