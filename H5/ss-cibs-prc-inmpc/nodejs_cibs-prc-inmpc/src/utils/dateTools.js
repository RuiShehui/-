import {
  isType
} from './tools';

export default {
  // calc时间差
  calcDateSpan(beforeDate, afterDate) {
    //
  },
  // 日期格式化，yyyy-MM-dd
  formatDate(date) {
    if (date) {

      let yy = date.getFullYear()
      let MM = date.getMonth() + 1
      let dd = date.getDate()
      if (MM < 10) {
        MM = '0' + MM
      }
      if (dd < 10) {
        dd = '0' + dd
      }
      return yy + '-' + MM + '-' + dd
    }else {
      return date
    }

  },
  /**
   * 日期字符串转日期对象
   * 支持6种常规格式日期字符串
   * @param {String} str
   * @returns {Date}
   */
  str2Date(str) {
    try {
      str = str.replace(/-/g, '/')
      if (str.length === 8) {
        str = (str.substring(0, 4) + '/' + str.substring(4, 6) + '/' + str.substring(6, 8))
      }
      if (str.length === 10) {
        str = str + ' 00:00:00'
      }
      if (str.length === 14) {
        str = (str.substring(0, 4) + '/' + str.substring(4, 6) + '/' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12) + ':' + str.substring(12, 14))
      }
      return new Date(str)
    } catch (error) {
      return null
    }
  },
  /**
   * 日期对象转日期字符串(日期对象)
   * 表达式【YYYY年份 MM月份 DD日期，如 YYYY-MM-DD】
   * @param {Date} date
   * @param {Sting} exp
   * @returns {String}
   */
  date1Str(date, exp = 'YYYY-MM-DD') {
    try {
      let year = this.getYear(date)
      exp = exp.replace(/YYYY/, year)
      let month = this.getMonth(date)
      exp = exp.replace(/MM/, month)
      let day = this.getDay(date)
      exp = exp.replace(/DD/, day)
      let hour = this.getHours(date)
      return exp
    } catch (error) {
      return null
    }
  },
  /**
   * 日期对象转日期字符串(日期对象)
   * 表达式【YYYY年份 MM月份 DD日期 hh小时 mm分钟 ss秒钟 自由组合，如 YYYY-MM-DD hh:mm:ss】
   * @param {Date} date
   * @param {Sting} exp
   * @returns {String}
   */
  date2Str(date, exp = 'YYYY-MM-DD hh:mm:ss') {
    try {
      let year = this.getYear(date)
      exp = exp.replace(/YYYY/, year)
      let month = this.getMonth(date)
      exp = exp.replace(/MM/, month)
      let day = this.getDay(date)
      exp = exp.replace(/DD/, day)
      let hour = this.getHours(date)
      exp = exp.replace(/hh/, hour)
      let minutes = this.getMinutes(date)
      exp = exp.replace(/mm/, minutes)
      let seconds = this.getSeconds(date)
      exp = exp.replace(/ss/, seconds)
      return exp
    } catch (error) {
      return null
    }
  },
  /**
   * 获取年份
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns
   */
  getYear(obj) {
    try {
      if (isType(obj, 'String')) {
        obj = this.str2Date(obj)
      }
      return obj.getFullYear() + ''
    } catch (error) {
      return ''
    }
  },

  /**
   * 获取月份 【01~12】
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns {String}
   */
  getMonth(obj) {
    try {
      if (isType(obj, 'String')) {
        obj = this.str2Date(obj)
      }
      let month = obj.getMonth() + 1
      return (month > 9 ? '' + month : '0' + month)
    } catch (error) {
      return ''
    }
  },

  /**
   * 获取天 【01~31】
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns {String}
   */
  getDay(obj) {
    try {
      if (isType(obj, 'String')) {
        obj = this.str2Date(obj)
      }
      let day = obj.getDate()
      return (day > 9 ? '' + day : '0' + day)
    } catch (error) {
      return ''
    }
  },

  /**
   * 获取小时
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getHours(obj) {
    try {
      if (isType(obj, 'String')) {
        obj = this.str2Date(obj)
      }
      let hour = obj.getHours()
      return (hour > 9 ? '' + hour : '0' + hour)
    } catch (error) {
      return ''
    }
  },

  /**
   * 获取分钟
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getMinutes(obj) {
    try {
      if (isType(obj, 'String')) {
        obj = this.str2Date(obj)
      }
      let minutes = obj.getMinutes()
      return (minutes > 9 ? '' + minutes : '0' + minutes)
    } catch (error) {
      return ''
    }
  },

  /**
   * 获取秒钟
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getSeconds(obj) {
    try {
      if (isType(obj, 'String')) {
        obj = this.str2Date(obj)
      }
      let second = obj.getSeconds()
      return (second > 9 ? '' + second : '0' + second)
    } catch (error) {
      return ''
    }
  },

  /**
   * 比较两个时间间隔
   * @param {*} startDate 开始日期
   * @param {*} endDate 结束日期
   * @param {*} m 间隔月
   */
  completeDate(startDate, endDate, m = 3) {
    if (startDate && endDate) {
      let date1 = new Date(startDate);
      let date2 = new Date(endDate);
      let diffyear = date2.getFullYear() - date1.getFullYear();
      let diffMonth = diffyear * 12 + date2.getMonth() - date1.getMonth();
      if (diffMonth < 0) {
        return false;
      }
      let diffDay = date2.getDate() - date1.getDate();
      if (diffMonth < m || (diffMonth == m && diffDay <= 0)) {
        if (diffMonth == m && diffDay == 0) {
          let timeA = date1.getHours() * 3600 + 60 * date1.getMinutes() + date1.getSeconds();
          let timeB = date2.getHours() * 3600 + 60 * date2.getMinutes() + date2.getSeconds();
          if (timeB - timeA > 0) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },

  /**
   * 获取指定日期前monthNum个月的日期，以caret分割
   * @param {*} sdate 当前日期 【2021-01-14】
   * @param {*} monthNum 前几个月  3
   * @param {*} caret 分隔符
   */
  getPreMonthDay(sdate, monthNum, caret = '-') {
    let speYear = "";
    let speMonth = "";
    let speDate = "";
    let patt1 = /^\d{4}-([0-1]?[0-9])-([0-3]?[0-9])$/;
    if (!(sdate && typeof (sdate) == "string" && patt1.test(sdate))) {
      sdate = new Date();
      speYear = sdate.getFullYear();
      speMonth = sdate.getMonth() + 1;
      speDate = sdate.getDate();
    } else {
      let sdateAry = sdate.split("-");
      speYear = parseInt(sdateAry[0]);
      speMonth = parseInt(sdateAry[1]);
      speDate = parseInt(sdateAry[2]);
    }
    monthNum = isNaN(parseInt(monthNum)) ? 0 : parseInt(monthNum);
    let preYear = speYear;
    let preMonth = speMonth - monthNum;
    if (preMonth <= 0) { //如差的月份小于0，则将对应的年月做修改
      preYear = parseInt(preYear) - parseInt(preMonth / 12 == 0 ? 1 : Math.abs(parseInt(preMonth / 12)) + 1)
      preMonth = 12 - (Math.abs(preMonth) % 12)
    }
    let preDate = speDate;
    let preDates = new Date(preYear, preMonth, 0);
    let preDateAll = preDates.getDate(); //获取指定月份的总日数
    if (preDate > preDateAll) { //若指定日大于指定月份所含有的天数，则使用指定月份最大的天数
      preDate = preDateAll;
    }
    if (preMonth < 10) {
      preMonth = '0' + preMonth;
    }
    if (preDate < 10) {
      preDate = '0' + preDate;
    }
    preDate = preYear + caret + preMonth + caret + preDate;
    return preDate;
  },

  /**
   * 获取指定日期currentDate前后dayCount天的日期
   * @param {*} currentDate 当前日期
   * @param {*} dayCount 天数，正向后，负向前
   */
  getDateStr(currentDate = new Date, dayCount, format = "-") {
    var dd = new Date(currentDate);
    dd.setDate(dd.getDate() + dayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
    return y + format + m + format + d;
  },
  /**
   * transform-date-string-to-number
   * @param {string} dateString date-string
   * @example 'YYYY-MM-DD'
   */
  dateStrToNum(dateString = '') {
    const dateArr = dateString.split('-'),
      dateNum = parseInt(dateArr.join('')) || 0;

    return dateNum;
  },
  /**
   * 获取日期天数区间
   * @param {string} startTime date-string
   * @param {string} endTime date-string
   * @example 'YYYY-MM-DD || YYYY/MM/DD'
   */
  getGapDay(startTime, endTime) {
    let startDays = new Date(startTime);
    let endDays = new Date(endTime);
    return (endDays - startDays) / 60 / 60 / 24 / 1000;
  }
}

/**
 * transform-date-string-to-number
 * @param {string} dateString date-string
 * @example 'YYYY-MM-DD'
 */
export function dateStrToNum(dateString) {
  const dateArr = dateString.split(','),
    dateNum = parseInt(dateArr.join('')) || 0;

  return dateNum;
}

