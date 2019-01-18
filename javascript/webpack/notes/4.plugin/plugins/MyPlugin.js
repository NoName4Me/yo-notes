const pluginName = 'MyPlugin';

class MyPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply (compiler) {
    // 监听自定义事件
    compiler.hooks.naughtyEvent.tap(pluginName, (who, what) => {
      console.log(`****** ${pluginName} received data: [ ${who} ${what} ] ******`);
    });
  }
}

module.exports = MyPlugin;
