const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const commonWebpackConfig = require('./webpack.common');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const cssnano = require("cssnano");
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = merge(commonWebpackConfig, {
  entry: {
    app: './src/main.js',
    sub: './src/sub.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[contenthash:8].js',
    pathinfo: false,
  },
  mode: 'production',
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              worker: 4,
              workerParallelJobs: 50,
              name: 'my-pool'
            }
          },
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '..')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:6].css',
      chunkFilename: '[id].[contenthash:6].css',
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
        // Run cssnano in safe mode to avoid
        // potentially unsafe transformations.
        safe: true,
      },
      canPrint: false,
    }),
    new InlineManifestPlugin(),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]', // 默认，资源名
      test: /js|css|png|jpe?g/i,
      algorithm: 'gzip', // 默认是 gzip
      compressionOptions: { level: 9 }, // 默认 { level: 9 }，压缩等级，算法相关
      minRatio: 0.8, // 默认 0.8, 只有当压缩比低于此值时才会进行压缩
      threshold: 0, // 默认 0, 资源大小超过此值才会被处理
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
        commons: {
          minChunks: 2,
          minSize: 200, // 这个只是为了示例才设置这么小
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      }),
    ],
  },
});
