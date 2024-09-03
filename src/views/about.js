/* 算法？？ */

/*
  求和的下标
  输入: list = [3, 8, 22, 12], target = 20
  输出: [1, 3]
*/
function twoSum (list, target) {
  let obj = {}
  for(let i = 0; i < list.length; i++) {
    let subNum = target - list[i]
    if (obj[subNum] !== undefined) {
      return [obj[subNum], i]
    } else {
      obj[list[i]] = i
    }
  }
  console.log(obj)
}

/* 
  给定一个包含整数的数组，函数会找出所有的三元组 (三个数)，使得它们的和为零，并且三元组中没有重复的组合
*/
function threeSum (numList) {
  if (numList.length < 3) {
    return []
  }
  numList.sort((a, b) => a - b)
  let res = []
  for (let i = 0; i < numList.length; i++) {
    if (numList[i] > 0) {
      break
    }
    if (i > 0 && numList[i] == numList[i-1]) {
      continue
    }
    let l = i + 1, r = numList.length - 1
    while (l < r) {
      let sum = numList[i] + numList[l] + numList[r]
      if (sum === 0) {
        res.push([numList[i], numList[l], numList[r]])
        while(l < r && numList[l] === numList[l + 1]) {
          l++
        }
        while(l < r && numList[r] === numList[r - 1]) {
          r--
        }
        l++
        r--
      } else if (sum < 0) {
        l++
      } else if (sum > 0) {
        r--
      }
    }
  }
  return res
}

/* 
  先入先出，判断是否符合闭合规则
 */
function judgeStr(str) {
  let mapObj = {
    '[': ']',
    '{': '}',
    '(': ')'
  }
  let tmpArr = []
  for (let item of str) {
    if (mapObj[item]) {
      tmpArr.push(mapObj[item])
    } else {
      if (tmpArr[tmpArr.length - 1] === item) tmpArr.pop()
      else return false // 注释此行可匹配[abc]类型字符串
    }
  }
  return tmpArr.length === 0
}

/* 
  动态规划，找到字符串中不含重复字符的最长子串的长度
*/
function lengthOfLongestSubstring (s) {
  let str = ''
  let len = 0
  for (let i = 0; i < s.length; i++) {
    let index = str.indexOf(s.charAt(i))
    if (index === -1) {
      str += s.charAt(i)
      len = len > str.length ? len : str.length
    } else {
      str = str.slice(index + 1) + s.charAt(i)
    }
  }
  return len
}

/* 
  动态规划，最大子数组乘积，不考虑负数
*/
function maxSubArray (arr) {
  let maxSoFar = arr[0]
  let maxResult = arr[0]
  for (let i = 1; i < arr.length; i++) {
    maxSoFar = Math.max(maxSoFar * arr[i], arr[i])
    maxResult = Math.max(maxSoFar, maxResult)
  }
  return maxResult
}

/* 
  动态规划，最大子数组乘积，考虑负数
*/
function maxSubArray1 (arr) {
  let maxSoFar = arr[0]
  let minSoFar = arr[0]
  let maxResult = arr[0]
  for (let i = 1; i < arr.length; i++) {
    let tmpMax = Math.max(maxSoFar * arr[i], minSoFar * arr[i], arr[i])
    minSoFar = Math.min(maxSoFar * arr[i], minSoFar * arr[i], arr[i])
    maxSoFar = tmpMax
    maxResult = Math.max(maxSoFar, maxResult)
  }
  return maxResult
}



/*
  单词拆分, 有点难，pass了
  输入: s = "leetcode", wordDict = ["leet", "code"]
  输出: true
*/
var wordBreak = function(s, wordDict) {
  let len = s.length
  let newSet = new Set(wordDict)
  let memo = {}

  function fn(start) {
      if (start === len) {
          memo[start] = true
          return true
      }
      if (memo[start] !== undefined) return memo[start];

      for (let j = start + 1; j <= len; j++) {
          let pre = s.slice(start, j)
          if (newSet.has(pre) && fn(j)) {
              memo[start] = true
              return true
          }
      }
      memo[start] = false
      return false
  }
  return fn(0)
};

/* 第一个只出现一次的字符 */
function getFirstLetter(str) {
  for (let i = 0; i < str.length; i++) {
    let currentStr = str[i]
    if (str.indexOf(currentStr) === str.lastIndexOf(currentStr)) {
      return i
    }
  }
  return -1
}

/* 
  tree和list转换
  数据转成Map去存储，之后遍历的同时借助对象的引用
*/
/* 
[
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
]
*/
function arrayToTree(items) {
  const result = [];   // 存放结果集
  // 先转成map存储
  const itemMap = {};
  for (const item of items) {
    itemMap[item.id] = {...item, children: []}
  }
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    const treeItem =  itemMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      itemMap[pid].children.push(treeItem)
    }
  }
  return result;
}
/* tree和list转换, 单次遍历版本 */
function arrayToTree1(items) {
  const result = []
  const itemMap = {}
  for (let item of items) {
    const { id, pid } = item
    if (!itemMap[id]) {
      itemMap[id] = {
        children: []
      }
    }
    itemMap[id] = {
      ...item,
      children: itemMap[id].children
    }
    const treeItem = itemMap[id]
    if (pid === 0) {
      result.push(treeItem)
    } else {
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}

/* 递归实现 */
const arrayToTree2 = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = {...item, children: []};
      result.push(newItem);
      arrayToTree2(data, newItem.children, item.id);
    }
  }
}

function treeToArray(trees, result = []) {
  trees.forEach(tree => {
    const { id, pid, name, children } = tree
    result.push({ id, pid, name })
    if (children?.length) {
      treeToArray(children, result)
    }
  })
  return result
}

export {
  twoSum,
  threeSum,
  judgeStr,
  lengthOfLongestSubstring,
  maxSubArray,
  maxSubArray1,
  wordBreak,
  getFirstLetter,
  arrayToTree,
  arrayToTree1,
  arrayToTree2,
  treeToArray,
}