const path = require('path');

module.exports = {
  // entry: './src/index.js',
  //mode: 'production',
  mode: 'development',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
