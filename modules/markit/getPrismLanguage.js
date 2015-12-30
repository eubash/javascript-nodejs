'use strict';

let languageMap = {
  html:   'markup',
  js:     'javascript',
  coffee: 'coffeescript'
};

let languages = 'markup javascript css coffeescript php http java ruby scss sql'.split(' ');

function getPrismLanguage(language) {
  language = languageMap[language] || language;
  if (languages.indexOf(language) == -1) language = 'none';

  return language;
}

getPrismLanguage.languages = languages;

module.exports = getPrismLanguage;
