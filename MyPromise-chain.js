const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
function resolvePromise (promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 是否被调用
  let called = false
  // x为对象或者x为function
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      const then = x.then // throw error
      // 是否为函数
      if (typeof then === 'function') { // Promise
        then.call(x, (y) => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, (r) => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else { // 为一个值
    resolve(x)
  }
}

function isPromise (x) { // 校验是否是 promise
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    if (typeof x.then === 'function') {
      return true
    }
  }
  return false
}

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

        // 执行成功的回调函数
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

  // x 普通值 ｜ promise
  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    const promise2 = new MyPromise((resolve, reject) => {
    // 处于完成状态
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      // 处于拒绝状态
      if (this.status === REJECTED) {
        try {
          const x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }

      // 处理PENDING状态
      if (this.status === PENDING) {
      // 订阅的过程
        this.onFulfilleCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })

    return promise2
  }

  catch (errorCallback) {
    return this.then(null, errorCallback)
  }

  static all (promises) {
    return new Promise((resolve, reject) => {
      const results = []
      let idx = 0 // 执行个数
      // 处理每一个Promise返回的结果 并使用下表将其保存至结果
      const dealProcess = (val, index) => {
        results[index] = val
        if (++idx === promises.length) {
          resolve(results)
        }
      }
      promises.forEach((item, i) => {
        if (isPromise(item)) {
          // y: 每一个promise 返回的结果
          item.then(y => {
            dealProcess(y, i)
          }, reject)
        } else {
          dealProcess(item, i)
        }
      })
    })
  }

  static race (entries) {
    var Constructor = this // this 是调用 race 的 Promise 构造器函数。
    if (!Array.isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'))
      })
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject)
        }
      })
    }
  }
}

module.exports = MyPromise
