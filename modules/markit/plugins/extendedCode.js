'use strict';

/**
 * Adds `key:Ctrl+B` support to code_inline
 * @param md
 */

module.exports = function(md) {

  md.renderer.rules.code_inline = function(tokens, idx, options, env, slf) {

    let token = tokens[idx];
    let content = token.content.trim();

    if (content.indexOf('key:') == 0) {
      return renderKey(content);
    }

    return '<code>' + md.utils.escapeHtml(content) + '</code>';
  };

  function renderKey(keys) {

    var results = [];

    if (keys === '+') {
      return `<kbd class="shortcut">+</kbd>`;
    }

    var plusLabel = Math.random();
    keys = keys.replace(/\+\+/g, '+' + plusLabel);
    keys = keys.split('+');

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      results.push((key == plusLabel) ? '+' : key);
      if (i < keys.length - 1) {
        results.push('<span class="shortcut__plus">+</span>');
      }
    }

    return `<kbd class="shortcut">${results.join('')}</kbd>`;
  }

};
