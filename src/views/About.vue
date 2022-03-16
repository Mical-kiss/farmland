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

/* reduce实现map */
Array.prototype.map2 = function (callback, ctx = null) {
  if (typeof callback !== 'function') {
    throw('callback must be a function')
  }

  return this.reduce((result, cur, index, array) => {
    return  result.concat(callback.call(ctx, cur, index, array))
  }, [])
}

let arr = [ 1, 2 ]
let arr2 = arr.map2(function (it, i, array) {
  console.log(it, i, array, this)
  return it * 2
}, { name: '前端胖头鱼' })

console.log(arr2) 

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