# Plugin

## 常见 plugin


### html

* html-webpack-plugin

html-webpack-plugin 实例比较多的时候，热编译会比较慢。


### 样式

* mini-css-extract-plugin

`npm i -D mini-css-extract-plugin`

### JS

* `uglifyjs-webpack-plugin` (建议使用 `terser-webpack-plugin` )

结合 `optimization.minimize` 和 `optimization.minimizer` 配置


### 其它

* clean-webpack-plugin

```bash
npm i -D clean-webpack-plugin
```

```js
const CleanWebpackPlugin = require('clean-webpack-plugin');

plugins: [
  new CleanWebpackPlugin(['dist']),
  // ...
]
```

* speed-measure-webpack-plugin

打包时间度量，简单的时间度量可以通过在 build 时 `--profile` 来查看。

* hard-source-webpack-plugin

缓存，提升编译速度。

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
new HardSourceWebpackPlugin()
```



## 实现一个自己的 plugin

* compiler: 全局唯一，包含webpack 环境所有配置信息，webpack 从启动到执行，可以简单理解为是 webpack 实例
* compilation: 包含当前的模块、编译生成资源、变化的文件等，是一次新的编译。（webpack 以开发模式运行时，一次文件变化引起的重编译就是一个新的compilation）

* 一个命名类
* 一个名为 `apply` 的成员方法:
  - 指定一个需要监听的事件钩子
  - 操作 webpack 内部实例特定的数据
  - 调用 webpack 提供的 callback 声明操作完成

```js
class HelloCompilationPlugin {
  apply(compiler) {
    // Tap into compilation hook which gives compilation as argument to the callback function
    compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
      // Now we can tap into various hooks available through compilation
      compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
        console.log('Assets are being optimized.');
      });
    });
  }
}

module.exports = HelloCompilationPlugin;
```
----

## 参考

1. https://webpack.js.org/contribute/writing-a-plugin/
