import DateUtils from './date-utils'

export function randerKey() {
  return `${DateUtils.format(new Date(), 'yyyyMMddhhhmmssS')}-${randomStr(8)}`
}

/**
 * @description 生成随机字符串
 * @param {Number} len 生成随机字符串长度
 * @returns {String}
 */
export function randomStr(len) {
  let str = Math.random().toString(36).substr(2)
  if (str.length >= len) {
    return str.substr(0, len)
  }
  str += randomStr(len - str.length)
  return str
}

/**
 * 
 * @param {List} tree 
 * @param {*} func 
 */
export function treeFind(tree, func) {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}