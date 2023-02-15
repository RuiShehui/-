/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-05-31 14:48:08
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\dataTools\tools\objectTools.js
 */
import typeTools from "./typeTools";

export default {
  /**
   * 对象拷贝
   * @param {any} source 源对象
   * @returns 对象
   */
  copy(source) {
    let result = {};
    for (let key in source) {
      // 时间对象, null 不做深拷贝
      if (typeTools.isDate(source[key]) || typeTools.isNull(source[key])) {
        result[key] = source[key];
      } else {
        result[key] =
          typeof source[key] === "object"
            ? this.copy(source[key])
            : source[key];
      }
    }
    return result;
  },
  /**
   * 简单对象合并
   * @param {any} source 源对象
   * @param {any} target 目标对象
   * @param {any} isCover 是否覆盖
   * @returns 对象
   */
  merge(source, target, isCover = false) {
    for (let item in source) {
      if (isCover || !target.hasOwnProperty(item)) {
        target[item] = source[item];
      }
    }
    return target;
  },
  /**
   * 检查是否为空对象
   * @param {Object} obj 要检查的对象
   * @returns {Boolean} 对象字符串
   */

  __isEmptyObject(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  },
  /**
   * 创建一个传统的枚举类型
   * @param {Object} obj
   * @returns {Object} enumObj
   * @example createEnum({red:1}) => {red:1,1:red}
   */
  createEnum(obj) {
    let enumObj = {};
    for (let key in obj) {
      enumObj[(enumObj[key] = obj[key])] = key;
    }
    return enumObj;
  },
};
