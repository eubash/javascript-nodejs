'use strict';

const should = require('should');
const MarkdownIt = require('markdown-it');

// compares removing spaces between tags
should.Assertion.add('html', function(str) {
  this.obj.should.be.a.String;
  str.should.be.a.String;
  this.obj.trim().replace(/>\s+</g, '><').should.equal(str.trim().replace(/>\s+</g, '><'));
}, false);


function makeMd() {

  const md = MarkdownIt({
    blockTags: ['iframe']
  });

  require('../plugins/outlinedBlocks')(md);
  require('../plugins/sourceBlocks')(md);
  require('../plugins/blockTags')(md);
  require('../plugins/blockTags/iframe')(md);

  return md;
}

function render(text) {

  const md = makeMd();

  return md.render(text);
}

function parse(text) {

  const md = makeMd();

  return md.parse(text);
}

describe('MarkIt', function() {

  it(`[iframe src="/path"]`, function() {
    let result = render(this.test.title);
    result.should.be.html(`<div class="code-result">
      <div class="code-result__toolbar toolbar"></div>
      <iframe class="code-result__iframe" data-trusted="0" style="height:300px" src="/path"></iframe>
    </div>`
    );

  });

  it('```js\na = 5\n```\n', function() {
    let result = render(this.test.title);
    result.should.be.html(`<div data-trusted="0" class="code-example">
      <div class="codebox code-example__codebox">
        <div class="codebox__code" data-code="1">
          <pre class="line-numbers language-javascript"><code class="language-javascript">a = 5</code></pre>
        </div>
      </div>
     </div>`
    );

  });


});

