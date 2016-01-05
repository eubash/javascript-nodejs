/*
 * Based on smartArrows plugin
 */

'use strict';

function hellip(state) {
  for (var blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    if (state.tokens[blkIdx].content.indexOf('...') > -1) {
      doReplacementsInToken(state.tokens[blkIdx].children);
    }
  }
}

function doReplacementsInToken(inlineTokens) {
  var i, token;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
    token = inlineTokens[i];
    if (token.type === 'text') {
      if (token.content.indexOf('...') > -1) {
        token.content = token.content
          .replace(/\.\.\./mg, '…');
      }
    }
  }
}

module.exports = function smartArrows_plugin(md) {
  md.core.ruler.before('replacements', 'hellip', hellip);
};
