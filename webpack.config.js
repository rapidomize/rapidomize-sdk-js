const path = require('path');

module.exports = [
  {
    target: 'node',
    mode: 'production',
    entry: './src/rapidomize.js',
    output: {
      filename: 'rapidomize.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'rapidomize',
      libraryTarget: 'umd',
      globalObject: 'this'
    }
  },
  {
    target: 'web',
    mode: 'production',
    entry: './src/rapidomize.js',
    output: {
      filename: 'rapidomize-browser.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'rapidomize',
      libraryTarget: 'umd',
      globalObject: 'this'
    }
  }
];