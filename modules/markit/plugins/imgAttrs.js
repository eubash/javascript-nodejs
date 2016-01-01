'use strict';

/**
 * Reads attrs from ![alt|height=100 width=200](...)
 * P.S. Plugins that work like ![...](/url =100x150) require special parser, not markdown-compatible markup
 */

const parseAttrs = require('../utils/parseAttrs');

function readImgAttrs(state) {

  for (let idx = 0; idx < state.tokens.length; idx++) {
    let token = state.tokens[i];

    if (token.type !== 'inline') continue;

    for (let i = 0; i < token.children.length; i++) {
      let inlineToken = token.children[i];

      if (inlineToken.type == 'image') {
        processImg(inlineToken);
      }
    }
  }

}

function procesImg(imgToken) {

}


module.exports = function(md) {

  md.core.ruler.push('read_img_attrs', readImgAttrs);

};
