'use strict';

const assert = require('assert');

assert(typeof IS_CLIENT === 'undefined');

const Article = require('tutorial/models/article');
const Plunk = require('plunk').Plunk;
const Task = require('tutorial/models/task');
const path = require('path');
const fs = require('mz/fs');
const t = require('i18n');

var LANG = LANG || require('config').lang;

t.requirePhrase('markit.error', require('./locales/error/' + LANG + '.yml'));

module.exports = function* (md) {

  let methods = {
    blocktag_codetabs,
    blocktag_source
  };

  class SrcError extends Error {
  }

  function srcUnderRoot(root, src) {
    let absolutePath = path.join(root, src);

    if (absolutePath.slice(0, root.length + 1) != root + '/') {
      throw new SrcError(t('markit.error.src_outside_of_root', {src}));
    }

    return absolutePath;
  }


  function* blocktag_codetabs(token) {
    let src = path.join(md.options.resourceWebRoot, token.blockTagAttrs.src);

    let plunk = yield Plunk.findOne({webPath: src});

    if (!plunk) {
      throw new SrcError(t('markit.error.no_such_plunk', {src}));
    }

    token.plunk = plunk;
  }

  function* blocktag_source(token) {

    if (!token.blockTagAttrs.src) return;

    let sourcePath = srcUnderRoot(
      md.options.publicRoot,
      path.join(md.options.resourceWebRoot, token.blockTagAttrs.src)
    );

    let content;

    try {
      content = yield fs.readFile(sourcePath, 'utf-8');
    } catch (e) {
      throw new SrcError(
        t('markit.error.read_file', {src: token.blockTagAttrs.src}) +
        (process.env.NODE_ENV == 'development' ? ` [${sourcePath}]` : '')
      );
    }

    token.content = content;
  }


  for (var idx = 0; idx < md.state.tokens.length; idx++) {
    let token = md.state.tokens[idx];

    let process = methods[token.type];
    if (process) {
      try {
        yield* process(token);
      } catch (err) {
        if (err instanceof SrcError) {
          token.type = 'markdown_error_block';
          token.content = err.message;
        } else {
          throw err;
        }
      }
    }
  }

};
