const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MyPluginCreateEvent = require('./plugins/MyPluginCreateEvent');
const MyPlugin = require('./plugins/MyPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.mode,
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'html/another.html'
    }),
    new MyPluginCreateEvent(),
    new MyPlugin(),
    new CopyWebpackPlugin(['static/*']),
    new webpack.DefinePlugin({
      PRODUCTION: true, // == JSON.stringify(true)
      VERSION: JSON.stringify('v3.2')
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        // compress: {}, // 压缩选项，注意默认会丢掉 debugger
        // mangle: true, // 顶层名字不会被压缩，需要设置 { toplevel: true }
      }),
    ],
  },
}