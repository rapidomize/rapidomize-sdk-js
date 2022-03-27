const path = require('path');

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: './src/rapidomize.js',
  output: {
    filename: 'rapidomize.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'rapidomize'
  }
};