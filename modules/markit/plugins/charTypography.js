'use strict';

function charTypography(state) {
  for (var idx = state.tokens.length - 1; idx >= 0; idx--) {

    if (state.tokens[idx].type !== 'inline') continue;

    doReplacementsInToken(state.tokens[idx].children);
  }
}

function doReplacementsInToken(inlineTokens) {
  var i, token;

  for (i = 0; i < inlineTokens.length; i++) {
    token = inlineTokens[i];
    if (token.type === 'text') {
      token.content = token.content
        .replace(/([^+])\+\-/gi, '$1±')
        .replace(/\.\.\./mg, '…')
        .replace(/\([сСcC]\)(?=[^\.\,\;\:])/ig, '©')
        .replace(/\(r\)/ig, '<sup>®</sup>')
        .replace(/\(tm\)/ig, '™')
        .replace(/(\s|;)\-(\s)/gi, '$1–$2')
        .replace(/<->/gi, '↔').replace(/<-/gi, '←').replace(/(\s)->/gi, '$1→');
    }
  }
}

module.exports = function smartArrows_plugin(md, scheme) {
  // must come before the built-in m-dash and n-dash support
  md.core.ruler.before('replacements', 'char_typography', charTypography);
};
