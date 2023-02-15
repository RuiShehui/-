/**
 * @description 日期工具类
 * @author ex_yemj
 */

const dateUtils = {
  /**
   * @description Date格式化
   * @param {Date} date 
   * @param {String} format yyyy-MM-dd hh:mm:ss.S ==> 2021-08-12 16:31:23.423
   * @returns {String}
   */
  format(date, format = '') {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return ''
    }

    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (let k in o) {
      if (new RegExp(`(${k})`).test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? o[k] : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return format
  }
}

export default dateUtils