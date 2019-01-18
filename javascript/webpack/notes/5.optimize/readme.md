# 5. optimize

优化就 2 点：增加打包/编译速度，增加线上访问速度。

> 写在前面:
>
> * 所有的工具、手段，都是在一定的性能瓶颈下才引入的，比如并行、缓存等都针对的是比较大的数据，并行工具在处理完后并行任务后需要合并，这是需要消耗时间的，所以记得不要过度优化，只有在有必要时再优化。
> * 优化最需要优化的地方。
> * 不是所有的工具都适合自己的项目。

一个度量打包速度的插件：

* [`speed-measure-webpack-plugin`](https://github.com/stephencookdev/speed-measure-webpack-plugin)

## 提高编译/打包速度

### 减少开发过程中的非必要步骤

* 本地开发中一般无需 babel 转译
* 本地开发中无需抽离代码，无需 sourceMap
* 一些代码检查的东西最好放在业务功能完成后统一处理，而不是每次代码修改保存时

### 缓存

> 注意哦，在生产环境编译/打包缓存是没有意义的（除非缓存到固定的位置）。

* [`cache-loader`](https://github.com/webpack-contrib/cache-loader)

缓存 loader 的结果，放在要缓存的其它 loader 之前，如 `use: ['cache-loader', 'babel-loader']`。

* [`hard-source-webpack-plugin`](https://github.com/mzgoddard/hard-source-webpack-plugin)

缓存，提升编译速度。

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

plugins: [
  new HardSourceWebpackPlugin()
]
```

### 并行

解决 webpack 单线程问题，常见的工具有这么个几个：

* [`thread-loader`](https://github.com/webpack-contrib/thread-loader)：优化 loader
* [`happypack`](https://github.com/amireh/happypack)：优化 loader。
* [`parallel-webpack`](https://github.com/trivago/parallel-webpack): 适用于多入口

一个 `thread-loader` 的配置示例：

```js
rules: [
  {
    test: /\.js$/,
    use: [
      {
        loader: 'thread-loader',
        options: {
          worker: 4,
          workerParallelJobs: 50,
          name: 'my-pool'
        }
      },
      'babel-loader?cacheDirectory=true'
    ],
    include: [resolve('src')],
    exclude: /node_modules/
  },
// ...
```

开启一些插件的 parallel 属性（如果插件支持），比如上一节讲到的 Uglify 插件。

## 其它优化

### 压缩

JS、CSS、HTML 压缩，上一节都已经讲过。

* [`compression-webpack-plugin`](https://github.com/webpack-contrib/compression-webpack-plugin)

这个不是代码层面的压缩，而是对资源文件的压缩，一个示例：

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]', // 默认，资源名
    test: /js|css|png|jpe?g/i,
    algorithm: 'gzip', // 默认是 gzip
    compressionOptions: { level: 9 }, // 默认 { level: 9 }，压缩等级，算法相关
    minRatio: 0.8, // 默认 0.8, 只有当压缩比低于此值时才会进行压缩
    threshold: 0, // 默认 0, 资源大小超过此值才会被处理
  }),
]
```

### scope hoist 和 tree shaking

两者都是在 ES6 Modules 语法下才能生效的优化（意味着一些转译工具，比如 Babel 需要关闭对 ES6 Modules 的转译），前者是为了提升 JavaScript 的执行速度，后者是减少代码体积（不打包无用代码），所以，为了用到这 2 点优化，开发中应使用 ES6 Module 定义。

webpack4 已经内置了生产模式下的 scope hoist 和 tree shaking 的处理（tree shaking 还要额外在package.json 中添加 `"sideEffects"` 配置），如果要在其它场景下开启，可以使用引入 `ModuleConcatenationPlugin`，另外有一个 tree shaking 支持 commonJs 的工具 [`webpack-common-shake`](https://www.npmjs.com/package/webpack-common-shake)。

### 长缓存

首先一个入口（entry）会对应一个 js 输出，一些第三方库一般都不会修改，应该将这些从业务代码包中抽离，长期缓存，另外一些公共的代码（比如被引用 2 次以上）修改也会比较少，可以单独抽离。webpack 打包出的输出一般有一个统一的出口，默认会放在 vendor 里（如果没有开启分离的话），它一般变动较大，内容比较小，所以独立抽取并 inline （借助 [`inline-manifest-webpack-plugin`](https://www.npmjs.com/package/inline-manifest-webpack-plugin) 插件）到 html，减少它自身变化对 vendor 等文件的 hash 影响，以及减少请求。

```js
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');

// ...
optimization: {
  runtimeChunk: {
    name: 'manifest' // 
  },
  splitChunks: {
    chunks: 'all',  // 还可以自定义某些根据 chunk 筛选的抽离
    cacheGroups: {
      vendors: { // 引用的 node_modules 中的代码抽取出来，这是默认配置
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
      },
      commons: {
        // 抽取 demand-chunk 下的公共依赖模块
          name: 'commons',
          minChunks: 2, // 在chunk中最小的被引用次数
          chunks: 'async',
          minSize: 0, // 被提取模块的最小大小
      }, // 还可以自定义某些规则的抽离
    }
  },
},
plugins: [
  new HtmlWebpackPlugin(),
  new InlineManifestPlugin() // 必须在 html-webpack-plugin 之后
]
```

尽量保证每次修改代码不变更不相关文件名里的 hash 值，比如对 css 文件应该使用 contenthash，而不是 chunkhash，后者在 CSS 文件没有修改但如果关联的JS有修改时，hash 值也会改变。

