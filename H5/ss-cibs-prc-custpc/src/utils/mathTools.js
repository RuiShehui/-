/* eslint-disable */
import i18n from "@/i18n";
export default {
  /**
   * 利息计算(金额，周期，年利率)
   * 根据需求，已做四舍五入处理，并保留2位小数
   * @param {number} amount
   * @param {number} period
   * @param {number} annualInterestRate
   * @returns {string}
   */
  interest(amount, period, annualInterestRate) {
    amount = parseFloat(amount)
    period = parseFloat(period)
    annualInterestRate = parseFloat(annualInterestRate)
    let result = amount * period * annualInterestRate / 360 / 100
    result = this.roundStr(result, 2)
    if (isNaN(result)) {
      return '0.00'
    } else {
      return result
    }
  },
  /**
   * 添加分隔符','
   * 保留小数点后两位
   *
   * 输入string
   * 返回string
   */
  moneyCheck(val) {
    let value = val.replace(/[^\d.]/g, "")
      .replace(/^0\d+|^\./g, "")
      .replace(/\.{2,}/g, ".")
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".")
      .replace(/^(\d+)\.(\d\d).*$/, "$1.$2")
      .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    return value
  },

  /**
   * 添加分隔符（,）
   *
   * @param {number} value
   * @returns {string}
   */
  addDecollator(value) {
    if (isNaN(value)) {
      // 去除格式化后，给数字格式，return空
      if (isNaN(this.delDecollator(value))) {
        return ""
      } else {
        value = this.delDecollator(value)
      }
    }
    try {
      value = this.repairNum(value)
      let prefix = ''
      // 判断前缀
      if (value.indexOf('+') > -1 || value.indexOf('-') > -1) {
        prefix = value.substring(0, 1)
        value = value.substring(1)
      }
      let integer = ''
      let decimal = ''
      // 判断是否整数
      if (value.indexOf('.') > -1) {
        let temp = value.split('.')
        integer = temp[0]
        decimal = '.' + temp[1]
      } else {
        integer = value
      }
      let templength = integer.length;
      if (templength % 3 == 1) {
        integer = '@@' + integer
      } else if (templength % 3 == 2) {
        integer = '@' + integer
      } else {
        integer = '' + integer
      }
      let tempStr = ''
      for (let i = 0; i < integer.length / 3; i++) {
        tempStr += integer.substring(i * 3, i * 3 + 3) + ','
      }
      tempStr = tempStr.substring(0, tempStr.length - 1)
      tempStr = tempStr.replace(/@/g, "")

      return prefix + tempStr + decimal
    } catch (error) {
      return ''
    }
  },

  /**
   * 去掉分隔符（,）
   *
   * @param {string} value
   * @returns {string}
   */
  delDecollator(value) {
    if (!isNaN(value)) {
      return value
    } else if (value == '') {
      return value
    } else {
      return value.replace(/,/g, "")
    }
  },
  /**
   * 金额大写
   *
   * @param {any} value
   */
  // formatChinese(value) {
  //   if (isNaN(value) || value.indexOf(' ') !== -1 || value === '') {
  //     return "";
  //   }
  //   value = this.repairNum(value);
  //   value = parseFloat(value);
  //   let fraction = ['角', '分'];
  //   let digit = [
  //     '零', '壹', '贰', '叁', '肆',
  //     '伍', '陆', '柒', '捌', '玖'
  //   ];
  //   let unit = [
  //     ['圆', '万', '亿', '兆'],
  //     ['', '拾', '佰', '仟']
  //   ];
  //   let head = value < 0 ? '欠' : ''
  //   let n = Math.abs(value)
  //   let s = ''
  //   for (let i = 0; i < fraction.length; i++) {
  //     s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  //   }
  //   s = s || '整'
  //   n = Math.floor(n)
  //   for (let i = 0; i < unit[0].length && n > 0; i++) {
  //     let p = ''
  //     for (let j = 0; j < unit[1].length && n > 0; j++) {
  //       p = digit[n % 10] + unit[1][j] + p
  //       n = Math.floor(n / 10)
  //     }
  //     s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  //   }
  //   return head + s.replace(/(零.)*零圆/, '圆')
  //     .replace(/(零.)+/g, '零')
  //     .replace(/^整$/, '零圆整')
  // },

  /**
   * 获取金额单位
   * @param {*} value 
   * @returns 
   */
  // getMoneyUnit(value) {
  //   if (value) {
  //     let fr = 100;
  //     let num = 2; //几位数
  //     while (value / fr >= 1) { //计算出数字的位数
  //       fr *= 10;
  //       num += 1;
  //     }
  //     let moneyUnit = ['个', '拾', '佰', '仟', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '万亿'];
  //     if (num > 2) {
  //       return moneyUnit[num - 1];
  //     } else {
  //       return '';
  //     }
  //   }
  // },
  /**
   * 分割数字【主要用于处理UI显示，如整数部分大，小数部分小等样式】
   * value 接受 整数，小数,字符串100,000.00等
   * returnType 参数为枚举 f => 返回整数部分 , e => 返回小数部分 , a =>数组返回整数跟小数['整数','小数']
   * @param {any} value
   * @param {any} returnType
   * @returns {any}
   */
  division(value, returnType) {
    value = value + ""
    let temp = value.split('.')
    if (returnType === 'f') {
      return temp[0]
    }
    temp[1] = temp[1] === undefined ? '00' : temp[1]
    if (returnType === 'e') {
      return temp[1]
    }
    if (returnType === 'a') {
      return temp
    }
  },
  /**
   * 修复数字
   * 因Oracle数据库返回数值缺0问题
   * @param {String} value 
   * @returns {String}
   */
  repairNum(value) {
    value = value + "";
    if (value.indexOf('.') == 0) {
      return ('0' + value)
    } else {
      return value
    }
  },
  /**
   * 四舍五入(转换值, 保留位数[默认2])
   * 注意: 1.00会返回1；1.10返回1.1 如作为前端数据展示，可用roundStr
   * @param {number} value 需转换的值
   * @param {number} [saveLength=2] 
   * @returns {number}
   */
  round(value, saveLength = 2) {
    value = parseFloat(value)
    saveLength = parseFloat(saveLength)
    let magnification = Math.pow(10, saveLength)
    let temp = value * magnification
    temp = Math.round(temp)
    return temp / magnification
  },

  /**
   * 四舍五入，输出字符串格式(转换值, 保留位数[默认2])
   * 注意: 返回结果为字符串，需要数字可用round
   * @param {number} value 
   * @param {number} [saveLength=2] 
   * @returns {string}
   */
  roundStr(value, saveLength = 2) {
    return this.round(value, saveLength).toFixed(saveLength)
  },

  /**
   * 银行卡号脱敏
   * @param {*} val 银行卡号
   */
  dsBankNo(val) {
    if (val) {
      return val.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2");
    }
  },

  /**
   * 手机号脱敏
   * @param {*} val 手机号 
   */
  dsMobile(val) {
    if (val) {
      return val.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2");
    }
  },

  /**
   * 银行卡号格式化：每四位加空格
   * @param {*} val 银行卡号
   */
  formatBankNo(bankNo) {
    if (bankNo) {
      return `${bankNo.slice(0,3)}-${bankNo.slice(3,5)}-${bankNo.slice(5)}`;
    }
  },
  ccyFilter(val) {
    switch (val) {
      case 'HKD':
        return i18n.t('ACCOUNT_MANAGEMENT.HKD')
      case 'AUD':
        return i18n.t('ACCOUNT_MANAGEMENT.AUD')
      case 'CAD':
        return i18n.t('ACCOUNT_MANAGEMENT.CAD')
      case 'CNY':
        return i18n.t('ACCOUNT_MANAGEMENT.CNY')
      case 'EUR':
        return i18n.t('ACCOUNT_MANAGEMENT.EUR')
      case 'GBP':
        return i18n.t('ACCOUNT_MANAGEMENT.GBP')
      case 'JPY':
        return i18n.t('ACCOUNT_MANAGEMENT.JPY')
      case 'NZD':
        return i18n.t('ACCOUNT_MANAGEMENT.NZD')
      case 'SGD':
        return i18n.t('ACCOUNT_MANAGEMENT.SGD')
      case 'TWD':
        return i18n.t('ACCOUNT_MANAGEMENT.TWD')
      case 'USD':
        return i18n.t('ACCOUNT_MANAGEMENT.USD')
      case 'CHF':
        return i18n.t('ACCOUNT_MANAGEMENT.CHF')
      case 'CNH':
        return i18n.t('ACCOUNT_MANAGEMENT.CNH')
      case 'DKK':
        return i18n.t('ACCOUNT_MANAGEMENT.DKK')
      case 'SEK':
        return i18n.t('ACCOUNT_MANAGEMENT.SEK')
      case 'THB':
        return i18n.t('ACCOUNT_MANAGEMENT.THB')
      default:
        return val
    }
  },
  /**
   * 校验银行卡号长度及纯数字
   * @param {*} bankNo 
   */
  checkBankNo(bankNo) {
    let num = /^\d*$/
    if (bankNo) {
      if (bankNo.length < 16 || bankNo.length > 19 || !num.test(bankNo)) {
        return false
      }
      return true
    } else {
      return false;
    }
  },




  /**
   * 格式化金额 17+2 
   * @param {*} money
   */
  formattingMoney(money) {
    let value;
    value = this.delDecollator(money);
    value = value.match(/^\d*(\.?\d{0,2})/g)[0] || "";
    value =
      value.split(".")[0].substring(0, 17) +
      (value.split(".").length == 2 ? "." + value.split(".")[1] : "");
    return value
  }

}