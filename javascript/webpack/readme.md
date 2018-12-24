# Webpack Learning Notes

[![](https://img.shields.io/badge/webpack-v4-1a6bac.svg)](https://webpack.js.org)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## 使用

`npm run boot` 安装依赖包（无需在每一个子项目里执行 `npm i`）。

`npm run add` 为某个子项目增加依赖，比如 `npm run add file-loader webpack/1.overview -- -D`。

`npm run build` 为所有子项目执行 build。

具体操作和说明可以参考每个子项目的「README」。

## 目录

[0. webpack 介绍](./notes/0.introduce/)

[1. webpack 概览](./notes/1.overview/)

[2. 配置开发环境](./notes/2.dev-server/)

[3. 常见 loader 介绍以及写一个自己的 loader](./notes/3.loader/)

[4. 常见 plugin 介绍以及写一个自己的 plugin](./notes/4.plugin/)

[5. webpack 打包优化](./notes/5.optimize/)

[6. 项目规范(lint、测试)](./notes/6.lint-test/)

[7. 项目规范(其它)](./notes/7.others/)
