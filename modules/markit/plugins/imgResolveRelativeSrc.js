'use strict';

/**
 * Replaces relative img src with resourceRoot/src
 */

const tokenUtils = require('../utils/token');

module.exports = function(md) {

  md.core.ruler.push('img_resolve_relative_src', function(state) {

    for (let idx = 0; idx < state.tokens.length; idx++) {
      let token = state.tokens[idx];

      if (token.type !== 'inline') continue;

      for (let i = 0; i < token.children.length; i++) {
        let inlineToken = token.children[i];

        if (inlineToken.type == 'image') {
          processImg(inlineToken);
        }
      }
    }

    function processImg(imgToken) {
      let src = tokenUtils.attrGet(imgToken, 'src');

      if (src.indexOf('://') == -1 && src[0] != '/') {
        src = state.md.options.resourceWebRoot + '/' + src;
        tokenUtils.attrReplace(imgToken, 'src', src);
      }

    }

  });

};
