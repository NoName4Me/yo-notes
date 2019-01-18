const { SyncHook } = require("tapable");
const pluginName = 'MyPluginCreateEvent';

class MyPluginCreateEvent {
  constructor(options = {}) {
    this.options = options;
  }

  apply (compiler) {
    // 定义一个钩子
    compiler.hooks.naughtyEvent = new SyncHook(["who", 'what']);
    
    // compile 是一个同步钩子，通过 tap 监听
    compiler.hooks.compile.tap(pluginName, () => {
      // 广播自己的事件
      compiler.hooks.naughtyEvent.call(pluginName, 'is called');
    });
  }
}

module.exports = MyPluginCreateEvent;