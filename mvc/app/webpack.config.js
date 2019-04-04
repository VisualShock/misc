const path = require('path');

module.exports = {
	mode: 'development',
  entry: './app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../'),
    publicPath: "./images/"
  },
  module:{
  	rules: [
  		{ test: /\.html$/, use: { loader: 'html-loader', options: {attrs: false} } },
  		{ test: /\.jpg$/, use: [ "file-loader" ] }
	  ]
  }
};