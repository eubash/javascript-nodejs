'use strict';

module.exports = function(md) {

  md.renderer.rules.code_inline = function (tokens, idx, options, env, slf) {
    return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
  };

};
