/*
 * @Author: ZhangZhen
 * @Date: 2021-11-08 10:18:22
 * @LastEditTime: 2022-08-02 20:53:54
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\tools.js
 */
// import {
//   STORAGE_TABS
// } from '@/configs/keys';
import CONSTANTS from './constant';
import i18nIns from '@/i18n/instance';

/**
 * one-of
 * @param {*} origin
 * @param {[]} targetList
 * @return {boolean} origin is one of the targetKust
 */
function oneOf(origin, targetList) {
  return targetList.some(item => origin === item);
}

/**
 * get-pure-object: delete-obejct-(key&value) if value null
 * @param {[key: string]: any} origin origin-object
 * @return {[key: string]: any} target-object
 */
function getPrueObject(origin) {
  var target = deepClone(origin);

  for (let k in target) {
    if (!target[k]) {
      delete target[k];
    }
  }

  return target;
}

/**
 * is-type : boolean
 * @param {*} tar 判断目标
 * @param {'Number'|'String'|'Undefined'|'NaN'|'Null'|'Object'|'Array'|'Function'|'Boolean'} type 需要的类型
 */
function isType(tar, type) {
  return Object.prototype.toString.call(tar) === `[object ${type}]`;
}

/**
 * deep-clone
 * @param {*} origin clone-origin
 * @return {*} target clone-target
 */
function deepClone(origin) {
  var toString = ({}).toString,
    arrType = '[object Array]',
    objType = '[object Object]';

  var target = toString(origin) === arrType ? [] : {};

  for (var k in origin) {
    if (origin.hasOwnProperty(k) && origin[k] !== null) {
      if (toString(origin[k]) === objType) {
        target[k] = deepClone(origin[k]);
      } else {
        target[k] = origin[k];
      }
    }
  }

  return target;
}

/**
 * is-add-zero: add zero if number less than 10
 * @param {number} originNumber target-number
 * @return {string} target-number
 */
function isAddZero(originNumber) {
  if (originNumber < 10) {
    return '0' + originNumber.toString();
  }
  return originNumber.toString();
}

/**
 * formatTreeData [{}, ....] -> [ {...children: [...] }, {} ]
 * @description c.pMenuCode === p.menuCode
 * @param {any[]} list origin-list
 * @param {number|string} id current-node-id
 * @param {number|string} pid current-node-parent-id
 * @return {{ [key: string]: any; children?: { [key: string]: any; children?: [] }[] }[]} formatTreeList
 */
function formatTreeData(list = [], id = 'id', pid = 'pid') {
  // delete before children
  list.forEach((item) => {
    delete item.children;
  });

  const map = {};

  list.forEach(item => {
    map[item[id]] = item;
  });

  const targetList = [];

  list.forEach(item => {
    const parent = map[item[pid]];

    if (parent) {
      if (parent.children) {
        parent.children.push(item);
      } else {
        parent.children = [item];
      }
    } else {
      targetList.push(item);
    }
  });

  return targetList;
}

/**
 * setNRandomNumber get-n-order-number
 * @param {number} n order-num
 */
function setNRandomNumber(n) {
  const nList = [];

  for (let i = 0; i < n; i++) {
    nList.push(0);
  }

  return Math.ceil(Math.random() * parseInt(`1${nList.join('')}`));
}

/**
 * set-element-styles
 * @param { HTMLElement } el
 * @param { CSSStyleDeclaration } styles
 * @return {void}
 */
function setElStyles(el, styles) {
  if (!Object.keys(styles).length) {
    el.setAttribute('style', '');
    return;
  }
  const styleString =
    Object.entries(styles)
    .map(entry => {
      return `${toUnderLineString(entry[0])}:${entry[1]};`;
    }).join('');

  el.setAttribute('style', styleString);
}

/**
 * to-camel-string
 * @param {string} origin
 */
function toUnderLineString(origin) {
  return origin.replace(/[A-Z]/, (str) => {
    return `-${str.toLowerCase()}`;
  })
}

/**
 * transToHighCamel： ABCdE -> A_B_CD_E
 * @param {string} camelStr origin-camel-string
 */
function transToHighCamel(camelStr = '') {
  const lowerStrList = camelStr.split('');

  let higherStrList = [];

  lowerStrList.forEach((item, index) => {
    const isUpperStr = (str) => /[A-Z]/g.test(str);

    if (index > 0) {
      if (isUpperStr(item)) {
        higherStrList.push('_');
      }
    }
    higherStrList.push(item.toUpperCase());
  });

  return higherStrList.join('');
}

/**
 * @param { HTMLElement } element
 * @param { boolean } valid
 */
function setValidateForm(element, valid) {
  const oFormItems = element.getElementsByClassName('el-form-item');

  Array.from(oFormItems).forEach((formItem) => {
    const errorTag = formItem.querySelector('.el-form-item__error');
    if (errorTag && errorTag.parentNode && errorTag.parentNode.parentNode) {
      if (!valid) {
        setElStyles(
          errorTag.parentNode.parentNode, {
            marginBottom: '32px'
          }
        );
      } else {
        setElStyles(errorTag.parentNode.parentNode, {});
      }
    }
  });
}

/**
 * @param {String} key
 * @param {Object} object
 */
function getValue(key, map = CONSTANTS.ROUTER_MATCH) {
  return map[key]
}

/**
 * 获取会话存储的顶部菜单列表
 * @return {[]} storageTabs
 */
// function getStorageTabs() {
//   const initTabs = [{
//     name: 'HomePage',
//     path: '/homePage',
//     meta: {
//       "fixed": true,
//       title: "HomePage"
//     }
//   }];
//   const initListStr = JSON.stringify(initTabs);
//   const list = JSON.parse(sessionStorage.getItem(STORAGE_TABS) || initListStr);
//   return list;
// }

/**
 * 设置会话存储的顶部菜单列表
 *@param {String} data 二进制流
 *@param {String} name 文件名
 *@param {String} type 文件类型
 * void
 */
// function setStorageTabs(tabs = [{
//   name: 'HomePage',
//   path: '/homePage',
//   meta: {
//     "fixed": true,
//     title: "HomePage"
//   }
// }]) {
//   if (isType(tabs, 'Array')) {
//     const _tabs = deepClone(tabs);
//     const tabsJSONStr = JSON.stringify(_tabs);
//     sessionStorage.setItem(STORAGE_TABS, tabsJSONStr);
//   }
// }

/**
 * 判断2个元素是否相同
 * @param {any} val
 * @param {val} val
 */
function deepCompare(val1, val2) {
  var toStr = function (val) {
    return Object.prototype.toString.call(val);
  }
  /** 类型是否相等 */
  var isSameType = toStr(val1) === toStr(val2);
  /** 值是否相等 */
  var isSameValue = isEqual(val1, val2);
  /** 
   * 校验是否为合法的规则数组
   * @type boolean[]
   **/
  var ruleList = [isSameType, isSameValue];

  return ruleList.every(function (rule) {
    return rule === true;
  });

  function isEqual(val1, val2) {
    var originTypes = [
      'number',
      'string',
      'boolean',
    ];

    if (originTypes.includes(typeof (val1))) {
      return val1 === val2;
    }
    if (isType(val1, 'Object')) {
      return Object.is(val1, val2);
    }
    if (isType(val1, 'Array')) {
      return val1.some(function (item1, index1) {
        if (originTypes.includes(typeof (item1))) {
          return val2[index1] === item1;
        } else {
          return isEqual(item1, val2[index1]);
        }
      });
    }

    return false;
  }
}

/**
 * 下载文件
 * @param {[]} tabs 当前的tabs
 * void
 */
function downloadFile(data, name = 'filename.xlsx', type) {
  if (!data) {
    return;
  }
  const blob = new Blob([data], {
    type
  });
  let url = window.URL.createObjectURL(blob);
  let link = document.createElement('a');
  if (isIE() || isIE11()) {
    // console.log('ie');
    window.navigator.msSaveOrOpenBlob(blob, name);
  } else {
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  }
}

/**
 * 设置千分位
 * @param {string} org 原始输入值
 * @return {string} 返回值 
 */
function setThousand(org) {
  var origin = org || '';

  var originList = origin.split('.'),
    transStr = originList[0],
    transStrList = transStr.split('');
  var thousandList = [];

  transStrList.reverse().forEach(function (item, index) {
    var newItem,
      isAdd = index !== transStrList.length - 1 && (index + 1) % 3 === 0;
    if (isAdd) {
      newItem = ',' + item;
    } else {
      newItem = item;
    }
    thousandList.push(newItem);
  });

  return thousandList.reverse().join('') + (originList[1] ? '.' + originList[1] : '');
}

/**
 * @module 定期存款预约编号
 * @description 根据日期类型-渲染日期值
 * @param {} submitData 校验后的提交数据
 */
function renderDeposTypeDate({
  startDate,
  endDate,
  fixedDateType = '0'
}, list = CONSTANTS.SELECT_DATE_LIST) {
  /**
   * 1. 判断是否为自定义存期:
   *     1. 自定义存期直接渲染 "开始时间-结束时间"
   *     2. 固定存期则根据枚举列表渲染字符串
   */
  if (endDate && endDate.length > 0) {
    // ${startDate}
    return `${i18nIns.t('COMMON.DATESPAN_TO')} ${endDate}`;
  }
  const target = list.find(item => item.value === fixedDateType);
  if (target) {
    return target.label;
  }
  return CONSTANTS.SELECT_DATE_LIST[0].label;
  // return '';
}

function isIE() {
  var userAgent = navigator.userAgent;

  return userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
}

function isIE11() {
  var userAgent = navigator.userAgent;

  return userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
}

function getInfoByPayeeMethod(method, params) {
  switch (method) {
    case 'BBAN':
      return params.payeeAccount || '';
    case 'MOBN':
      return params.mobilePhone || '';
    case 'EMAL':
      return params.emailAddress || '';
    case 'SVID':
      return params.fpsId || '';
    default:
      return '';
  }
}

function curry(fn, len) {
  var _len = len || fn.length;

  var curryFn = function () {
    var _arg = [].slice.call(arguments, 1);

    return function () {
      var args = [].concat(_arg, [].slice.call(arguments));
      return fn.apply(this, args);
    }
  }

  return function () {
    if (arguments.length < _len) {
      var formatArgs = [fn].concat([].slice.call(arguments));
      return curry(curryFn.apply(this, formatArgs), _len - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  }
}
/**
 * slice origin account
 * xxxyyzzzzz -> xxx-yy-zzzzz
 * @param {string} origin 
 */
function sliceAccount(origin) {
  const str1 = origin.slice(0, 3),
    str2 = origin.slice(3, 5),
    str3 = origin.slice(5, origin.length);

  return `${str1}-${str2}-${str3}`;
}
/**
 * slice origin amount
 * 123456 ->123,456.00
 * @param {string} value 
 */
function moneyFormat(inputVal) {
  const inputValArr = inputVal.split(',').join('').split('.');
  if (!inputValArr[1]) {
    inputValArr[1] = '00';
  }
  if (inputValArr[1] && inputValArr[1].length === 1) {
    inputValArr[1] = inputValArr[1] + '0';
  }
  inputValArr[0] = inputValArr[0]
    .split('')
    .reverse()
    .reduce((pre, next, index) => {
      return (index % 3 ? next : next + ',') + pre;
    });
  return inputValArr.join('.');
}

/**
 * formatYMD
 * @param {string} origin YYYYMMDD
 */
function formatYMD(origin, joiner = '-') {
  if (origin === null || origin === '') {
    return ''
  }else {
    const _origin = origin || '';

    const y = _origin.slice(0, 4),
      m = _origin.slice(4, 6),
      d = _origin.slice(6, 8);
  
    return [y, m, d].join(joiner);
  }

}
/**
 * 
 * @param {*} origin 格式化账户
 * @returns 
 */

function formatAcctNo(origin) {
	const _origin = origin || '';
	const str1 = _origin.slice(0, 3),
		str2 = _origin.slice(3, 5),
		str3 = _origin.slice(5, _origin.length);

	return `${str1}-${str2}-${str3}`;
}


export {
  formatAcctNo,
  oneOf,
  isType,
  deepClone,
  getPrueObject,
  deepCompare,
  isAddZero,
  formatTreeData,
  setNRandomNumber,
  setElStyles,
  transToHighCamel,
  setValidateForm,
  getValue,
  downloadFile,
  setThousand,
  renderDeposTypeDate,
  isIE,
  isIE11,
  getInfoByPayeeMethod,
  curry,
  sliceAccount,
  formatYMD,
  moneyFormat
};