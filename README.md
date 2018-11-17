[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bigmeow/minapp-api-promise/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/bigmeow/minapp-api-promise.svg?branch=master)](https://travis-ci.org/bigmeow/minapp-api-promise)
[![npm](https://img.shields.io/badge/npm-1.0.2-orange.svg)](https://www.npmjs.com/package/minapp-api-promise)
[![NPM downloads](http://img.shields.io/npm/dm/minapp-api-promise.svg?style=flat-square)](http://www.npmtrends.com/minapp-api-promise)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/bigmeow/minapp-api-promise.svg)](http://isitmaintained.com/project/bigmeow/minapp-api-promise "Percentage of issues still open")
[![JS Gzip Size](http://img.badgesize.io/https://unpkg.com/minapp-api-promise@1.0.2/dist/wxp.min.js?compression=gzip&style=flat-square&label=JS%20gzip%20size)](https://unpkg.com/minapp-api-promise@1.0.2/dist/wxp.min.js)

:hammer: 微信小程序所有API promise化，支持await、支持请求列队、支持拦截小程序所有API

## :star: 特性

- 包装处理了小程序异步API，支持优雅的使用promise、async／await
- 突破小程序网络请求迸发10条以内的限制，超出的请求走队列
- 除了最常用的请求拦截器，支持拦截任意的小程序异步API
- 完美支持TypeScript
- 体积超小,开启GZIP后体积不到2kb,用老罗的话说就是'野蛮功能，腼腆体积'


## :open_file_folder: 目录介绍

```
.
├── demo 使用demo
├── dist 编译产出代码
├── doc 项目文档
├── src 源代码目录
├── test 单元测试
├── typings typescript声明
├── CHANGELOG.md 变更日志
└── TODO.md 计划功能
```

## :cd: 安装

```bash
$ npm i minapp-api-promise
```

## :rocket: 使用

```js
import wxp from 'minapp-api-promise'

// you can use ‘promise’
wxp.request(config).then(fn).catch(fn)

// and you can use 'async/await'
async function getWxCode () {
 const { code } = await wxp.login()
}
```

## :bookmark_tabs: 文档
- 待完善(https://github.com/bigmeow/minapp-api-promise/blob/master/doc/api.md)

## :gear: 更新日志
[CHANGELOG.md](https://github.com/bigmeow/minapp-api-promise/blob/master/CHANGELOG.md)

## :airplane: 计划列表
[TODO.md](https://github.com/bigmeow/minapp-api-promise/blob/master/TODO.md)

## :two_men_holding_hands: THANKS
感谢 [@颜海镜](https://github.com/yanhaijing) 提供的脚手架模板

