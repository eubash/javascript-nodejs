'use strict';

const assert = require('assert');

assert(typeof IS_CLIENT === 'undefined');

const Plunk = require('plunk').Plunk;
const path = require('path');
const fs = require('mz/fs');
const t = require('i18n');

var LANG = require('config').lang;

t.requirePhrase('markit.error', require('./locales/error/' + LANG + '.yml'));


class SrcError extends Error {
}

function srcUnderRoot(root, src) {
  let absolutePath = path.join(root, src);

  if (absolutePath.slice(0, root.length + 1) != root + '/') {
    throw new SrcError(t('markit.error.src_outside_of_root', {src}));
  }

  return absolutePath;
}



module.exports = function* (tokens, options) {

  let methods = {
    blocktag_codetabs: src2plunk,
    blocktag_edit: src2plunk,
    blocktag_iframe,
    blocktag_source
  };

  function* src2plunk(token) {

    let src = path.join(options.resourceWebRoot, token.blockTagAttrs.src);

    let plunk = yield Plunk.findOne({webPath: src});

    if (!plunk) {
      throw new SrcError(t('markit.error.no_such_plunk', {src}));
    }

    token.plunk = plunk;
  }

  function* blocktag_iframe(token) {
    if (token.blockTagAttrs.edit) {
      yield* src2plunk(token);
    }
  }

  function* blocktag_source(token) {

    if (!token.blockTagAttrs.src) return;

    let sourcePath = srcUnderRoot(
      options.publicRoot,
      path.join(options.resourceWebRoot, token.blockTagAttrs.src)
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

  function* walk(tokens) {

    for (let idx = 0; idx < tokens.length; idx++) {
      let token = tokens[idx];
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

      /* don't walk nested, no rules for them
      if (token.children) {
        yield* walk(token.children);
      }
      */
    }

  }


  yield* walk(tokens);
};


