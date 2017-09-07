'use strict';
const Text = require('./index');
const tokenize = require('./tokenize');
const paths = require('./paths');
const Terms = paths.Terms;
const fns = paths.fns;

const fromString = (str, lexicon) => {
  let sentences = [];
  //allow pre-tokenized input
  if (fns.isArray(str)) {
    sentences = str;
  } else {
    str = fns.ensureString(str);
    sentences = tokenize(str);
  }
  let list = sentences.map(s => Terms.fromString(s, lexicon));

  let r = new Text(list, lexicon);
  //give each ts a ref to the result
  r.list.forEach(ts => {
    ts.refText = r;
  });
  return r;
};
module.exports = fromString;
