'use strict';

const should = require('should');

// introduce models for fixtures
require('lib/mongoose');
require('tutorial').Article;
require('tutorial').Task;

const MarkdownIt = require('markdown-it');
const loadSrcAsync = require('../loadSrcAsync');
const loadImgSizeAsync = require('../loadImgSizeAsync');
const resolveTutorialLinks = require('../resolveTutorialLinks');
const dataUtil = require('lib/dataUtil');
const path = require('path');
const mdSmartArrows = require('markdown-it-smartarrows');
const stripYamlMetadata = require('../stripYamlMetadata');

// compares removing spaces between tags
should.Assertion.add('html', function(str) {
  this.obj.should.be.a.String;
  str.should.be.a.String;
  this.obj.trim().replace(/>\s+</g, '><').should.equal(str.trim().replace(/>\s+</g, '><'));
}, false);


function makeMd() {

  const md = MarkdownIt({
    typographer:     true,
    blockTags:       ['iframe', 'edit', 'cut', 'codetabs', 'demo'].concat(require('../getPrismLanguage').allSupported),
    staticHost:      'https://js.cx',
    resourceWebRoot: '/resources',
    publicRoot:      __dirname,
    linkHeaderTag: true,
    html:            true
  });

  require('../plugins/extendedCode')(md);
  require('../plugins/outlinedBlocks')(md);
  require('../plugins/compare')(md);
  require('../plugins/sourceBlocks')(md);
  require('../plugins/imgAttrs')(md);
  require('../plugins/imgFigures')(md);
  require('../plugins/headerAnchor')(md);
  require('../plugins/markdownError')(md);
  require('../plugins/blockTags/plugin')(md);
  require('../plugins/blockTags/iframe')(md);
  require('../plugins/blockTags/edit')(md);
  require('../plugins/blockTags/cut')(md);
  require('../plugins/blockTags/codetabs')(md);
  require('../plugins/blockTags/demo')(md);

  mdSmartArrows(md);

  return md;
}

function* render(text) {

  const md = makeMd();

  let tmp;
  try {
    tmp = stripYamlMetadata(text);
  } catch (e) {
    // bad metadata stops parsing immediately
    return e.message;
  }

  text = tmp.text;
  let env = {meta: tmp.meta};

  const parsed = md.parse(text, env);
  yield* loadSrcAsync(parsed, md.options);
  yield* loadImgSizeAsync(parsed, md.options);
  yield* resolveTutorialLinks(parsed, md.options);

  let result = md.renderer.render(parsed, md.options, env);
  //console.log(env);
  return result;

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


  it(`[iframe src="/path"]`, function*() {
    let result = yield* render(this.test.title);
    result.should.be.html(`<div class="code-result">
      <div class="code-result__toolbar toolbar"></div>
      <iframe class="code-result__iframe" data-trusted="1" style="height:300px" src="/path"></iframe>
    </div>`
    );

  });

  it('```js\na = 5\n```\n', function*() {
    let result = yield* render(this.test.title);
    result.should.be.html(`<div data-trusted="1" class="code-example">
      <div class="codebox code-example__codebox">
        <div class="codebox__code" data-code="1">
          <pre class="line-numbers language-javascript"><code class="language-javascript">a = 5</code></pre>
        </div>
      </div>
     </div>`
    );

  });



  it(`<info:task/task-1>`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.eql('<p><a href="/task/task-1">Task 1</a></p>');
  });

  it(`<info:article-1.2>`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.eql('<p><a href="/article-1.2">Article 1.2</a></p>');
  });

  it(`notfigure ![desc|height=100 width=200](/url)`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.eql('<p>notfigure <img src="/url" alt="desc" height="100" width="200"></p>');
  });

  it(`notfigure ![desc](blank.png)`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.eql('<p>notfigure <img src="blank.png" alt="desc" width="3" height="2"></p>');
  });

  it(`notfigure ![desc](not-exists.png)`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.match(/^<p>notfigure <span class="markdown-error">.*?<\/p>$/);
  });

  it(`notfigure ![desc](error.png)`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.match(/^<p>notfigure <span class="markdown-error">.*?<\/p>$/);
  });

  it(`notfigure ![desc](1.js)`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.match(/^<p>notfigure <span class="markdown-error">.*?<\/p>$/);
  });

  it(`![figure|height=100 width=200](/url)`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.html(`<figure><div class="image" style="width:200px">
      <div class="image__ratio" style="padding-top:50%"></div>
      <img src="/url" alt="" height="100" width="200" class="image__image">
      </div></figure>`);
  });

  it(`## Header [#anchor]`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.html('<h2><a class="main__anchor" name="anchor" href="#anchor">Header</a></h2>');
  });

  it(`## My header`, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.html('<h2><a class="main__anchor" name="my-header" href="#my-header">My header</a></h2>');
  });

  it(`\`\`\`compare
- Полная интеграция с HTML/CSS.
- Простые вещи делаются просто.
- Поддерживается всеми распространёнными браузерами и включён по умолчанию.
\`\`\``, function*() {
    let result = yield* render(this.test.title);
    result.trim().should.be.html(`<div class="balance balance_single">
    <div class="balance__minuses">
    <div class="balance__content">
      <div class="balance__title">Недостатки</div>
        <ul class="balance__list">
        <li>Полная интеграция с HTML/CSS.</li>
        <li>Простые вещи делаются просто.</li>
        <li>Поддерживается всеми распространёнными браузерами и включён по умолчанию.</li>
        </ul>
      </div>
    </div>
    </div>`);
  });

/*
  it(`Механизм работы функций и переменных в JavaScript очень отличается от большинства языков.

Чтобы его понять, мы в этой главе рассмотрим переменные и функции в глобальной области. А в следующей -- пойдём дальше.

[cut]

## Глобальный объект
`, function*() {
    let result = yield* render(this.test.title);

    console.log(result);
  });
*/

});


