# 2. webpack-dev-server(WDS)

## 概念

可以通过 `npm run build -- --watch` 开启 watch 模式监听文件修改，然后重新自动编译。WDS 不仅包含监听模式，它还能提供更多功能。

* 它运行在内存中，意味着看不到编译打包文件
* 启动一个本地服务
* 自动刷新页面（结合「热更新」提高开发效率）

## 实战

安装 WDS `npm i webpack-dev-server -D`

package.json 增加脚本：`"start": "webapck-dev-server --mode development"`

启动 `npm run start`，访问 `http://localhost:8080/`（可能有所不同，以终端输出为准）。

修改一下代码，会看到有重新编译，以及页面被刷新（类似F5）可以通过传入 `--hot` 来开启热加载（如果是通过设置配置文件中 `webServer` 的 `hot` 属性，还需配合 `webpack.HotModuleReplacementPlugin` 才能开启）。

为了进一步提升开发效率，当webpack的配置文件有修改时，借助 [nodemon](https://www.npmjs.com/package/nodemon) 自动重启，并修改脚本 `"start": "nodemon --watch webpack.config.js --exec \"webpack-dev-server --color --mode development\""`。


有时端口会有占用问题，可以使用 [portfinder](https://www.npmjs.com/package/portfinder) 自动获取可用端口，以及使用 [my-local-ip](https://www.npmjs.com/package/my-local-ip) 获取本地 IP。


## `before / after` 和 `proxy`

借助 `before / after` 配置可以在其它所有中间件执行前（后）被调用，比如一个简单的 mock：

```js
devServer: {
  before: function(app, server) {
    app.get('/some/path', function(req, res) {
      res.json({ custom: 'response' });
    });
  }
}
```

`proxy` 其实就是一个内置在 WDS 中的中间件 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)，可以通过它实现跨域、代理外部请求、mock 等功能，官网的一个区分获取 html 文件和请求接口的例子：

```js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // 注意这里是另一个服务，不是当前 WDS 的
      bypass: function(req, res, proxyOptions) {
        if (req.headers.accept.indexOf('html') !== -1) {
          console.log('Skipping proxy for browser request.');
          return '/index.html';
        }
      }
    }
  }
}
```

「**注意**」只有像 `http://localhost:8080/xxx` 这种请求才会被代理（`localhost:8080` 是 DWS 访问地址）。

其它更多关于 DWS 可以参阅[官方 DOC](https://webpack.js.org/configuration/dev-server/)。