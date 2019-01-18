# 1. 概览

## 概念

![](webpack-execute-process.png)

* Resolve
* 入口
* 出口
* loader
* 插件
* 模式（mode)
* 浏览器兼容

### Resolve

解析文件（或目录）。

```js
resolve: {
  extensions: ['.js', '.vue', '.json']
  alias: {
    'vue$': 'vue/dist/vue.esm.js', // 不设置这个默认会使用 runtime 的文件（这里需要的是 compiler+runtime）
  }
}
```

`extensions`: 默认 `['.wasm', '.mjs', '.js', '.json']`，自动解析文件扩展，比如 `import file from '../path/file'` 会尝试解析 `'../path/file.js'` 等文件。
`alias` 指定别名路径。参考 [resolve.alias](https://webpack.js.org/configuration/resolve/#resolve-alias)，常见：

|`alias`|`import 'xyz'`|`import 'xyz/file.js'`|
|--|--|--|
|`{}`|`'/abc/node_modules/xyz/index.js'`|`'/abc/node_modules/xyz/file.js'`|
|`{ xyz$: '/abs/path/file.js' }`|`'/abs/path/file.js'`|`'/abc/node_modules/xyz/file.js'`|
|`{ xyz: '/abs/path' }`|`'/abs/path/index.js'`|`'/abs/path/file.js'`|

### 入口

`entry: {[entryChunkName: string]: string|Array<string>}`

```js
module.exports = {
  entry: './src/index.js' // 默认值
}
```

#### 单入口

上面的简写等同于：

```js
module.exports = {
  entry: {
    main: './src/index.js'
  }
};
```

#### 多入口

**注意**: 不要单独为 vendor 或其它非执行入口创建 entry，因为 `optimization.splitChunks` 会自动完成分离 vendor 等工作。

```js
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

### 出口

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // default
    filename: 'main.js'
  }
};
```

对于多入口，可以这样获取名字: `filename: '[name].js'`。

filename还支持 `id`、`hash`、`chunkhash`、`contenthash`，也支持函数方式，更多参阅[文档 `output.filename`](https://webpack.js.org/configuration/output/#output-filename)。

### loader

webpack 自身只识别 js 和 JSON 等文件，loader 的作用很多就是将其它文件（比如图片）转换为合法的模块，这个模块如果在你的应用里有使用，会被加到依赖图里。

比如下面的代码就是告诉 webpack 编译器，当遇到 `require()`/`import` 引用 `'.txt'` 文件时，先使用 `raw-loader` 转换，然后再加入到打包里。

```js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [ // 注意 rules 的位置哦
      { test: /\.txt$/, use: 'raw-loader' } // 一般就使用 test、use 这两个属性
    ]
  }
};
```

### 插件

与 loader 单一的转换功能不同，插件可以提供很多能力，比如打包优化、资源管理、注入环境变量等。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); //为了获取 webpack 内置的插件

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}) // 它会自动为你的页面注入生成的打包文件
  ]
};
```

一个 webpack 插件就是一个有 `apply` 方法的 JavaScript 对象：

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('The webpack build process is starting!!!');
    });
  }
}
```

### 模式

默认是 `production`，设置某个模式，对应的会设置一些配置，比如 `production` 模式会如下设 `splitChunks`：

```js
splitChunks: {
  hidePathInfo: true,
  minSize: 30000,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
}
```

了解更多[mode:production](https://webpack.js.org/concepts/mode/#mode-production)。

### 浏览器兼容

需要支持 ES5。

## 实战

`npm run build` 可以看到 `dist` 目录下生成了 `index.html` 和 `app.js`，通过其中 `index.html` 已经自动注入了 `app.js` 的 `<script>` 链接，浏览器打开 `index.html` 可以看到样式文件 `style.css` 内容通过 `<style>` 内联在了 `<head>` 里，这是 `style-loader` 的默认行为，可以通过配置输出为以文件引用。

如果设置了 chunk 分割的配置，比如：

```js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

那么输出的文件会多一个 `app~vender.js`，查看 `app.js` 文件，可以看到比之前单文件多了 `webpackJsonpCallback` 和 `checkDeferredModules` 两个函数，它们是用来处理 chunk 加载的，底层依然会通过 `__webpack_require__` 来引用文件（这里的文件是一个个 chunk 文件）。

「注意」加载了 `style.css` 生成的 chunk 内容可能比较多，为了方便查看编译后的代码，可以不依赖该样式文件，并且通过设置 chunk 的大小来触发 chunk split，比如如下设置：

```js
optimization: {
  splitChunks: {
    minSize: 50, // bytes
    maxSize: 100,
    hidePathInfo: true,
    chunks: 'all'
  }
}
```