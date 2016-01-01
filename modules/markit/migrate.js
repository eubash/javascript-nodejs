'use strict';

module.exports = function(text) {

  text = text.replace(/\[(edit.*?)\](.*?)\[\/edit\]/g, '[$1 title="$2"]');
  text = text.replace(/\[(edit.*?)\/\]/g, '[$1]');

  text = text.replace(/\[\]\(\/(.*?)\)/g, '<info:$1>');

  text = text.replace(/\[(https?:.*?)\]\(\)/g, '<$1>');

  return text;
};
