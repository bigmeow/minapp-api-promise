# minapp-api-promise [![npm](https://img.shields.io/badge/npm-1.0.0-orange.svg)](https://www.npmjs.com/package/minapp-api-promise) [![Build Status](https://travis-ci.org/bigmeow/minapp-api-promise.svg?branch=master)](https://travis-ci.org/bigmeow/minapp-api-promise) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bigmeow/minapp-api-promise/blob/master/LICENSE)
微信小程序所有API promise化，支持await、支持请求列队.核心代码Fock自[wepy](https://github.com/Tencent/wepy)框架，我将之去依赖单独剥离


## 如何使用
***如果你为你的小程序代码配置了工作流环境（比如<code>webpack</code>），可以通过npm下载安装代码***
```bash
$ npm install minapp-api-promise --save
```
引入代码
```js
import WXP from 'minapp-api-promise'
```

***如果你没有使用任何脚手架，用官方提供的微信开发者工具开发，请拷贝项目<code>dist</code>目录下的<code>wxp.js</code>文件到你的项目目录***
引入代码
```js
import WXP from '项目相对路径/wxp'
```
或者
```js
var WXP = require('项目相对路径/wxp').default
```
具体你可以参照 [demo1](https://github.com/bigmeow/minapp-api-promise/demo/demo1),并且注意没有脚手架这种情况下你不能使用<code>async/await</code>,只能使用<code>then/catch</code>


<hr/>


***小程序原生用法:***
```js
onLoad () {
  wx.request({
    url: 'http://baidu.com',
    success: resp => {
      console.log('success信息:', resp)
    },
    fail: errorMesg => {
      console.log('fail信息:', errorMesg)
    },
    complete: resp => {
      console.log('complete一定会执行:', resp)
    }
  })
}
```

***使用了本库后的<code>async/await</code>写法:***
```js
async onLoad () {
  try {
    let resp = await WXP.request({
      url: 'http://baidu.com'
    })
    console.log('success信息:', resp)
  } catch (errorMesg) {
    console.log('fail信息:', errorMesg)
  } finally () {
    console.log('complete一定会执行')
  }
}
```

***你也可以使用<code>promise</code>的<code>then/catch</code>写法:***
```js
onLoad () {
  WXP.request({
    url: 'http://baidu.com'
  }).then(resp => {
    console.log('success信息:', resp)
  }).catch(errorMesg => {
    console.log('fail信息:', errorMesg)
  })
}
```

其他所有的微信小程序原生api(具备异步回调函数的api)使用方法同上