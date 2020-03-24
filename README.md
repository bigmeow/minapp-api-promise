# minapp-api-promise
[![npm](https://img.shields.io/badge/npm-1.0.2-orange.svg)](https://www.npmjs.com/package/minapp-api-promise) [![Build Status](https://travis-ci.org/bigmeow/minapp-api-promise.svg?branch=master)](https://travis-ci.org/bigmeow/minapp-api-promise) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bigmeow/minapp-api-promise/blob/master/LICENSE)
[![JS Gzip Size](http://img.badgesize.io/https://unpkg.com/minapp-api-promise@1.0.2/dist/wxp.min.js?compression=gzip&style=flat-square&label=JS%20gzip%20size)](https://unpkg.com/minapp-api-promise@1.0.2/dist/wxp.min.js)

微信小程序所有API promise化，支持await、支持请求列队.核心代码Fock自[wepy](https://github.com/Tencent/wepy)框架，我将之去依赖单独剥离


微信官方小程序基础库2.10.2版本起，所有异步api均支持返回promise,大家可以抛弃框架了


## 如何使用
***如果你为你的小程序代码配置了工作流环境（比如<code>webpack</code>），可以通过npm下载安装代码***
```bash
$ npm install minapp-api-promise --save
```
引入代码
```js
import WXP from 'minapp-api-promise'
```

***如果你没有使用任何脚手架，用官方提供的微信开发者工具开发，请拷贝项目<code>dist</code>目录下的<code>wxp.js</code>文件到你的项目目录***
引入代码
```js
import WXP from '项目相对路径/wxp'
```
或者
```js
var WXP = require('项目相对路径/wxp').default
```
具体你可以参照 [demo1](https://github.com/bigmeow/minapp-api-promise/tree/master/demo/demo1),并且注意没有脚手架这种情况下你不能使用<code>async/await</code>,只能使用<code>then/catch</code>


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

### 进阶说明

### interceptor 拦截器
可以使用全局拦截器对原生API接口进行拦截<br/>
⚠️注意：这里不仅仅局限于Http请求的拦截！<br/>
比如某些页面需要登录才能看,我们可以拦截路由，在跳转前判断跳转的页面是否需要登录：
```js
WXP.intercept('navigateTo', {
  config (config) {
    console.log('路由跳转前需要处理的事情')
    if (页面没有权限) {
      // 返回false 后，就不会再执行跳转轻轻
      return false;
    }
    return config;
  }
})
// 这样调用就会进入拦截
WXP.navigateTo(配置);
```
比如某些API请求需要在请求头带上token。
参考示例(拦截小程序发起的原生请求)：
```js
import WXP from 'minapp-api-promise'

WXP.intercept('request', {

  // 发出请求时的回调函数
  config (playload) {
    // 对所有request请求中的OBJECT参数对象统一附加时间戳属性
    playload.timestamp = +new Date();
    console.log('request before config: ', playload);
    // 必须返回OBJECT参数对象，否则无法发送请求到服务端
    return playload;
  },

  // 请求成功后的回调函数
  success (resp) {
    // 可以在这里对收到的响应数据对象进行加工处理
    console.log('request success: ', resp);
    // 必须返回响应数据对象，否则后续无法对响应数据进行处理
    return resp
  },

  //请求失败后的回调函数
  fail (resp) {
    console.log('request fail: ', resp);
    // 必须返回响应数据对象，否则后续无法对响应数据进行处理
    return resp;
  },

  // 请求完成时的回调函数(请求成功或失败都会被执行)
  complete (resp) {
    console.log('request complete: ', resp);
  }

})
```


#### 顺手附上一个实际项目中的使用示例：
<code>requestIntercept.js</code>
```js
/*
 * @description: 网络请求拦截器（注意拦截器中的this是指向minapp-api-promise实例本身）
 * @Author: bigmeow
 * @Date: 2018-03-26 15:59:42
 */
export default{
  // 发出请求时的回调函数
  config (config) {
    // 请求前设置token
    const globalData = getApp().globalData
    if (globalData.auth && globalData.auth.token) {
      config.header = {
        Authorization: globalData.auth.token
      }
    }
    return config
  },

  // 请求成功后的回调函数
  async success (resp) {
    this.hideLoading()
    let errorMesg = ''
    // 可以在这里对收到的响应数据对象进行加工处理
    switch (resp.statusCode) {
      case 200:
        console.log('正常请求')
        break
      case 401:
        console.log('未登陆,拦截重定向登陆界面')
        await this.redirectTo({
          url: 'login'
        })
        break
      case 403:
        console.log('未授权接口,拦截')
        this.showModal({
          title: '警告',
          content: (resp.data.error && (resp.data.error.details || resp.data.error.message)) || '无权请联系管理员',
          confirmText: '我知道了',
          showCancel: false
        })
        throw new Error(errorMesg)
      case 500:
      case 502:
        errorMesg = (resp.data.error && (resp.data.error.details || resp.data.error.message)) || '服务器出错'
        break
      case 503:
        errorMesg = '哦～服务器宕机了'
        break
    }
    if (errorMesg.length > 0) {
      this.showToast({
        title: errorMesg,
        icon: 'none'
      })
      throw new Error(errorMesg)
    }
    return resp
  },

  fail (resp) {
    this.hideLoading()
    this.showToast({
      title: '网络连接失败',
      icon: 'none'
    })
  }
}

```

<code>页面.js</code>引入
```js
import wxp from 'minapp-api-promise'
import requestIntercept from '相对目录/requestIntercept'
// 注册请求拦截器
wxp.intercept('request', requestIntercept)
```

### 注意
- 某些古老设备不支持Promise对象，需要自行引入promise-polyfill库进行兼容;
- 使用async/await语法糖，需要webpack配合babel插件将之转换成es5语法

