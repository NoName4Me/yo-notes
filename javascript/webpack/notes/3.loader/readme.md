# 3. Loader

把原本 webpack 无法解析的文件（或需要特别处理的文件）转换成 webpack 可以利用的「模块」。以下是常见的几个 loader 说明。

loader 的两种引入格式：

```js
module: {
  rules: [ // 注意 rules 的位置哦
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('autoprefixer')({...options}),
            ]
          }
        }
      ]
    } // 一般就使用 test、use 这两个属性
  ]
}
```

多个 loader 就像一条流水线，从右到左，从下到上执行，前一个的输出是后一个的输入，第一个被执行的loader 入参是源文件内容，最后一个被执行的输出是 JS 代码（是需要传给 webpack 的）。

## 常见 loader

### 文件

* file-loader

将 `import/require()` 的文件解析为一个 url，并将该文件发布到输出目录

```js
// index.js
import img from './file.png';

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path]/[hash].[ext]', // 默认 [hash].[ext]，也支持函数方式
              outputPath: 'images', // 默认 undefined
            },
          },
        ],
      },
    ],
  },
};
```

* url-loader

将资源转为 base64 URI，如果超过了设定的大小，则使用 file-loader。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 最大值，单位：字节
              fallback: 'file-loader' // 这是默认值
            }
          }
        ]
      }
    ]
  }
}
```

### 样式

* style-loader

将样式以 `<style>` 方式插入到 DOM 里，一般配合 `css-loader` 使用。

```js
// index.js
import style from 'style.css';

// webpack.config.js
output: {
  filename: 'main.js'  // 注意并不是直接写入到 index.html 里，而是在 main.js 里 createElement 注入到 DOM 里的
},
modules: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },
    // ...
  ]
}
```

如果想以 `<link>` 方式引入，使用 `style-loader` + `file-loader`：

```js
// webpack.config.js
rules: [
  {
    test: /\.css$/,
    use: [
      'style-loader/url',
      'file-loader'
    ]
  },
  // ...
]
```

* css-loader

将 `@import` 和 `url()` 翻译为 `import/require()`，并解析它们，外部的资源会被跳过。

有个特殊的情况需要说明，如果是从一个css中 import 了一个 scss 文件，那么需要设置 `importLoaders` 属性。

```js
rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1 // 表示在 css-loader 之前有多少 loader 需要先执行
          }
        },
        'sass-loader'
      ]
    },
    // ...
  ]
```

* sass-loader

将 sass 样式文件转为模块。还可以利用 `mini-css-extract-plugin` 插件将其分离为独立的 css 文件。

```bash
npm i -D sass-loader node-sass
```

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// ...
module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    },
  ]
},
plugins: [
  new MiniCssExtractPlugin({
      filename: "[name].[hash:7].css"
    }),
]
// ...
```

* postcss-loader

```bash
# 安装相关依赖
npm i -D postcss-loader autoprefixer
```

配置：

```js
// module:rules:
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader', // 也可以通过 postcss.config.js 来配置
      options: {
        ident: 'postcss',
        plugins: [
          require('autoprefixer')({ // 它除了能增加需要的前缀外还能删除不必要的前缀
            browsers: [ // 也可以通过 .browserslistrc 或 package.json 里的 browserslist 配置
              "> 1%",
              "last 2 versions",
              "not ie <= 8"
            ]
          }),
        ]
      }
    }
  ]
},
```

### 其它

* babel-loader

让 JavaScript 文件经过 babel 转译。

一般需要安装这么几个包 `npm i -D babel-loader @babel/core @babel/preset-env`，与 `.babelrc` 配置结合使用。

```js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader?cacheDirectory', // cacheDirectory 缓存 loader 的结果，加速下次打包编译
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    }
  ]
}
```

* vue-loader

单文件（Single-File Components)组件转换。

**注意**这里有个坑：还必须安装 `vue-template-compiler`，并且和 `vue` 版本保持一致（用 vue-cli 的话可以忽略），讨论见 [vue-loader#560](https://github.com/vuejs/vue-loader/issues/560)。

```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  module: {
    rules: [
      // ... other rules
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // 将其它 loader 的规则（比如 css）应用到 vue 文件的某个部分（比如 style）
    new VueLoaderPlugin()
  ],
  // 要注意这里哦，这两个是必须的
  resolve: {
    extensions: ['.js', '.vue', '.json'], // import 时不再需要扩展名.vue
    alias: {
      'vue$': 'vue/dist/vue.esm.js', // 不设置这个默认会使用 runtime 的文件（这里需要的是 compiler+runtime）
    }
  }
}
```

## 实现一个自己的 loader

其实 loader 就是一个 nodejs 模块，它的基本骨架就是：

```js
module.exports = function(source) {
  return source;
};
```

webpack 有为 loader 开发提供一系列的 API，具体见 [Loader API](https://webpack.js.org/api/loaders/)。

常使用的有：

* `this.callback`: 为了返回多个值，支持同步、异步调用
* `this.async`: 告诉 loader-runner 此 loader 会异步处理，返回 `this.callback`
* `this.cacheable`: 设置 loader 是否缓存（缓存有助于提升编译效率）
* `this.pitch`: 「从左到右」预执行的函数，可以根据某些条件动态调整 loader、传递参数等操作

比较方便的两个三方库：

* [loader-utils](https://www.npmjs.com/package/loader-utils): 提供很多 loader 的工具方法，比如 `getOptions` 获取 loader 的 `options` 配置。
* [schema-utils](https://www.npmjs.com/package/schema-utils): 做校验用的，比如对配置的 `options` 校验。

引用自定义的 loader：

```js
{
  test: /\.html$/,
  use: [
    {
      loader: path.resolve(__dirname, 'loaders/html-minify-loader.js'),
      options: {
        quotes: false, // 是否保留引号
        comments: true // 是否保留注释
      }
    }
  ]
}
```

`npm run build` 查看打包后的 `index.html`，对比源文件，可以看到注释被保留，并且删除了不必要的引号，以及空白符。

----

## 参考

1. https://webpack.js.org/contribute/writing-a-loader/
