const promise = new Promise((resolve) => {
  resolve('first resolve')
})

// 通过return 传递
// promise.then(res => {
//   console.log(res)
// })
//   .then(res => {
//     console.log(res)
//   })

// 通过return new promise
// promise.then((res) => {
//   return res
// }).then((res) => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(res)
//     }, 2000)
//   })
// }).then((res) => {
//   console.log(res) // 'first resolve'
// })
