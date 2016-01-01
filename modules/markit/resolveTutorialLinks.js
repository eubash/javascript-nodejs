'use strict';

/**
 * For links info:articleSlug & info:task/taskSlug
 * Load titles from db
 */
const assert = require('assert');

assert(typeof IS_CLIENT === 'undefined');

const Article = require('tutorial').Article;
const Task = require('tutorial').Task;
const Token = require('markdown-it/lib/token');
const t = require('i18n');
const url = require('url');
const LANG = require('config').lang;
const tokenUtils = require('./utils/token');

t.requirePhrase('markit.error', require('./locales/error/' + LANG + '.yml'));

module.exports = function* (tokens, options) {

  let isEmptyLink, isHrefLink;
  for (let idx = 0; idx < tokens.length; idx++) {
    let token = tokens[idx];

    if (token.type != 'inline' || !token.children) continue;
    for (let i = 0; i < token.children.length; i++) {
      let inlineToken = token.children[i];

      if (inlineToken.type == 'link_open') {
        let href = tokenUtils.attrGet(inlineToken, 'href');
        if (!href.startsWith('info:')) continue;
        let pathname = href.slice(5);

        isEmptyLink = token.children[i + 1].type == 'link_close';
        isHrefLink = token.children[i + 1].type == 'text' &&
          token.children[i + 1].content == href &&
          token.children[i + 2].type == 'link_close';

        if (!isEmptyLink && !isHrefLink) continue;

        if (pathname.startsWith('task/')) {
          let task = yield Task.findOne({slug: pathname.slice('task/'.length)}, 'slug title');
          if (task) replaceLink(token.children, i, task.title, task.getUrl());
          else replaceLinkWithError(token.children, i, t('markit.error.task_not_found', {path: pathname}));
        } else {
          let article = yield Article.findOne({slug: pathname}, 'slug title');
          if (article) replaceLink(token.children, i, article.title, article.getUrl());
          else replaceLinkWithError(token.children, i, t('markit.error.article_not_found', {path: pathname}));
        }

      }
    }

  }

  function replaceLinkWithError(children, linkOpenIdx, content) {
    if (isEmptyLink) {
      let token = new Token('markdown_error_inline', '', 0);
      token.content = content;
      token.level = children[linkOpenIdx].level;
      children.splice(linkOpenIdx, 2, token);
      return;
    }

    if (isHrefLink) {
      let token = new Token('markdown_error_inline', '', 0);
      token.content = content;
      token.level = children[linkOpenIdx].level;
      children.splice(linkOpenIdx, 3, token);
      return;
    }

    throw new Error('Should never reach here');
  }


  function replaceLink(children, linkOpenIdx, title, url) {
    tokenUtils.attrReplace(children[linkOpenIdx], 'href', url);

    if (isEmptyLink) {
      let token = new Token('text', '', 0);
      token.content = title;
      token.level = children[linkOpenIdx].level;
      children.splice(linkOpenIdx + 1, 0, token);
      return;
    }

    if (isHrefLink) {
      children[linkOpenIdx + 1].content = title;
      return;
    }

    throw new Error('Should never reach here');
  }

};


