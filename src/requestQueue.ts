/**
 * 管理请求队列
 */

import { RequestConfig } from '../index'
class RequestQueue {
    /** 最大请求迸发数，超出则放入队列 */
    protected _MAX_REQUEST = 10

    /** 等待执行的队列任务 */
    protected waitingTask: Array<string> = []

    /** 正在执行的队列任务 */
    protected runningTask: Array<string> = []

    /** 每次请求时，请求wx.request(config)中的config对象将会被存入此map中 */
    protected requestConfigMap: Map<string, RequestConfig> = new Map()

    /**
     * 设置最大请求数
     * @param MAX_REQUEST
     */
    setMaxRequest (MAX_REQUEST: number) {
      this._MAX_REQUEST = MAX_REQUEST
    }

    /**
     * 将新的客户端请求放入等待执行的队列末尾
     * @param requestConfig
     */
    push (requestConfig: RequestConfig) {
      // 默认以时间戳为taskId标志
      requestConfig.taskId = new Date().getTime().toString()
      // 确保新的taskId不会与现有的重复
      while ((this.waitingTask.indexOf(requestConfig.taskId) > -1 || this.runningTask.indexOf(requestConfig.taskId) > -1)) {
        requestConfig.taskId += Math.random() * 10 >> 0
      }
      this.waitingTask.push(requestConfig.taskId)
      this.requestConfigMap.set(requestConfig.taskId, requestConfig)
    }

    /**
     * 按队列顺序处理发起请求
     */
    next () :wx.RequestTask | void {
      if (this.waitingTask.length === 0) return
      // 确保执行中的队列任务不超过最大请求数
      if (this.runningTask.length < this._MAX_REQUEST - 1) {
        const willExecTaskId = this.waitingTask.shift() as string
        const requestConfig = this.requestConfigMap.get(willExecTaskId) as RequestConfig
        const oldComplete = requestConfig.complete
        requestConfig.complete = (...args) => {
          // 只有请求 complete 后才将taskId从执行中的队列任务中移除
          const willDeleteTaskIndex = this.runningTask.indexOf(willExecTaskId)
          if (willDeleteTaskIndex > -1) {
            this.runningTask.splice(willDeleteTaskIndex, 1)
            this.requestConfigMap.delete(willExecTaskId)
            oldComplete && oldComplete.apply(requestConfig, args)
            this.next()
          }
        }
        // 将等待执行的队列中task 排队 转移到 执行中的 队列,同时发起请求
        this.runningTask.push(willExecTaskId)
        return wx.request(requestConfig)
      }
    }

    /**
     * 发起请求
     * @param requestConfig
     */
    request (requestConfig: RequestConfig) {
      this.push(requestConfig)
      return this.next()
    }
}

export default new RequestQueue()
