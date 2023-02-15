/*
 * @Author: ZhangZhen
 * @Date: 2022-05-12 14:06:07
 * @LastEditTime: 2022-05-18 12:37:36
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\utils\pdf-generator\utils.js
 */

/**
 * is-type : boolean
 * @param {*} tar 判断目标
 * @param {'Number'|'String'|'Undefined'|'NaN'|'Null'|'Object'|'Array'|'Function'|'Boolean'} type 需要的类型
 */
 function isType(tar, type) {
  return Object.prototype.toString.call(tar) === `[object ${type}]`;
}

/**
 * get-all-html-style
 * @return { string } styleContentStr
 */
function getAllStyles() {
  const styleCol = document.getElementsByTagName('style');

  return (
    [].slice.call(styleCol)
      .reduce((prev, cur) => {
        prev.push(cur.innerHTML);
        return prev;
      } , [])
      .map(styleInner => `<style>${styleInner}</style>`)
      .join('\n')
  );
}

/**
 * get total-template
 */
function getTotalTemplate({
  style = getAllStyles(),
  template = '<h1>template</h1>'
}) {

  return `
    ${ style }

    ${ template }
  `;
}

export {
  isType,
  getAllStyles,
  getTotalTemplate,
};
