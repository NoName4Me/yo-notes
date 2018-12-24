# Singleton Pattern

不同于静态类（或对象），因为它可以延迟初始化。

```js
// template
var mySingleton = (function () {
  var instance;
  
  function init () {
    var _privateValue = 'a private variable';
    var _privateMethod = function () {
      console.log('a private method called');
    };

    return {
      publicMethod: function () {
        console.log('a public method called.');
      },
      getPrivateThings: function () {
        _privateMethod();
        return _privateValue;
      }
    };
  }

  return {
    getInstance: function () {
      if(!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();
```

如何扩展（类似子类）呢？

```js
mySingleton.getInstance = function () {
  if (!this._instance) {
    if (isFoo()) {
      this._instance = new FooClass();
    } else {
      this._instance = new BasicClass();
    }
  }

  return this._instance;
}
```

**不要滥用哦，一般用在确实只需要一个实例的地方。**