class MpAPI {
    $interceptors: Map<string, ApiInterceptor> = new Map()

    /**
     * 注册一个拦截器
     * @param apiName 要拦截的api名称
     * @param interceptor 拦截器
     */
    intercept (apiName: string, interceptor: ApiInterceptor) {
      // TODO 校验拦截器名称是否存在
      this.$interceptors.set(apiName, interceptor)
    }
}

console.log(new MpAPI())

/**
 * API 拦截器
 */
interface ApiInterceptor {
    /** 拦截器拦截的api名称 */
    readonly apiName: string

    /** 准备调用API时的回调函数,如果返回false,则终止此次API调用;如果返回对象,则覆盖原来的api 配置 */
    config?(apiConfig: NativeApiConfigObject): WrapperApiConfigObject | false

    /** 在接口调用成功后,回调'success'函数前拦截 */
    success?(res: any): void;

    /** 接口调用失败后,回调'fail'函数前拦截 */
    fail?(res: any): void;

     /** 接口调用结束后,回调'complete'函数前拦截 */
    complete?(res: any): void;
}

/** 小程序原生API 配置对象 */
interface NativeApiConfigObject {
    [key: string]: any;

    /** 接口调用成功的回调函数 */
    success?: (res: any) => void;

    /** 接口调用失败的回调函数 */
    fail?: (res: wx.GeneralCallbackResult) => void;

    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: (res: wx.GeneralCallbackResult) => void;
}

/** 经过包装扩展的配置对象 */
interface WrapperApiConfigObject extends NativeApiConfigObject {

}
