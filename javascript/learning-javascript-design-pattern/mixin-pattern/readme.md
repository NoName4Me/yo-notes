# Mixin Pattern

将一些可复用的函数组装到实例上的一种方便调用的模式，比如 `Vue.mixin()`，以及直接设置 `Vue.prototype.$axios = axios`，然后就可以在实例上直接 `this.$axios` 来调用。


示例（更多示例参考 [demo](./demo/script.js)：

```js
const Mixin = {
  sayHi() {
    console.log('hi~');
  }
}

function Person() { }

Person.prototype.sayHi = Mixin.sayHi;

new Person().sayHi();
```