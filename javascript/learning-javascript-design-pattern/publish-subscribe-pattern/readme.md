# Publish Subscribe Pattern

```
          eventBus
         //      \\
 publish /        \ subscribe
  Publisher      Subscriber
```

与「观察者模式」不同，它只需要订阅者递交一个回调，当关注的主题状态变化时，发布者会自动调用回调，这样主题和关注者就分离开来了。

事件委托就是最常用的场景之一。
