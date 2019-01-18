const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const HappyPack = require("happypack");


module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hello Webpack'
    }),
    // new InlineManifestPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
