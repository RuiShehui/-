/**
 * @description Vue组件全局过滤器
 * @author ex_yemj
 */


const vFilter = {
  /**
   * @description 钱数格式化_补零
   * @param {Number|String} num 
   * @returns {String}
   */
  moneyFloatFormat(num) {
    if (!num) {
      return ''
    }
    if (isNaN(Number(num))) {
      return num;
    } else if (Number(num) === 0) {
      return 0;
    } else {
      let numStr = String(num);
      let _int = numStr.split('.')[0];
      let _flo = numStr.split('.')[1];
      _int = (_int).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      if (_flo) {
        if (_flo.length >= 2) {
          _flo = _flo.substr(0, 2);
        } else if (_flo.length === 1) {
          _flo += '0';
        }
      } else {
        _flo = '00';
      }
      return `${_int}.${_flo}`
    }
  },
  /**
   * @description 钱数格式化_不补零
   * @param {Number|String} num
   * @returns {String}
   */
  moneyNumFormat(num) {
    if (!num) {
      return ''
    }
    if (isNaN(Number(num))) {
      return num;
    } else {
      let numStr = String(num);
      let _int = numStr.split('.')[0];
      let _flo = numStr.split('.')[1];
      _int = (_int).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      if (_flo) {
        if (_flo.length >= 2) {
          _flo = _flo.substr(0, 2);
        }

        return `${_int}.${_flo}`
      } else {
        return `${_int}`
      }
    }
  },
  // 格式化
  descFormat(str) {
    if (!str) return
    str = str.replace(/<\/{0,}[a-z](.+?)>/gi, " ");
    return str;
  }, 
  /**
   * @description 手机号脱敏 13538383333 -> 135****3333
   * @param {String} tel 
   * @returns {String}
   */
  // geTel(tel) {
  //   if (tel == undefined || tel == '') {
  //     return
  //   }
  //   var reg = /^(\d{3})\d{4}(\d{4})$/;
  //   return tel.replace(reg, "$1****$2");
  // },
  
  /**
   * @description 银行卡号脱敏
   * @param {String} value 
   * @returns {String}
   */
  bank(value) {
    if (value == undefined) {
      return
    }
    return value.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2")
  },
  toThousandFilter(num) {
    if (num == undefined) {
      return
    }
    // return num.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  },
  // money(n) {
  //   if (n == undefined) {
  //     return
  //   }
  //   if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
  //     return ""
  //   }
  //   let unit = "仟佰拾亿仟佰拾万仟佰拾元角分",  str = "";
  //   n += "00";
  //   var p = n.indexOf('.');
  //   if (p >= 0) {
  //     n = n.substring(0, p) + n.substr(p + 1, 2)
  //   }
  //   unit = unit.substr(unit.length - n.length);
  //   for (var i = 0; i < n.length; i++) {
  //     return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
  //   }
  // },
  /**
   * 将授权列表转化成name-string
   * [{...}, {...}] -> "zhangsan, lisi"
   */
  getAuthName(list = []) {
    return list.map(item => item.userEglsName).join(', ');
  },
  /**
   * 将连在一起的时间分开
   * yyyymmddhhmmss -> yyyy-mm-dd hh:mm:ss
   */
   filterLinkTime(origin = '') {
    if (!origin) {
      return '';
    }
    const year = origin.slice(0, 4),
      month = origin.slice(4, 6),
      day = origin.slice(6, 8),
      hour = origin.slice(8, 10),
      minute = origin.slice(10, 12),
      second = origin.slice(12, 14);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}

export default vFilter