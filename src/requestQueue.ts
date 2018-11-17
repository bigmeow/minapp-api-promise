/**
 * 管理请求队列
 */
export default class RequestQueue {
    /** 最大请求迸发数，超出则放入队列 */
    protected _MAX_REQUEST = 10

    /** 等待执行的队列任务 */
    protected waitingTask: Array<string> = []

    /** 正在执行的队列任务 */
    protected runningTask: Array<string> = []

    /** 每次请求时，请求wx.request(config)中的config对象将会被存入此map中 */
    protected requestConfigMap: Map<string, wx.RequestOption> = new Map()

    /**
     * 设置最大请求数
     * @param MAX_REQUEST
     */
    setMaxRequest (MAX_REQUEST: number) {
      this._MAX_REQUEST = MAX_REQUEST;
    }

    push (requestConfig: RequestConfig) {

    }

    next () {

    }

    request (requestConfig: RequestConfig) {

    }
}

interface RequestConfig extends wx.RequestOption  {
    /** 调度任务时的唯一标识 */
    taskId?: string
}
