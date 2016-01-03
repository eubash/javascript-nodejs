'use strict';

const assert = require('assert');

assert(typeof IS_CLIENT === 'undefined');

const imageSize = require('image-size');

const path = require('path');
const tokenUtils = require('./utils/token');
const t = require('i18n');
const fs = require('mz/fs');

var LANG = require('config').lang;

t.requirePhrase('markit.error', require('./locales/error/' + LANG + '.yml'));

class SrcError extends Error {
}

module.exports = function* (tokens, options) {

  for (let idx = 0; idx < tokens.length; idx++) {
    let token = tokens[idx];

    if (token.type != 'inline') continue;

    for (let i = 0; i < token.children.length; i++) {
      let inlineToken = token.children[i];
      if (inlineToken.type != 'image') continue;

      if (inlineToken.attrIndex('height') != -1 || inlineToken.attrIndex('width') != -1) continue;

      try {
        yield* processImage(inlineToken);
      } catch (error) {
        if (error instanceof SrcError) {
          // replace image with error text
          inlineToken.type = 'markdown_error_inline';
          inlineToken.tag = '';
          inlineToken.children = null;
          inlineToken.attrs = null;
          inlineToken.content = error.message;
        } else {
          throw error;
        }

      }
    }

  }


  function srcUnderRoot(root, src) {
    let absolutePath = path.join(root, src);

    if (absolutePath.slice(0, root.length + 1) != root + '/') {
      throw new SrcError(t('markit.error.src_outside_of_root', {src}));
    }

    return absolutePath;
  }

  function* getImageInfo(src) {

    let sourcePath = srcUnderRoot(
      options.publicRoot,
      path.join(options.resourceWebRoot, src)
    );

    // check readability
    try {
      let fd = yield fs.open(sourcePath, 'r');
      yield fs.close(fd);
    } catch (e) {
      if (e.code == 'ENOENT' || e.code == 'EISDIR') {
        throw new SrcError(t('markit.error.image_not_found', {src}));
      }

      throw new SrcError(`${src}: ${e.message}`);
    }

    try {
      let imageInfo = yield function(callback) {
        imageSize(sourcePath, callback);
      };

      return imageInfo;
    } catch (e) {
      if (e instanceof TypeError) {
        throw new SrcError(t('markit.error.image_invalid', {src}));
      }

      throw new SrcError(`${src}: ${e.message}`);
    }
  }

  function* processImage(imgToken) {

    let src = tokenUtils.attrGet(imgToken, 'src');
    if (!src) return;

    let imageInfo = yield* getImageInfo(src);

    tokenUtils.attrReplace(imgToken, 'width', imageInfo.width);
    tokenUtils.attrReplace(imgToken, 'height', imageInfo.height);
  }


};


