'use strict';

/**
 * Client/server plugin
 */

const markdownItContainer = require('markdown-it-container');
const parseAttrs = require('../utils/parseAttrs');
const t = require('i18n');

var LANG = LANG || require('config').lang;

t.requirePhrase('markit.outlined', require('../locales/outlined/' + LANG + '.yml'));

module.exports = function(md) {

  ['warn', 'smart', 'ponder'].forEach(name => {
    md.use(markdownItContainer, name, {
      marker: '`',
      render(tokens, idx) {

        if (tokens[idx].nesting === 1) {
          let attrs = parseAttrs(tokens[idx].info, true);
          let header = attrs.header;
          return `<div class="important important_${name}">
            <div class="important__header"><span class="important__type">${md.utils.escapeHtml(header || t(`markit.outlined.${name}`))}</span></div>
            <div class="important__content">`;

        } else {
          // closing tag
          return '</div></div>\n';
        }
      }
    });
  });

};
