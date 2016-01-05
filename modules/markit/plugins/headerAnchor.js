'use strict';


/**
 * Reads ## Heading [#anchor]
 * Transliterates heading text if no anchor
 * writes that to `headingToken.anchor`
 *
 * Renders as link if `options.linkHeaderTag` or header id
 */

const parseAttrs = require('../utils/parseAttrs');
const makeAnchor = require('textUtil/makeAnchor');

// add headingToken.achor
// not "id" attr, because rendering uses `.anchor` for the extra link OR id
function readHeadingAnchor(state) {

  //let env = state.env;
  //if (!env.headings) env.headings = [];

  let tokens = state.tokens;
  for (let idx = 0; idx < state.tokens.length; idx++) {
    let headingToken = state.tokens[idx];

    if (headingToken.type !== 'heading_open') continue;

    idx++;

    let inlineToken = tokens[idx];
    if (inlineToken.type != 'inline') continue;

    let anchorReg = /\s+\[#(.*?)\]$/;
    let anchor;
    if (inlineToken.content.match(anchorReg)) {
      anchor = inlineToken.content.match(anchorReg)[1];

      // strip [#...] from token content
      inlineToken.content = inlineToken.content.replace(anchorReg, '');
      let lastTextToken = inlineToken.children[inlineToken.children.length - 1];
      lastTextToken.content = inlineToken.content.replace(anchorReg, '');
    } else {
      anchor = makeAnchor(inlineToken.content, state.md.options.translitAnchors);
    }

    headingToken.anchor = anchor;
  }

}

module.exports = function(md) {

  md.core.ruler.push('read_heading_anchor', readHeadingAnchor);

  md.renderer.rules.heading_open = function(tokens, idx, options, env, slf) {
    let token = tokens[idx];
    let anchor = token.anchor;
    if (options.linkHeaderTag) {
      return `<${token.tag}${slf.renderAttrs(token)}><a class="main__anchor" name="${anchor}" href="#${anchor}">`;
    } else {
      // for ebook need id
      return `<${token.tag} id="${anchor}">`;
    }
  };

  md.renderer.rules.heading_close = function(tokens, idx, options, env, slf) {
    let token = tokens[idx];
    if (options.linkHeaderTag) {
      return `</a></${token.tag}>`;
    } else {
      return `</${token.tag}>`;
    }
  };

};
