<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
    <h1>This is an about page</h1>
  </div>
</template>

<script>
/* 节流 input框请求 */
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      // fn(...args) // undefined
      fn.apply(this, ...args) // document
    }, delay)
  }
}
/* 节流 滚动监听 */
function throttle(fn, delay) {
  let last = 0
  return function(...args) {
    let now = Date().now()
    if (now - last > delay) {
      fn.apply(...args)
      last = now
    }
  }
}

/* 深拷贝 */
function deepClone(obj, cache = new WeakMap) {
  if (obj === null || typeof obj !== 'object') return obj
  if (cache.get(obj)) return obj // 防止循环引用进入死循环

  let cloneObj = new obj.constructor()
  cache.set(obj, cloneObj)

  for (let key in obj) {
    cloneObj[key] = deepClone(obj[key], cache)
  }
  return cloneObj
}

/* 并发控制 */
function limitRequest(urls= [], limit = 2) {
  return new Promise(resolve => {
    const len = urls.length
    let count = 0
    while(limit > 0) {
      start()
      limit--
    }
    function start() {
      console.log(urls, urls.unshift())
      count++
      setTimeout(() => {
        if (count === len) resolve(true)
        else {
          start()
        }
      }, 1000)
    }
  })
}

/* 数组去重 */
function setArr(arr) {
  let newArr = []
  arr.forEach(item => {
    if (!newArr.includes(item)) newArr.push(item)
  })
  return newArr
}
/* 参数解构 */
// const urlSearchParams = new URLSearchParams('a=1&b=2').entries()
// for (let i of urlSearchParams) {
//   console.log(i)
// }
// const params = Object.fromEntries(urlSearchParams)
// console.log(params)

/* 事件总线|发布订阅 */
class EventEmitter {
  constructor() {
    this.cache = {}
  }
  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn)
    } else {
      this.cache[name] = [fn]
    }
  }
  off(name, fn) {
    if (this.cache[name]) {
      this.cache[name] = this.cache[name].filter(item => {
        item !== fn
      })
    }
  }
  emit(name) {
    if (this.cache[name]) {
      this.cache[name].forEach(item => {
        item()
      })
    }
  }
  once(name, fn) {
    function tmpFn () {
      fn()
      this.off(name, tmpFn)
    }
    this.on(name, tmpFn)
  }
}

/* Promise */
class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = null // 成功原因
    this.reason = null // 失败原因
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
}
new Promise((resolve) => {
  setTimeout(() => { 
    // resolve一个thenable对象，则会调用then方法并传递resolve
    resolve({
      then(resolve) {
        resolve(3)
        return 123
      },
      a: 222
    })
   }, 1000)
}).then(res => {
  console.log(111, res)
})
Promise.myResolve = function (value) {
  if (value && typeof value === 'object' && (value instanceof Promise)) {
    return value
  }
  return new Promise((resolve) => {
    resolve(value)
  })
}
Promise.myReject = function (value) {
  return new Promise((_, reject) => {
    reject(value)
  })
}
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const len = promises.length
    let count = 0
    let result = []
    promises.forEach((p, i) => {
      Promise.resolve(p).then(res => {
        count++
        result[i] = res
        if (count === len) resolve(resolve)
      }).catch(reject)
    })
  })
}
Promise.allSettled = function (promises) {
  return new Promise((resolve) => {
    const len = promises.length
    let count = 0
    let result = []
    promises.forEach((p, i) => {
      Promise.resolve(p).then(res => {
        count++
        result[i] = {
          status: 'fulfilled',
          value: res
        }
      }).catch(err => {
        count++
        result[i] = {
          status: 'rejected',
          reason: err
        }
      }).finally(() => {
        if (count === len) resolve(resolve)
      })
    })
  })
}
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve, reject)
    })
  })
}
const p4 = {
  then (resolve) {
    setTimeout(() => resolve(4), 1000)
  }
}
console.log(Promise.myResolve(p4))

Array.prototype.map2 = function (callback, ctx = null) {
  if (typeof callback !== 'function') {
    throw('callback must be a function')
  }
  return this.reduce((result, cur, index, array) => {
    return result.concat(callback.call(ctx, cur, index, array))
  }, [])
}
Array.prototype.map3 = function (callback, ctx = null) {
  if (typeof callback !== 'function') {
    throw('callback must be a function')
  }
  let newArr = []
  for (let i; i < this.length; i++) {
    newArr.push(callback.call(ctx, this[i], i, this))
  }
  return newArr
}


export {
  debounce,
  throttle,
  deepClone,
  limitRequest,
  setArr,
  EventEmitter,
  MyPromise
}
export default {
  data() {
    return {}
  },
  created() {}
}
</script>