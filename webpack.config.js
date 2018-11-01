const path = require('path');

module.exports = {
  // mode: 'production',
  // entry: './src/index.js',

  mode: 'development',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
