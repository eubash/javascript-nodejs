'use strict';

let migrate = require('../migrate');

describe("Migrate", function() {

  it('edit', function() {
    migrate('[edit src="solution"]Полный код решения[/edit]').should.eql(
      '[edit src="solution" title="Полный код решения"]'
    );

    migrate('[edit src="solution"/]').should.eql(
      '[edit src="solution"]'
    );
  });

  it('links', function() {

    migrate('[http://quirksmode.org/]()').should.eql(
      '<http://quirksmode.org/>'
    );

    migrate('[](/article/path)').should.eql(
      '<info:article/path>'
    );


  });
});
