/*
 * @Autor: 朱涛
 * @Date: 2021-11-30 14:51:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-17 19:46:30
 * @Description: 
 * @FilePath: \webbank-pc\src\utils\tree-table.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */

/**
 * formatTreeData
 * @description 扁平数组的树形结构化
 * @param {*} origin
 * @param {string} [id="id"]
 * @param {string} [pid="pid"]
 * @returns
 */
 function formatTreeData(origin, id = "menuCode", pid = "pmenuCode") {
  const pList = origin.filter((item) => !item[pid]),
    cList = origin.filter((item) => item[pid])
    console.log(pList,'pList')
    console.log(cList,'cList')
  _formatTree(pList, cList)

  return pList

  function _formatTree(parent, children) {
   
    parent.forEach((p) => {
      children.forEach((c, ci) => {
        if (c[pid] === p[id]) {
          const _children = deepClone(children)
          _children.splice(ci, 1)
          _formatTree([c], _children)
          if (p.children) {
            p.children.push(c)
          } else {
            p.children = [c]
          }
        }
      })
    })
  }
}

/**
 *deepClone             
 * @param {*} origin
 * @returns
 */
function deepClone(origin) {
  if (["string", "number", "boolean"].includes(typeof origin)) {
    return origin
  }
  var target = Array.isArray(origin) ? [] : {}
  for (var k in origin) {
    if (origin[k] !== null && Object.prototype.toString.call(origin[k]) === "[object, Object]") {
      target[k] = deepClone(origin[k])
    } else {
      target[k] = origin[k]
    }
  }
  return target
}

/**
 * @description 数组去重
 * @param [] arr
 */
function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j, 1);
        j--
      }
    }
  }
  return arr
}


/**
 * @description 树状数组扁平化
 * @param [] tree 
 * @returns 
 */
function treeToArray(tree) {
  var res = []
  for (const item of tree) {
    const {
      children,
      ...i
    } = item
    if (children && children.length) {
      res = res.concat(treeToArray(children))
    }
    res.push(i)
  }
  return res
}

export {
  formatTreeData,
  deepClone,
  unique,
  treeToArray
}