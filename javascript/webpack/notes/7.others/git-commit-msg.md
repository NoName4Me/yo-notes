# Git 提交信息规范


## Angular 标准模板

* 提交规范化

```shell
npm install -D commitizen cz-conventional-changelog

```

`package.json` 增加：

```json
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
}
```

配置启动脚本: `"cm": "git-cz"`，然后就可以通过 `npm run cm` 开始填写提交信息并提交了。

* 提交信息规范检查

```shell
npm i -D @commitlint/config-conventional @commitlint/cli
```

```json
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAM"
  }
}
```

**⚠️注意** 这里有个坑，如果提示没有 `HUSKY_GIT_PARAM`，可以换用这个脚本 `cat .git/COMMIT_EDITMSG | commitlint`。

## 自定义模板

* 提交规范化

```bash
npm i -D commitizen cz-customizable
```

`package.json` 增加：

```json
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  },
  "cz-customizable": {
    "config": ".cz-config.js"
  }
}
```

新建自定义配置文件 `.cz-config.js`，DOC 见[cz-customizable](https://github.com/leonardoanalista/cz-customizable)，下面提供一个参考：

```js
'use strict';

module.exports = {

  types: [
    {value: 'feat',     name: 'feat:     新特性'},
    {value: 'fix',      name: 'fix:      bug 修复'},
    {value: 'docs',     name: 'docs:     文档相关'},
    {value: 'style',    name: 'style:    格式等无关代码意义的修改'},
    {value: 'refactor', name: 'refactor: 重构'},
    {value: 'perf',     name: 'perf:     性能提升'},
    {value: 'test',     name: 'test:     增加测试用例'},
    {value: 'revert',   name: 'revert:   回退'},
    {value: 'WIP',      name: 'WIP:      还在开发，待续'}
  ],

  scopes: [
    { name: '公共' },
    { name: '模块1' },
    { name: '模块2' }
  ],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  //*/
  // override the messages, defaults are as follows
  messages: {
    type: '请选择本次提交的类型:',
    scope: '\n选择本次修改的模块:',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: '本次修改简要说明:\n',
    body: '详细说明，用 "|" 来表示换行(非必填):\n',
    breaking: '重大改动点(非必填):\n',
    footer: '本次提交需要关闭的 issue(非必填)，比如: #31, #34:\n',
    confirmCommit: '确认以上信息咩 ^__^?'
  },

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix', 'refactor'],

  // limit subject length
  subjectLimit: 100
};
```

* 提交信息规范检查

```shell
npm i -D commitlint-config-cz @commitlint/cli
```

增加校验配置文件 `commitlint.config.js`，参考如下：

```js
module.exports = {
  extends: ['cz'],
  rules: {
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'revert',
        'WIP'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        '公共',
        '模块1',
        '模块2'
      ]
    ]
  }
}

```

## 参考

1. [优雅的提交你的 Git Commit Message](https://zhuanlan.zhihu.com/p/34223150)
