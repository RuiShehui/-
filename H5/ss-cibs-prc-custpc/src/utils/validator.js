/*
 * @Author: your name
 * @Date: 2022-09-17 10:19:16
 * @LastEditTime: 2022-10-26 20:08:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\utils\validator.js
 */
/**
 * @description 通用表单校验规则
 * @author ex_yemj
 */

/**
 * @description AD域验密密码输入框校验
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
 import i18n from '@/i18n';
export function passwordValidator(rule, value, callback) {
  if (value.length == 0) {
    callback(new Error(i18n.t('LOGON.PLEASE_INPUT_PASSWORD')))
  } else if (value.length < 8) {
    callback(new Error(i18n.t('FIRST_LOGIN.PASSWORD_LENGTH')))
  } else {
    if (/^\S*(?=\S{8,12})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/.test(value)) {
      callback()
    } else {
      callback(new Error(i18n.t('FIRST_LOGIN.TWO_COMBINATIONS')))
    }
  }
}
export function userNameValidator(rule, value, callback) {
  if (value.length < 8) {
    // '用户名长度不能小于8位'
    callback(new Error(i18n.t('FIRST_LOGIN.PASSWORD_LENGTH')))
  }else if(value.length >12){
    // '用户名长度不能大于12位'
    callback(new Error(i18n.t('FIRST_LOGIN.MORE_PASSWORD')))
  } else {
    if (/((?=.*[a-z])(?=.*\d))[a-z\d!@#$%^&]{8,12}$/i.test(value)) {
      callback()
    } else {
      // '网银用户名为8-12为字符（必须包含字母、数字）'
      callback(new Error(i18n.t('FIRST_LOGIN.ERROR_USERNAME')))
    }
  }
}

export function checkEmail(rule, value, callback) {
  if (!value.length) {
    // callback(new Error('请输入邮箱地址'));
    callback(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING',{
      input: i18n.t('PAYMENT.EMAIL_ADDRESS')
    })));
    return;
  }
  if (value.length < 6 || value.length > 34) {
    callback(new Error(i18n.t('RIGHTS_TEMPLATE.EMAIL_CHECK')));
    return;
  }
  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
    callback(new Error(i18n.t('RIGHTS_TEMPLATE.INPUT_EMAIL')));
  }
  callback();
}


/**
 * @description 金额输入框校验
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
export function moneyValidator(rule, val, callback) {
  if (!val) { //没有输入金额不需要校验
    callback()
  }
  if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val)) {
    callback(new Error(i18n.t('RIGHTS_TEMPLATE.AMOUNT_INCORRECT')))
  } else {
    callback()
  }
}

//账号
export function authorNumValidator(rule, val, callback) {
  if (val.length == 0) {
    callback(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING',{
      input: i18n.t('TRANSFR_INFO.CUT_ACCOUNT')
    })))
  } else if (!/[a-zA-Z0-9] |[0-9]|[a-zA-Z]{1,34}$/g.test(val)) {
    callback(new Error(i18n.t('RIGHTS_TEMPLATE.ENTER_RECIVING_ACCOUNT')))
  } else {
    callback()
  }
}