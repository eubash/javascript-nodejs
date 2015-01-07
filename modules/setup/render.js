'use strict';

const moment = require('moment');
const util = require('util');
const path = require('path');
const config = require('config');
const fs = require('fs');
const log = require('log')();
const jade = require('jade');
const _ = require('lodash');
const assert = require('assert');

require('lib/requireJade');

// public.versions.json is regenerated and THEN node is restarted on redeploy
// so it loads a new version.
var publicVersions;

function getPublicVersion(publicPath) {
  if (!publicVersions) {
    // don't include at module top, let the generating task to finish
    publicVersions = require(path.join(config.projectRoot, 'public.versions.json'));
  }
  var busterPath = publicPath.slice(1);
  return publicVersions[busterPath];
}

function addStandardHelpers(locals, ctx) {
  // same locals may be rendered many times, let's not add helpers twice
  if (locals._hasStandardHelpers) return;

  locals.moment = moment;

  locals.url = ctx.protocol + '://' + ctx.host + ctx.originalUrl;
  locals.context = ctx;

  locals.counterEnabled = (ctx.host == 'nightly.javascript.ru');

  // we don't use defer in sessions, so can assign it
  // (simpler, need to call yield this.session)
  // (anon users may stop on varnish anyway)
  locals.session = ctx.session;

  Object.defineProperty(locals, "user", {
    get: function() {
      return ctx.req.user;
    }
  });

  // this.locals.debug causes jade to dump function
  /* jshint -W087 */
  locals.deb = function() {
    debugger;
  };

  locals.bem = require('bem-jade')();

  locals.thumb = function(url, width, height) {
    // return 2 times larger image for retina
    var modifier = (width < 320 && height < 320) ? 't' :
      (width < 640 && height < 640) ? 'm' :
        (width < 1280 && height < 1280) ? 'l' : '';

    return url.slice(0, url.lastIndexOf('.')) + modifier + url.slice(url.lastIndexOf('.'))
  };

  locals.asset = function(publicPath) {
    if (publicPath[0] != '/') {
      throw new Error("asset needs an /absolute/path");
    }
    var version = getPublicVersion(publicPath);
    if (!version) {
      version = Math.random().toString().slice(2);
      log.error("No version for " + publicPath);
    }
    return config.server.staticHost + publicPath.replace('.', '.v' + version + '.');
  };


  locals.script = function(name) {
    var versions = JSON.parse(
      fs.readFileSync(path.join(config.manifestRoot, 'js.versions.json'), {encoding: 'utf-8'})
    );
    var versionName = versions[name];

    return versionName;
  };

  locals.style = function(name) {
    var versions = JSON.parse(
      fs.readFileSync(path.join(config.manifestRoot, 'styles.versions.json'), {encoding: 'utf-8'})
    );
    var versionName = versions[name];

    return versionName;
  };

  locals._hasStandardHelpers = true;
}


// (!) this.render does not assign this.body to the result
// that's because render can be used for different purposes, e.g to send emails
module.exports = function render(app) {
  app.use(function *(next) {
    var ctx = this;

    this.locals = _.assign({}, config.jade);

    // render('article', {})  -- 2 args
    // render('article')
    this.render = function(templatePath, locals) {

      // add helpers at render time, not when middleware is used time
      // probably we will have more stuff initialized here
      addStandardHelpers(this.locals, this);

      this.log.debug("Lookup " + templatePath + " in " + this.templatePath);

      // warning!
      // _.assign does NOT copy defineProperty
      // so I use this.locals as a root and merge all props in it, instead of cloning this.locals
      var loc = Object.create(this.locals);

      _.assign(loc, locals);

      templatePath += '.jade';
      var templatePathResolved = path.join(templatePath[0] == '/' ? loc.basedir : this.templatePath, templatePath);

      this.log.debug("render file " + templatePathResolved);
      return jade.renderFile(templatePathResolved, loc);
    };


    yield next;
  });

};
