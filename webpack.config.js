const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

var nodeModules = {};
nodeModules["react"] = 'window.React';
nodeModules["react-dom"] = 'window.ReactDOM';

module.exports = {
  mode: "production",
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: "depMapScreensVisualization",
    libraryTarget: "var"
  },
  optimization: {
    minimize: true
  },
	module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
	externals: nodeModules,
  node: {
    fs: "empty"
  }
};
