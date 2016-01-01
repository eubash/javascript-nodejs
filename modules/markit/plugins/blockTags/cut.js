'use strict';

module.exports = function(md) {

  md.renderer.rules.code_cut = function(tokens, idx, options, env, slf) {
    return '';
  };

};
