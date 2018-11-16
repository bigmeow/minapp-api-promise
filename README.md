[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bigmeow/minapp-api-promise/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/bigmeow/minapp-api-promise.svg?branch=master)](https://travis-ci.org/bigmeow/minapp-api-promise)
[![npm](https://img.shields.io/badge/npm-0.1.0-orange.svg)](https://www.npmjs.com/package/minapp-api-promise)
[![NPM downloads](http://img.shields.io/npm/dm/minapp-api-promise.svg?style=flat-square)](http://www.npmtrends.com/minapp-api-promise)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/bigmeow/minapp-api-promise.svg)](http://isitmaintained.com/project/bigmeow/minapp-api-promise "Percentage of issues still open")

微信小程序所有API promise化，支持await、支持请求列队、支持拦截小程序所有API

## 特性

- 包装处理了小程序异步API，支持优雅的使用promise、async／await
- 突破小程序网络请求迸发10条以内的限制，超出的请求走队列
- 除了最常用的请求拦截器，支持拦截任意的小程序异步API
- 完美支持TypeScript
- 体积超小,开启GZIP后体积不到2kb


## 目录介绍

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

## 使用者指南
通过npm下载安装代码

```bash
$ npm i minapp-api-promise
```

如果你是webpack等环境

```js
import WXP from 'minapp-api-promise'
```

## 文档
- 待完善(https://github.com/bigmeow/minapp-api-promise/blob/master/doc/api.md)

## 更新日志
[CHANGELOG.md](https://github.com/bigmeow/minapp-api-promise/blob/master/CHANGELOG.md)

## 计划列表
[TODO.md](https://github.com/bigmeow/minapp-api-promise/blob/master/TODO.md)

