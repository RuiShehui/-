/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-05-31 14:48:17
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\dataTools\tools\stringTools.js
 */
export default {
  /**
   * 去掉空格
   * @param {any} str 需要格式化的字符串
   * @param {boolean} [isGlobal=true] 是否全部格式化，默认是
   * @returns 字符串
   */
  trim(str, isGlobal = true) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (isGlobal) {
      result = result.replace(/\s/g, "");
    }
    return result;
  },
  /**
   * html反转义
   * @param {any} htmlText 转义后的html文本
   * @returns html
   */
  toHtml(htmlText) {
    try {
      htmlText = htmlText.replace(/&lt;/g, "<");
      htmlText = htmlText.replace(/&gt;/g, ">");
      htmlText = htmlText.replace(/&amp;/g, "&");
      htmlText = htmlText.replace(/&quot;/g, '"');
      htmlText = htmlText.replace(/&#39;/g, "'");
    } catch (error) {
      console.error(error);
    }
    return htmlText;
  },
  
};
