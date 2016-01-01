'use strict';

const should = require('should');

// introduce models for fixtures
require('lib/mongoose');
require('tutorial').Article;
require('tutorial').Task;

const MarkdownIt = require('markdown-it');
const loadSrcAsync = require('../loadSrcAsync');
const resolveTutorialLinks = require('../resolveTutorialLinks');
const dataUtil = require('lib/dataUtil');
const path = require('path');
const mdSmartArrows = require('markdown-it-smartarrows');


// compares removing spaces between tags
should.Assertion.add('html', function(str) {
  this.obj.should.be.a.String;
  str.should.be.a.String;
  this.obj.trim().replace(/>\s+</g, '><').should.equal(str.trim().replace(/>\s+</g, '><'));
}, false);


function makeMd() {

  const md = MarkdownIt({
    typographer: true,
    blockTags: ['iframe', 'edit', 'cut'].concat(require('../getPrismLanguage').allSupported),
    staticHost:      'https://js.cx',
    resourceWebRoot: '/resources',
    publicRoot: __dirname,
    html: true
  });

  require('../plugins/outlinedBlocks')(md);
  require('../plugins/sourceBlocks')(md);
  require('../plugins/markdownError')(md);
  require('../plugins/blockTags/plugin')(md);
  require('../plugins/blockTags/iframe')(md);
  require('../plugins/blockTags/edit')(md);
  require('../plugins/blockTags/cut')(md);

  mdSmartArrows(md);

  return md;
}

function* render(text) {

  const md = makeMd();

  const parsed = md.parse(text, {});
  yield* loadSrcAsync(parsed, md.options);
  yield* resolveTutorialLinks(parsed, md.options);

  return md.renderer.render(parsed, md.options, {});
}


describe('MarkIt', function() {

  before(function* () {
    yield* dataUtil.loadModels(path.join(__dirname, './fixture/tutorial'), {reset: true});
  });


  it(`[js src="1.js" height=300]`, function*() {
    let result = yield* render(this.test.title);
    result.should.be.html(`<div data-trusted="1" class="code-example" data-demo-height="300">
      <div class="codebox code-example__codebox">
        <div class="codebox__code" data-code="1">
        <pre class="line-numbers language-none"><code class="language-none">var a = 5</code></pre>
        </div>
      </div>
    </div>`);

  });


  it(`<info:task/task-1>`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.eql('<p><a href="/task/task-1">Task 1</a></p>');
  });

  it(`<info:article-1.2>`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.eql('<p><a href="/article-1.2">Article 1.2</a></p>');
  });
});

