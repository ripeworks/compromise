'use strict';
var nlp = require('./src/index');
// nlp.verbose('tagger');
// const fresh = require('./test/unit/lib/freshPrince.js');

var lexicon = {
  dorritos: 'Chip'
};
var r = nlp('blend 2 tbsp of dorritos', lexicon);
console.log(r.match('#Value #Unit of #Chip').out());
