'use strict';

let tokenUtils = require('../../utils/token');

const t = require('i18n');

const LANG = require('config').lang;

t.requirePhrase('markit.demo', require('../../locales/demo/' + LANG + '.yml'));

module.exports = function(md) {

  md.renderer.rules.blocktag_demo = function(tokens, idx, options, env, slf) {

    let src = tokenUtils.attrGet(tokens[idx], 'src');

    if (src) {
      let href = src[0] == '/' ? src : options.staticHost + options.resourceRoot + '/' + src;
      href += '/';

      return `<a href="${href}" target="blank'>${t('markit.demo.window')}</a>`;
    }


    return `<button onclick="runDemo(this)">${t('markit.demo.run')}</button>`;

  };

};
