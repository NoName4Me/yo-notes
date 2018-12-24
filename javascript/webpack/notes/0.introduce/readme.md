# 0. webpack 是什么

## 概念

它就是一个模块打包工具，支持不限于 web 开发的资源打包（比如 js、css、html）。

webpack 是基于模块来运行的，它根据用户提供的入口，遍历所有引用依赖，生成一个模块依赖图(这个图里除了 webpack 本身支持的 js、json 文件外，还可以是其它非代码资源，如图片、字体等模块)，然后根据配置（规定 webpack 应该怎么处理不同的资源）生成目标文件。

## 实战

执行 `npm run build` 会看到类似下面的输出

```bash
$ npm run build
Hash: 91335fe48b6a1877f067
Version: webpack 4.28.4
Time: 260ms
Built at: 2019-01-14 15:12:45
  Asset        Size  Chunks             Chunk Names
main.js  1000 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js 37 bytes {0} [built]
[1] ./src/say-hi.js 48 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
```

webpack 默认解析 `./src/` 目录，输出 `/dist/main.js`，默认 `mode` 是 `"production"`。

## webpack 模块加载原理

查看 `./dist/main.js`，可以看到里面被 uglify 了，为了了解一下 webpack 模块加载原理，我们将 `packge.json` 中的 `build` 的配置修改为 `webpack --mode development`，再次执行 `npm run build` 查看 `./dist/main.js`。

可以看到整体就是一个 IIFE（立即执行函数表达式）:

```js
(function(modules){
  // do something
})()
```

入参（以此工程为例）: 

```js
{
  './src/index.js': function(module, exports, __webpack_require__) { /* eval(该文件内容) */ },
  './src/say-hi.js': function(module, exports, __webpack_require__) { /* eval(该文件内容) */ }
}
```

嗯，出现了一个新东西 `__webpack_require__`，继续查看 IIFE 的定义，这个函数会执行入参对象的键值函数（即 eval），如果 有引用其它文件，则 eval 里还会调用 `__webpack_require__`，从而递归的加载所有引用文件。

```js
function __webpack_require__(moduleId) {
	// Check if module is in cache
	if(installedModules[moduleId]) {
		return installedModules[moduleId].exports;
	}
	// Create a new module (and put it into the cache)
	var module = installedModules[moduleId] = {
		i: moduleId,
		l: false,
		exports: {}
	};
	// Execute the module function
	modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	// Flag the module as loaded
	module.l = true;
	// Return the exports of the module
	return module.exports;
}
```

在 IIFE 的最后一行是入口调用，从而一层层激活所有的模块加载。

```js
return __webpack_require__(__webpack_require__.s = "./src/index.js");
```

IIFE 还做了兼容各种模块引用方式，比如 ES2015 模块引用方式。
