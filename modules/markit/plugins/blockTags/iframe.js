'use strict';

/**
 * Client/server plugin
 */

const t = require('i18n');

var LANG = LANG || require('config').lang;

t.requirePhrase('markit.iframe', require('../../locales/iframe/' + LANG + '.yml'));
t.requirePhrase('markit.error', require('../../locales/error/' + LANG + '.yml'));

module.exports = function(md) {

  md.renderer.rules.blocktag_iframe = function(tokens, idx, options, env, slf) {

    let token = tokens[idx];

    let trusted = options.html && !token.attrs.untrusted ? 1 : 0;

    let height = +token.attrs.height || 300;

    if (!options.html) {
      height = Math.min(height, 800);
    }

    //locals.attrs.style = 'height: ' + height + 'px';

    let src = token.attrs.src;

    if (!src) {
      return `<div class="markdown-error">${t('markit.error.attr_required', {attr: 'src'})}</div>`;
    }

    // relative url w/o domain means we want static host
    //    [iframe src="dir"]
    // otherwise we want a dynamic service e.g
    //    [iframe src="/ajax/service"]
    if (src[0] != '/' && !~src.indexOf('://')) {
      if (!~src.indexOf('.')) src += '/';
      // samedomain means we keep iframe on current domain
      // for using js between it and the main window (see travel/ in tutorial)
      src = (options.html && token.attrs.samedomain ? '' : options.staticHost) + options.resourceWebRoot + '/' + src;
    }

    let edit, zip;
    if (token.attrs.plunkId) {
      edit = {
        href:    'http://plnkr.co/edit/' + token.attrs.plunkId + '?p=preview',
        plunkId: token.attrs.plunkId,
        target:  '_blank'
      };

      if (token.attrs.zip) {
        let zipname = src.split('/').filter(Boolean).reverse()[0];
        zip = {
          href: '/tutorial/zipview/' + zipname + '.zip?plunkId=' + token.attrs.plunkId
        };
      }

    }

    let link;
    if (token.attrs.link) {
      link = {
        href: src
      };
    }

    let toolbarHtml = '';
    if (link) {
      toolbarHtml += `<div class="toolbar__tool">
      <a href="${link.href}" target="_blank" title="${t('open.window')}" class="toolbar__button_external"></a>
    </div>
    `;
    }

    if (edit) {
      toolbarHtml += `<div class="toolbar__tool">
      <a href="${edit.href}" target="_blank" title="${t('open.sandbox')}"
      data-plunk-id="${edit.plunkId}" class="toolbar__button_edit"></a>
    </div>
    `;
    }

    if (zip) {
      toolbarHtml += `<div class="toolbar__tool">
      <a href="${zip.href}" target="_blank" title="${t('open.zip')}" class="toolbar__button_zip"></a>
    </div>
    `;
    }

    return `<div class="code-result">
    <div class="code-result__toolbar toolbar">${toolbarHtml}</div>
    <iframe class="code-result__iframe" data-trusted="${trusted}" style="height:${height}px" src="${src}"></iframe>
  </div>`;

  };
};
