var nlp;
if (process && process.env.TESTENV === 'prod') {
  console.log('prod');
  nlp = require('../../../builds/compromise.min');
  // nlp = require('../../../builds/compromise');
} else {
  console.log('dev');
  nlp = require('../../../src/index');
}
if (typeof window !== undefined) {
  nlp = window.nlp;
} else {
  module.exports = nlp;
}
