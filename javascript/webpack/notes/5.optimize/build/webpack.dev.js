const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
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
    new HardSourceWebpackPlugin(),
    
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
