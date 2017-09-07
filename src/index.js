'use strict';
const buildText = require('./text/build');
const pkg = require('../package.json');
const log = require('./log');
const efrt = require('efrt');
const buildOut = require('./lexicon/buildOut');
const normalize = require('./term/methods/normalize/normalize').normalize;
const indexFirst = require('./lexicon/firstWords');
require('./lexicon/init'); // init main lexicon up-front

const context = {
  lexicon: {},
  firstWords: {}
}

const mergeLexicon = function(userLex) {
  const keys = Object.keys(userLex);
  for (const key of keys) {
    if (context.lexicon[key] === undefined) {
      context.lexicon[key] = userLex[key];
    }
  }
  context.firstWords = indexFirst(context.lexicon)
}

//basically really dirty and stupid.
const normalizeLex = function(lex) {
  lex = lex || {};
  return Object.keys(lex).reduce((h, k) => {
    let normal = normalize(k);
    //remove periods
    //normalize whitesace
    normal = normal.replace(/\s+/, ' ');
    //remove sentence-punctuaion too
    normal = normal.replace(/[.\?\!]/g, '');
    h[normal] = lex[k];
    return h;
  }, {});
};

//the main thing
// linguistischen Datenverarbeitung (nlp)
const nlp = function(str) {
  // this.tagset = tagset;
  let doc = buildText(str, context);
  doc.tagger();
  return doc;
};

nlp.addWords = function(userLexicon, options) {
  if (typeof userLexicon === 'string') {
    userLexicon = nlp.unpack(userLexicon);
  }
  mergeLexicon(buildOut(normalizeLex(userLexicon), options));
};

//same as main method, except with no POS-tagging.
nlp.tokenize = function(str) {
  return buildText(str);
};

//this is useful
nlp.version = pkg.version;

//turn-on some debugging
nlp.verbose = function(str) {
  log.enable(str);
};

//compress user-submitted lexicon
nlp.pack = function(obj) {
  return JSON.stringify(efrt.pack(obj));
};
//uncompress user-submitted lexicon
nlp.unpack = function(str) {
  let obj = JSON.parse(str);
  obj = efrt.unpack(obj);
  return obj;
};

//and then all-the-exports...
if (typeof self !== 'undefined') {
  self.nlp = nlp; // Web Worker
} else if (typeof window !== 'undefined') {
  window.nlp = nlp; // Browser
} else if (typeof global !== 'undefined') {
  global.nlp = nlp; // NodeJS
}
//don't forget amd!
if (typeof define === 'function' && define.amd) {
  define(nlp);
}
//then for some reason, do this too!
if (typeof module !== 'undefined') {
  module.exports = nlp;
}
