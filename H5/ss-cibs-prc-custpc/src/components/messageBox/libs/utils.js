/*
 * @Author: ZhangZhen
 * @Date: 2022-05-25 17:27:53
 * @LastEditTime: 2022-09-16 16:28:57
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\messageBox\libs\utils.js
 */

/**
 * 初始化options
 * @param {{}} options 需要被初始化的数据
 */
export function initOptions(options = {}) {

  if (options && typeof options !== 'object') {
    throw new Error('arguments[0] should be an object type ! ')
  }
  
  const _options = options || {};

  Object.getOwnPropertyNames(options).forEach((k) => {
    _options[k] = options[k];
  });

  return _options;
}

/**
 * 根据菜单编码获取当前的 OTP ID
 * @param {string} menuId 当前的菜单编码
 * @return {string} 过滤得到的OTP ID
 */
export function getotpType(menuId) {
  switch (menuId) {
    case '090403':
      return 'SET_UP_SMALL_SMS';
    case '0901':
      return 'USER_MANAGEMENT';
    case '0902':
      return 'CUSTOMER_ACCOUNT_MANAGEMENT';
    case '090301':
      return 'AUTH_TEMPLATE_MAINTENANCE';
    case '090302':
      return 'TRADE_AUTH_SETTING';
    case '090405':
      return 'SET_ELECTRONIC_STATEMENT_SMS';
    case '090406':
      return 'SET_TRANSACTION_INSTRUCTIONS_OTP_SMS';
      case '090502':
      return 'USER_MANAGEMENT';
    default:
      return menuId;
  }
}

/**
 * 单例创建
 * @param {() => import('vue').VueConstructor} Fn Vue.extend的构造函数 / 类
 */
export function singleInstanceDecorate(Fn) {
  var instance = Fn.instance;

  Fn.create = function () {
    var options = arguments[0];

      if (!options || !options.el) {
        console.error(Fn.name + '\'s options and el is required !');
        return;
      }

      if (!instance) {
        instance = new Fn(options);
      }

    if (!instance) {
      instance = new Fn(options);
    }

    return instance;
  }

  return Fn;
}
