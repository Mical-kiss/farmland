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
import { twoSum } from './about.js'
console.log(100, twoSum([1, 2, 7, 4], 5))


/* 防抖 input框请求 */
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
    let now = Date.now()
    if (now - last > delay) {
      fn.apply(...args)
      last = now
    }
  }
}

/* 深拷贝 */
function deepClone(obj, cache = new WeakMap()) {
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
function promiseLimitExecute(limit = 2) {
  const queueList = []
  let taskNum = 0
  return function (p) {
    function fn () {
      setTimeout(() => {
        p()
        taskNum--
        if (taskNum < limit && queueList.length) queueList.unshift()()
      }, 1000)
    }
    if (taskNum < limit) {
      taskNum++
      fn()
    } else {
      queueList.push(fn)
    }
  }
}

/* 数组去重 */
function uniqueArr (arr) {
  let tmpObj = {}
  return arr.filter(item => {
    return tmpObj[item] ? false : tmpObj[item] = true
  })
}

function uniqueArr1 (arr) {
  // [1, 2, 3, 1, 1, 2]
  var hash=[]
  for (var i = 0; i < arr.length; i++) {
    for (var j = i+1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        ++i
        j = i
      }
    }
    hash.push(arr[i])
  }
  return hash;
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
const urlSearchParams = new URLSearchParams('a=1&b=2').entries()
for (let i of urlSearchParams) {
  console.log(i)
}
const params = Object.fromEntries(urlSearchParams)
console.log(params)


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
  emit(name, ...rest) {
    if (this.cache[name]) {
      this.cache[name].forEach(item => {
        item.call(this, ...rest)
      })
    }
  }
  once(name, fn) {
    const tmpFn = function() {
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
/* new Promise((resolve) => {
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
}) */
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
        if (count === len) resolve(result)
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
        if (count === len) resolve(result)
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
/* new实现 1、创建新对象 2、将新对象的__proto__指向构造函数的原型对象 3、将this指向这个新对象，并执行构造函数 4、返回这个新对象*/
function myNew (fn, ...args) {
  let obj = Object.create(fn.prototype)
  let res = fn.call(obj, ...args)
  if (res && (typeof res === 'object') || typeof res === 'function') {
    return res
  }
  return obj
}

/* 实现Object.create, 用于完善“组合式继承”的“寄生式组合继承” */
/* 继承：子组件的原型对象及prototype属性，指向父组件的实例 */
Object.myCreate = function (proto) {
  function F() {}
  F.prototype = proto
  return new F()
}
// subType.prototype = Object.create(superType.prototype)
// subType.prototype.constructor = subType

/* 实现instanceof */
function myInstanceof (target, right) {
  // eslint-disable-next-line no-constant-condition
  if (typeof target !== "object" || target === null) return false;
  if (typeof origin !== "function")
    throw new TypeError("origin must be function");
  let proto = Object.getPrototypeOf(target); // 相当于 proto = target.__proto__;
  while (proto) {
    if (proto === null) {
      return false
    }
    if (proto === right.prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
}

/* Reflect对象上可以拿到语言内部的方法，如Reflect.defineProperty、Reflect.deleteProperty，并且无法定义的属性会返回false，让Object对象的操作从命令式完全转化为函数式 */

/* call, apply, bind实现 */
Function.prototype.myCall = function (context, ...args) {
  if (!context || context === null) context = window
  let fn = Symbol()
  context[fn] = this
  return context[fn](...args)
}
Function.prototype.myApply = function (context, args) {
  if (!context || context === null) context = window
  let fn = Symbol()
  context[fn] = this
  return context[fn](...args)
}
Function.prototype.myBind = function (context, ...args) {
  if (!context || context === null) context = window
  let fn = Symbol()
  context[fn] = this
  let _this = this
  const result = function (...innerArgs) {
    // 但还有一个问题，bind 有以下一个特性：
    // 一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器，提供的 this 值被忽略，同时调用时的参数被提供给模拟函数
    if (this instanceof _this === true) {
      this[fn] = _this
      this[fn](...[...args, ...innerArgs])
    } else {
      context[fn](...[...args, ...innerArgs])
    }
  }
  result.prototype = Object.create(this.prototype)
  return result
  /* let self = this
  return function (...args1) {
    return self.apply(context, args.concat(args1))
  } */
}
/* 数组map方法实现 */
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
/* setTimeout实现setInterval */
function myTimeout(fn, t) {
  let timer = null
  function interval () {
    fn()
    timer = setTimeout(interval, t)
  }
  interval()
  return {
    cancel: () => {
      clearTimeout(timer)
    }
  }
}
/* 数组扁平 */
function flatter (arr) {
  if (!arr.length) return []
  /* return arr.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, flatter(cur)] : [...pre, cur]
  }, []) */
  let tmpList = []
  arr.forEach(item => {
    tmpList = tmpList.concat(Array.isArray(item) ? flatter(item) : item)
  })
  return tmpList
}

/* lazyMan */
class LazyMan {
  constructor (name) {
    this.tasks = []
    const task = () => {
      console.log(`Hi! This is ${name}`)
      this.next()
    }
    this.tasks.push(task)
    setTimeout(() => {
      this.next()
    }, 0)
  }
  next () {
    const task = this.tasks.shift()
    task && task()
  }
  sleep (time) {
    this._sleepWrapper(time, false)
    return this
  }
  _sleepWrapper (time, first) {
    const task = () => {
      setTimeout(() => {
        this.next()
      }, time)
    }
    if (first) {
      this.tasks.unshift(task)
    } else {
      this.tasks.push(task)
    }
  }
  eat (name) {
    const task = () => {
      console.log(`Eat ${name}`)
      this.next()
    }
    this.tasks.push(task)
    return this
  }
}
// (new LazyMan('zwj')).sleep(1000).eat('full')

/* 判断循环引用 */
function cycleDetector (obj) {
  const arr = [obj]
  function cycleJudge(obj) {
    const keys = Object.keys(obj)
    return keys.some(item => {
      if (typeof obj[item] === 'object' && obj[item] !== null) {
        if (arr.includes(obj[item])) return true
        arr.push(obj[item])
        return cycleJudge(obj[item])
      }
    })
  }
  return cycleJudge(obj)
}
var obj = {
    a: {},
    b: 1
}
obj.a.c= obj
console.log(cycleDetector(obj))

/* 树形结构 */
function transTree (data, pid) {
  function getChildren(data, result, pid) {
    for (const item of data) {
      if (item.pid === pid) {
        const newItem = {...item, children: []};
        result.push(newItem);
        getChildren(data, newItem.children, item.id);
      }
    }
  }
  const result = [];
  getChildren(data, result, pid)
  return result;
}

export {
  debounce,
  throttle,
  deepClone,
  limitRequest,
  promiseLimitExecute,
  setArr,
  EventEmitter,
  MyPromise,
  myNew,
  myTimeout,
  flatter,
  uniqueArr,
  uniqueArr1,
  myInstanceof,
  LazyMan,
  transTree
}
export default {
  data() {
    return {}
  },
  created() {}
}
</script>

<style lang="less" scoped>
</style>