'use strict';

/**
 * tokenAttrReplace(name, value)
 *
 * Replace all attributes with name `name` with one with the value `attrData`
 **/
function attrReplace(token, name, value) {
  var found;

  var attrs = token.attrs;

  if (attrs) {
    // modify the existing attr is possible
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i][0] === name) {
        if (!found) {
          attrs[i][1] = value;
          found = true;
        } else {
          // remove extra attrs with same name
          attrs.splice(i, 1);
          i--;
        }
      }
    }

    // add a new attribute with such name if none was found
    if (!found) {
      attrs.push([name, value]);
    }
  } else {
    token.attrs = [ [name, value] ];
  }
}

function attrGet(token, name) {
  let idx = token.attrIndex(name);
  if (idx == -1) return null;
  return token.attrs[idx][1];
}

exports.attrReplace = attrReplace;

exports.attrGet = attrGet;
