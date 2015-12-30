'use strict';

const md = require('markdown-it')({
  blockTags: ['iframe']
});

require('./plugins/outlinedBlocks')(md);
require('./plugins/sourceBlocks')(md);
require('./plugins/blockTags')(md);
require('./plugins/blockTags/iframe')(md);

let result = md.parse('\n[iframe src="/abc"]\n', {});

let rendered = md.renderer.render(result, md.options, {});

console.log(result);

console.log(rendered);

