'use strict';

const MarkdownIt = require('markdown-it');

const mdSmartArrows = require('markdown-it-smartarrows');
const extendedCodePlugin = require('./plugins/extendedCode');
const outlinedBlocksPlugin = require('./plugins/outlinedBlocks');
const sourceBlocksPlugin = require('./plugins/sourceBlocks');

const imgDescToAttrsPlugin = require('./plugins/imgDescToAttrs');

const markdownErrorPlugin = require('./plugins/markdownError');
const blockTagsPlugin = require('./plugins/blockTags/plugin');
const hellipPlugin = require('./plugins/hellip');
const deflistPlugin = require('markdown-it-deflist');

var LANG = LANG || require('config').lang;

module.exports = class BasicParser {

  constructor(options) {
    options = options || {};
    this.options = options;

    this.env = options.env || {};
    this.md = MarkdownIt(Object.assign({
      typographer:   true,
      blockTags:     require('./getPrismLanguage').allSupported,
      linkHeaderTag: false,
      html:          false,
      quotes:        LANG == 'ru' ? '«»„“' : '“”‘’'
    }, options));

    extendedCodePlugin(this.md);
    outlinedBlocksPlugin(this.md);
    sourceBlocksPlugin(this.md);
    imgDescToAttrsPlugin(this.md);
    markdownErrorPlugin(this.md);
    blockTagsPlugin(this.md);
    mdSmartArrows(this.md);
    hellipPlugin(this.md);
    deflistPlugin(this.md);
  }

  parse(text) {
    return this.md.parse(text, this.env);
  }
  parseInline(text) {
    return this.md.parseInline(text, this.env);
  }

  render(text) {
    return this.md.renderer.render(this.parse(text), this.md.options, this.env);
  }

  renderInline(text) {
    let tokens = this.parseInline(text);
    let result = this.md.renderer.render(tokens, this.md.options, this.env);
    return result;
  }

  renderTokens(tokens) {
    return this.md.renderer.render(tokens, this.md.options, this.env);
  }

};
