import { RequestConfig } from '../index'
import noPromiseMethods from './noPromiseMethods'
import requestQueue from './requestQueue'
const native = {}
class WrapperAPI {
    $interceptors: Map<string, ApiInterceptor> = new Map()

    /**
     * 创建实例的工厂函数
     */
    static createInstance () {
      return new this()
    }

    /**
     * 注册一个拦截器（重复注册同一API的拦截器，后者将覆盖前者）
     * @param apiName 要拦截的api名称
     * @param interceptor 拦截器
     */
    intercept (apiName: string, interceptor: ApiInterceptor) {
      // 校验拦截器名称是否存在
      if (!native[apiName]) {
        throw new Error(`注册的'${apiName}'拦截器对应的API不存在！`)
      }
      this.$interceptors.set(apiName, interceptor)
      interceptor.apiName = apiName
    }

    $initAPI () {
      const _this = this
      // 遍历wx身上的所有API
      Object.keys(wx).forEach(apiName => {
        // 排除  名单中指定不支持promise的api名字、'on'开头的api、'off'开头的api、以及Sync微信本身支持的同步API
        if (!noPromiseMethods[apiName] &&  !(/^(on|off)/.test(apiName)) && !(/\w+Sync$/.test(apiName))) {
          Object.defineProperty(native, apiName, {
            get () {
              // promise化、拦截器注入
              return (apiConfig: WrapperApiConfigObject = {}) => {
                const interceptItem = _this.$interceptors.get(apiName)
                // config拦截
                if (interceptItem && typeof interceptItem.config === 'function') {
                  const returnApiConfig = interceptItem.config.call(_this, apiConfig)
                  if (returnApiConfig === false) {
                    return Promise.reject(new Error('aborted by interceptor'))
                  }
                  apiConfig = returnApiConfig
                }
                // request 特殊处理，兼容 wx.request(url) 的写法
                if (apiName === 'request' && typeof apiConfig === 'string') {
                  apiConfig = { url: apiConfig }
                }
                // 其它情况下api配置传字符串，直接掉小程序原本的api并返回，这里不做额外处理
                if (typeof apiConfig === 'string') {
                  return wx[apiName](apiConfig)
                }

                // wx.request、wx.uploadFile、wx.downloadFile api的句柄
                let task
                const promise: WrapperAPIPromise = new Promise((resolve, reject) => {
                  ['fail', 'success', 'complete'].forEach(callbackName => {
                    apiConfig[callbackName] = res => {
                      // 注入'fail', 'success', 'complete' 拦截器
                      if (interceptItem && interceptItem[callbackName]) {
                        res = interceptItem[callbackName].call(_this, res)
                      }
                      if (callbackName === 'success') {
                        resolve(res)
                      } else if (callbackName === 'fail') {
                        reject(res)
                      }
                    }
                  })
                  // request 特殊处理下请求队列
                  if (apiName === 'request') {
                    task = requestQueue.request(apiConfig as RequestConfig)
                  } else {
                    task = wx[apiName](apiConfig)
                  }
                })

                if (apiName === 'uploadFile' || apiName === 'downloadFile') {
                  promise.progress = (cb) => {
                    task && task.onProgressUpdate(cb)
                    return promise
                  }
                  promise.abort = (cb) => {
                    cb && cb()
                    task && task.abort()
                    return promise
                  }
                }
                return promise
              }
            }
          })
        } else {
          // 被排除的不支持promise化的API 直接拷贝到新的native包装对象上
          Object.defineProperty(native, apiName, {
            get () { return (...args) => wx[apiName].apply(wx, args) }
          })
        }
        // 拷贝到实例身上
        this[apiName] = native[apiName]
      })
    }
}

const wxp = WrapperAPI.createInstance()
wxp.$initAPI()
export default wxp

/**
 * API 拦截器
 */
export interface ApiInterceptor {
    /** 拦截器拦截的api名称,自动注入 */
    apiName?: string

    /** 准备调用API时的回调函数,如果返回false,则终止此次API调用;如果返回对象,则覆盖原来的api 配置 */
    config?(apiConfig: WrapperApiConfigObject): WrapperApiConfigObject | false

    /** 在接口调用成功后,回调'success'函数前拦截 */
    success?(res: any): void;

    /** 接口调用失败后,回调'fail'函数前拦截 */
    fail?(res: any): void;

     /** 接口调用结束后,回调'complete'函数前拦截 */
    complete?(res: any): void;
}

/** 经过包装扩展的小程序原生API配置对象 */
interface WrapperApiConfigObject {
    [key: string]: any;

    /** 接口调用成功的回调函数 */
    success?: (res: any) => void;

    /** 接口调用失败的回调函数 */
    fail?: (res: wx.GeneralCallbackResult) => void;

    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: (res: wx.GeneralCallbackResult) => void;
}

interface WrapperAPIPromise extends Promise<WrapperAPIPromise> {
  progress?(cb: () => void): Promise<WrapperAPIPromise>
  abort?(cb?: () => void): Promise<WrapperAPIPromise>
}
