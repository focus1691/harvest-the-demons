const merge = require('webpack-merge');
const path = require('path');
const base = require('./base');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: 'bundle.min.js'
  },
  devtool: false,
  devServer: {
    contentBase: path.resolve(__dirname, '../'),
    compress: true,
    port: process.env.PORT || 5000
  },
  performance: {
    maxEntrypointSize: 1260000,
    maxAssetSize: 1260000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ],
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
});
