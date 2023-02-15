import CONSTANTS from './constant'
import ccyTool from '@/filters/accountManagement';
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
function formatTreeData(list, id = 'id', pid = 'pid') {
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
 * @param { Element } el
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

function getLabelByValue({
  value,
  list
}) {
  if (!value || !list) {
    throw new Error('argument "value" or "list" is not defined !');
  }
  const target = list.find(item => item.value === value);
  if (target) {
    return target.label;
  }
  return '';
}


/**
 * @param {Element} element
 * @param {boolean} valid
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

const initTabs = [{
  name: 'HomePage',
  path: '/homePage',
  meta: {
    "fixed": true,
    title: "IndexPage"
  }
}];

function isIE() {
  var userAgent = navigator.userAgent;

  return userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
}

function isIE11() {
  var userAgent = navigator.userAgent;

  return userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
}
/**
 * 判断字符串的中文字数是否在n位以内
 * @param {string} origin 需要判断的字符串
 * @param {string} n 需要判断的中文的位数
 */
function chineseInLimit(origin, n = 28) {
  var str = '';
  var reg = new RegExp(`[\\u4e00-\\u9fa5]`);

  origin.split('').forEach(orgStr => {
    if (reg.test(orgStr)) {
      str += orgStr;
    }
  });

  if (!str.length || str.length <= n) {
    return true;
  }

  // return reg.test(origin);
  return false;
}
/**
 * 判断字符串的英文字母是否在n位以内
 * @param {string} origin 需要判断的字符串
 * @param {string} n 需要判断的中文的位数
 */
function englishInLimit(origin, n = 140) {
  var str = '';
  var reg = new RegExp(`[a-zA-Z]`);

  origin.split('').forEach(orgStr => {
    if (reg.test(orgStr)) {
      str += orgStr;
    }
  });

  if (!str.length || str.length <= n) {
    return true;
  }

  return false;
}


/**
 * 文件下载
 * @param {string} data base64文件流
 * @param {string} fileName 文件名
 * @param {string} fileType 文件类型
 */
function downloadFile(data, fileName, fileType) {
  let typeString;
  if (fileType === 'pdf') {
    typeString = 'application/pdf;chartset=UTF-8'
  } else if (fileType === 'xlsx') {
    typeString = 'application/vnd.ms-excel'
  } else {
    return
  }
  let raw = window.atob(data);
  let uInt8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  const blob = new Blob([uInt8Array], {
    type: typeString
  });
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    window.navigator.msSaveOrOpenBlob(blob, `${fileName}.${fileType}`);
  } else {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${fileName}.${fileType}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function filterParams(params = {}) {
  const _filterParams = {};
  for (let k in params) {
    if (typeof params[k] === 'string') {
      if (params[k].length) {
        _filterParams[k] = params[k];
      }
    }
    if (typeof params[k] === 'number') {
      _filterParams[k] = params[k];
    }
  }
  return _filterParams;
}

/**
 * 把普通标签名转化成ElementUI的组件名
 */
function transToElComponent(componentName = '') {
  if (!componentName) {
    return 'ElInput';
  }
  const component = componentName
    .toLowerCase()
    .split('')
    .map((str, index) => {
      if (index === 0) {
        return str.toUpperCase();
      }
      return str;
    })
    .join('');

  return `El${component}`;
}

/**
 * 根据指定的key对数组进行去重
 * @param { any[] } origin 初始数组
 * @param { string } uniqueKey 区分唯一性的key
 */
function setListUnique(origin, uniqueKey) {
  if (!uniqueKey) {
    throw new Error('arguments[1] "uniqueKey" is required !');
  }
  return origin.reduce((prev, cur) => {
    if (!prev.some(item => item[uniqueKey] === cur[uniqueKey])) {
      prev.push(cur);
    }
    return prev;
  }, []);
}

/**
 * 判断两个对象是否相等 (浅比较, 深比较需要递归, 请后续开发人员自行扩展)
 * @return {boolean}
 */
function isSameObject(obj1, obj2) {
  /** 过滤出相同key值的对象 */
  var _obj2 = Object.getOwnPropertyNames(obj2).reduce((obj, key) => {
    if (key in obj1) {
      obj[key] = obj2[key];
    }
    return obj;
  }, {});
  /** 两个对象是否有不相同的值 */
  var isDiff = Object.getOwnPropertyNames(obj1).some(k => {
    if (!_obj2.hasOwnProperty(k)) {
      return true;
    }
    if (obj1[k] !== _obj2[k]) {
      return true;
    }
    return false;
  });

  console.log(obj1, _obj2, isDiff);

  return !isDiff;
}

/**
 * 
 * @param { String } ccy 币种
 * @param { String } money 金额
 * @param { Boolean } showCcy 是否显示币种
 * @returns 
 */
function formatMoney(ccy, money, showCcy = true) {
  if (money === 0 || money) {
    let moneyStr = String(money);
    let minus = moneyStr.split('-');
    moneyStr = moneyStr.split('-').join('');
    if (ccy === 'JPY') {
      if (minus.length > 1) {
        return '- ' + `${showCcy ? ccyTool.ccyFilter(ccy) : ''} ${moneyStr.toJPY()}`;
      }
      return `${showCcy ? ccyTool.ccyFilter(ccy) : ''} ${moneyStr.toJPY()}`;
    } else {
      if (minus.length > 1) {
        return '- ' + `${showCcy ? ccyTool.ccyFilter(ccy) : ''} ${moneyStr.toMoney()}`;
      }
      return `${showCcy ? ccyTool.ccyFilter(ccy) : ''} ${moneyStr.toMoney()}`;
    }
  }
}

/**
 * 
 * 工具方法-金钱转化成千分位的工具
 */
function formatMoneyNew(val) {
  const invalidList = [null, undefined, NaN];
  if (!invalidList.includes(val)) {
    let num = val
    let money
    let dot = String(num).includes('.')
    if (!dot) {
      money = moneyFormat(num) + '.00'
    } else {
      const numStr = String((Math.round(num * 100) / 100).toFixed(2))
      dot = numStr.indexOf('.')
      const decimal = numStr.substr(dot + 1, 2)
      money = moneyFormat(numStr.substr(0, dot)) + '.' + decimal
    }
    return money;
  }
  return '0.00';
}

function moneyFormat(num) {
  return String(num).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
export {
  oneOf,
  isType,
  deepClone,
  getPrueObject,
  isAddZero,

  formatTreeData,
  setNRandomNumber,
  setElStyles,
  transToHighCamel,
  setValidateForm,
  getValue,
  isIE,
  isIE11,
  chineseInLimit,
  englishInLimit,

  downloadFile,
  filterParams,
  transToElComponent,
  getLabelByValue,
  setListUnique,
  isSameObject,
  formatMoney,
  formatMoneyNew,
  // moneyFormat
};