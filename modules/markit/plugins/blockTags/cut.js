'use strict';

module.exports = function(md) {

  md.renderer.rules.blocktag_cut = function(tokens, idx, options, env, slf) {
    return '';
  };

};
