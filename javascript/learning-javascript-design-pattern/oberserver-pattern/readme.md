# Observer Pattern

```
       <---- add ----
Subject             Observer(update)
       --- notify --->
```

* Subject：主题，维护一个观察者列表，当状态改变时，触发 `notify`，它会调用 Observer 提供的  `update` 方法，并传递数据
* Observer：观察者


这种模式要求观察者必须统一实现一个 `update` 方法供 `Subject` 去调用，这里就出现了强耦合。
