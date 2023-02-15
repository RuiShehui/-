/*
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-05-16 16:26:30
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\regExpTools.js
 */
module.exports = {
  /* 小写字母 */
  validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
  },

  /* 大写字母 */
  validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
  },

  /* 大小写字母 */
  validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
  },

  /* 手机号码 */
  validatePhone(str) {
    const reg = /^1[3-9]\d{9}$/;
    return reg.test(str);
  },

  /* 15/18位数身份证号 */
  validateIDCard(str) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(str);
  },
  /** 校验密码 */
  // validatePassword(str) {
  //   c;
  // },
  /**
   * check-email-address
   * @description 校验邮箱
   * @param {string} email 待校验邮箱地址信息
   */
  validateEmail(email) {
    const emailRule = /^([a-zA-Z0-9_])+@+([a-zA-Z0-9])+\.([a-zA-Z]{2,4})$/g;

    return emailRule.test(email);
  },
  /**
   * validate-money
   * @description 校验金额
   * @param {string} money 待校验的金额
   */
  validateMoney(money = '') {
    if (money.length <= 12) {
      // 整数判断
      // const reg1 = /^([1-9]{1}(\d{0,11})|[0])$/;
      // if (reg1.test(money)) {
      //   return true;
      // }
      // 大于等于1的整数
      const reg1 = /^([1-9]{1}(\d{0,11}))$/;
      if (reg1.test(money)) {
        return true;
      }
      // 浮点数判断
      // const reg2 = /([0][\.][0-9]{1,2}$)|(([1-9]{1})([0-9]*)\.(\d{1,2}$))/;
      // if (reg2.test(money)) {
      //   return true;
      // }
    }

    return false;
  }
};