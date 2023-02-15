export default {
  /**
   * 数字金额格式化，常用场景在过滤器中
   * @param {String|Number} 金额数字，字符串或者数字类型
   *
   * @param {String}        货币符号，默认¥
   * @param {Number}        小数点后精确的位数，默认2
   * @return {String}       加上了,逗号分隔符和小数点.后的字符串
   */
  currencyFormat(value = "", currencySign = "¥", decimals = 2, unit = "") {
    value = parseFloat(value);
    if (!isFinite(value) || (!value && value !== 0)) return "";
    const stringified = Math.abs(value).toFixed(decimals);
    const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    const i = _int.length % 3;
    const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
    const _float = decimals ? stringified.slice(-1 - decimals) : "";
    const sign = value < 0 ? "-" : "";
    const digitsRE = /(\d{3})(?=\d)/g;
    return (
      sign +
      currencySign +
      head +
      _int.slice(i).replace(digitsRE, "$1,") +
      _float + unit
    );
  },

  /**
   * 脱敏银行账号
   * 自动判断有没有*号，若有*号 返回 6666 **** **** 6666 若无，返回 6666 6666 6666 666
   * 用法 a|formatAccountNo
   * @param {*} bankcard
   * @param {Boolean} space
   */
  formatAccountNo(bankcard, addSpace = true) {
    if (typeof bankcard !== "string") {
      return "";
    }
    // 当卡号不脱敏时
    if (bankcard.indexOf("*") == "-1") {
      // return this.bankCardSeparated(bankcard);
      let account = bankcard.replace(/\s/g, "");
      // let bankCard = account.replace(/(^\d{4}|\d{4}\B)/g, "$1 ");
      let finBankCard = account.replace(/(\d{4})(?=\d)/g, "$1 ");
      return finBankCard;
    }

    if (bankcard.length < 8) {
      return bankcard;
    }
    let reg = /^(\d{4})[\s\S]+(\w{4})$/;
    let value;

    if (!addSpace) {
      value = bankcard.toString().replace(reg, "$1********$2");
    } else {
      value = bankcard.toString().replace(reg, "$1 **** **** $2");
    }
    return value;
  },
  /**
   * 脱敏银行账号
   * 自动判断有没有*号，若有*号 返回 6666 **** **** 6666 若无，返回 6666 6666 6666 666
   * @param {tring} bankcard 银行卡号
   * @param {Boolean} isMask 是否脱敏
   * @param {Boolean} addSpace 是否每4位添加间隔
   * @param {Boolean} space
   * @returns {String} 格式化后的银行卡号
   */
  formatBank(bankcard, isMask = false, addSpace = true) {
    if (typeof bankcard !== "string") {
      return "";
    }
    // 当卡号不脱敏时 bankcard.indexOf("*") == "-1"
    if (!isMask) {
      // return this.bankCardSeparated(bankcard);
      let account = bankcard.replace(/\s/g, "");
      // let bankCard = account.replace(/(^\d{4}|\d{4}\B)/g, "$1 ");
      let finBankCard = account.replace(/(\d{4})(?=\d)/g, "$1 ");
      if (!addSpace) {
        finBankCard = account.replace(/(\d{4})(?=\d)/g, "$1");
      } else {
        finBankCard = account.replace(/(\d{4})(?=\d)/g, "$1 ");
      }
      return finBankCard;
    }

    if (bankcard.length < 8) {
      return bankcard;
    }
    let reg = /^(\d{4})[\s\S]+(\w{4})$/;
    let value;

    if (!addSpace) {
      value = bankcard.toString().replace(reg, "$1********$2");
    } else {
      value = bankcard.toString().replace(reg, "$1 **** **** $2");
    }
    return value;
  },

  /**
   * 脱敏收款账号，保留前四位，后面全部换成* *
   * 1234******
   * 
   */
  formatfourcard(cardNum) {
    if (typeof cardNum !== "string") {
      return "";
    }
    if (cardNum.length <= 4) {
      return cardNum;
    }
    let star = '*'.repeat(cardNum.length - 4);
    let value = cardNum.slice(0, 4) + star;
    return value;
  },
  /**
   * 脱敏英文名 Wendy Hui ==> ***** Hui
   * 
   */
  formatEnScName(name) {
    if (typeof name !== "string") {
      return "";
    }
    let reg = /^[\u4E00-\u9FA5]+$/;
    let value = ''
    if (!reg.test(name)) {
      //不是全中文
      let lastname = name.substring(name.lastIndexOf(" ") + 1);
      let firststr = name.substring(0, name.lastIndexOf(" "));
      let firstname = firststr.replace(/[a-zA-Z0-9]/g, "*");
      value = firstname + ' ' + lastname;
      return value;
    } else {
      //全中文
      let star = '*'.repeat(name.length - 1);
      value = name.slice(0, 1) + star;
      return value
    }
  },
  /**
   * @desc 脱敏手机号码 前四后三 中间四个*
   * @param {string} phone
   * @returns {string}
   * @example this.$tools.formatPhone('13760061408') -- '137 **** 1408'
   */
  formatPhone(phone) {
    if (typeof phone !== "string") {
      return "";
    }
    if (phone.length < 7) {
      return phone;
    }
    let reg = /^(\d{3})[\s\S]+(\d{4})$/;
    let value = phone.toString().replace(reg, "$1 **** $2");
    return value;
  },
  /**
   * 脱敏姓名，默认脱敏姓名的最后一位
   * @params val [string] 姓名
   * @params num [int] 脱敏的位数
   * @params type [string] 开头或结尾开始脱敏和中间脱敏
   */
  formatName(val) {
    let target = val;
    if (target.length >= 2) {
      if (target.length === 2) {
        target = `*${target.substr(-1)}`;
      }
      if (target.length > 2) {
        target = `*${target.substr(-2)}`;
      }
    }
    return target;
  },
  /**
   * 获取当前页面的[包名,模块名,页面名]
   * @return {Array} [包名,模块名,页面名]
   */
  getPath() {
    let arr = location.pathname.split(/\/+/).slice(-3);
    arr[2] = arr[2].substr(0, arr[2].length - 5);
    return arr;
  },
  // 处理头部的文字字符控制,大于amount位自动省略，默认14位
  ellipsis(value, amount = 14) {
    if (value) {
      if (value.length > amount) {
        value = value.substr(0, amount) + "...";
      }
    }
    return value;
  },

};