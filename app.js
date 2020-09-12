const MyPromise = require('./MyPromise-chain')

const promise1 = new MyPromise((resolve, reject) => {
  resolve('Promise1')
})

const promise2 = promise1
  .then(value => {
    console.log(value)
    // return new Error('error')
    // return Promise.resolve('Promise resolve')
    // return 'Then promise'
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(new MyPromise((resolve, reject) => {
          resolve('new Promise')
        }))
      }, 2000)
    })
  })

promise2.then(value => {
  console.log('value: ', value)
}, reason => {
  console.log('Reason: ', reason)
})
