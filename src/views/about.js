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

export {
  twoSum
}