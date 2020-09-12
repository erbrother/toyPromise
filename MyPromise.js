const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor (executor) {
    // 当前状态
    this.status = PENDING
    // 正确时返回的值
    this.value = undefined
    // 错误时返回的值
    this.reason = undefined

    // 成功时的回调函数
    this.onFulfilleCallbacks = []
    // 失败时的回调函数
    this.onRejectedCallbacks = []

    // 改变当前promise状态 PENDING -> FULFILLED
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value

        this.onFulfilleCallbacks.forEach(fn => fn())
      }
    }

    // 改变当前promise状态 PENDING -> REJECTED
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
      }

      this.onRejectedCallbacks.forEach(fn => fn())
    }

    // 触发执行器
    try {
      executor(resolve, reject)
    } catch (e) {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = e
      }
    }
  }

  then (onFULFILLED, onRejected) {
    if (this.status === FULFILLED) {
      onFULFILLED(this.value)
    }

    if (this.status === REJECTED) {
      onRejected(this.reason)
    }

    // 处理PENDING状态
    if (this.status === PENDING) {
      // 订阅的过程
      this.onFulfilleCallbacks.push(() => {
        onFULFILLED(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

module.exports = MyPromise
