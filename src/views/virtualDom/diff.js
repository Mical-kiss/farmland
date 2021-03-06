function diff(oldTree, newTree) {
  let patches = {}
  let index = 0;
  walk(oldTree, newTree, index, patches)

  return patches
}

function walk(oldNode, newNode, index, patches) {
  let current = []
  if (!newNode) {
    current.push({type: 'REMOVE', index})
  } else if (isString(oldNode) && isString(newNode)) {
    // 判断文本是否一致
    if (oldNode !== newNode) {
      current.push({ type: 'TEXT', text: newNode })
    }
  } else if (oldNode.type === newNode.type) {
    let attr = diffAttr(oldNode.props, newNode.props)
    if (Object.keys(attr).length > 0) {
      current.push({type: 'ATTR', attr})
    }
    diffChildren(oldNode.children, newNode.children, patches)
  } else {  // 说明节点被替换了
    current.push({ type: 'REPLACE', newNode});
  }
  if (current.length) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = current;
  }
}
function isString(obj) {
  return typeof obj === 'string';
}
function diffAttr(oldAttrs, newAttrs) {
  let patch = {};
  // 判断老的属性中和新的属性的关系
  for (let key in oldAttrs) {
      if (oldAttrs[key] !== newAttrs[key]) {
          patch[key] = newAttrs[key]; // 有可能还是undefined
      }
  }

  for (let key in newAttrs) {
      // 老节点没有新节点的属性
      if (!oldAttrs[key]) {
          patch[key] = newAttrs[key];
      }
  }
  return patch;
}

// 所有都基于一个序号来实现
let num = 0;

function diffChildren(oldChildren, newChildren, patches) {
    // 比较老的第一个和新的第一个
    oldChildren.forEach((child, index) => {
        walk(child, newChildren[index], ++num, patches);
    });
}

// 默认导出
export default diff