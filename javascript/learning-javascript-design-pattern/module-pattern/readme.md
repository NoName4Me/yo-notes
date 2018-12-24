# module pattern

```js
// template
var myNamespace = (function () {
  var _myPrivateValue, myPrivateMethod;

  _myPrivateValue = 1; // 私有标志： 下划线开头
  _myPrivateMethod = function (foo) {
    console.log(foo);
  }

  return {
    myPublicValue: 'bar',
    myPublicMethod: function (bar) {
      _myPrivateValue ++;
      _myPrivateMethod(bar);
    }
  };

})()

// 调用
myNamespace.myPublicMethod('hi'); // print 'hi'
myPublicMethod.myPublicValue; // 'bar'

// 扩展
var myNamespace2 = (function (nameSpace) {
  nameSpace.extentions = function() {};
})(myNamespace || {});
```

优点：

* 对面向对象的开发者来讲会更友好？
* 只有公共成员能访问到私有域。

缺点：

* 一旦要修改可见性，可能会要修改很多地方的代码
* 后来（对象创建后）给对象添加的方法无法访问到私有域
* 不便于扩展和测试（公共成员会依赖于可能有 bug 的私有方法）

## Revealing Module Pattern

只是一种更清晰组织代码结构的模式。

```js
var myNamespace = (function () {
  var _myPrivateValue = 1; // 私有标志： 下划线开头
  var _myPrivateMethod = function (foo) {
    console.log(foo);
  }

  var myPublicMethod = function (bar) {
    _myPrivateValue ++;
    _myPrivateMethod(bar);
  }

  return {
    publicMethod: myPublicMethod
  };

})()


```