const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      title: 'Hello Webpack'
    }),
  ],
  devServer: {
    hotOnly: true, // 如果热更新失败不刷新页面
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT,
    overlay: true, // 页面 error 提示，不显示 runtime 错误
    clientLogLevel: 'warning',
  }
}