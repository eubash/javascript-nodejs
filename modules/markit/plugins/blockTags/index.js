'use strict';

const parseAttrs = require('../../utils/parseAttrs');

function rewriteInlineToBlockTags(state) {
  for (var idx = 1; idx < state.tokens.length - 1; idx++) {
    if (state.tokens[idx - 1].type == 'paragraph_open' &&
      state.tokens[idx + 1].type == 'paragraph_close' &&
      state.tokens[idx].type == 'inline') {

      let blockTagMatch = state.tokens[idx].content.trim().match(/\[(\w+)\s*([^\]]*)\]/);
      if (!blockTagMatch) continue;

      let blockTagName = blockTagMatch[1];

      // if not supported
      if (!state.md.options.blockTags || state.md.options.blockTags.indexOf(blockTagName) == -1) continue;

      let blockTagAttrs = parseAttrs(blockTagMatch[2]);
      let blockTagToken = {
        type:          `blocktag_${blockTagName}`,
        tag:           blockTagName,
        attrs:         state.token[idx].attrs,
        blockTagAttrs: blockTagAttrs,
        map:           state.tokens[idx].map.slice(),
        nesting:       0,
        level:         0,
        children:      null,
        content:       '',
        info:          '',
        meta:          null,
        block:         true,
        hidden:        false
      };

      state.tokens.splice(idx - 1, 3, blockTagToken);
      // no need to move idx back, because
      // p ! p p ! p
      // 0 1 2
      //   ^ if match here, we have this after move
      // B p ! p
      //   ^ idx position ok

    }
  }
}


module.exports = function(md) {

  md.core.ruler.push('rewrite_inline_to_block_tags', rewriteInlineToBlockTags);

};


