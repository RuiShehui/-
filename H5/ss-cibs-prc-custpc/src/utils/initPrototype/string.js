/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-05-25 09:41:33
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\utils\initPrototype\string.js
 */
/**const常量命名法 */
String.prototype.toConst = function () {
  let result = '';
  for (let i = 0; i < this.length; i++) {
    const currentChar = this[i];
    const beforeChar = i > 0 ? this[i - 1] : '';
    const currentCharCode = currentChar.charCodeAt(0);
    const beforeCharCode = beforeChar.charCodeAt(0);
    if (currentCharCode > 64 && currentCharCode < 91) {
      if (beforeCharCode > 96 && beforeCharCode < 123) {
        result += '_' + currentChar;
      }
    } else if (currentCharCode > 96 && currentCharCode < 123) {
      result += currentChar.toUpperCase();
    } else {
      result += '_';
    }
  }

  return result;
}

/**中横线命名法 */
String.prototype.toKebabCase = function () {
  let result = '';
  for (let i = 0; i < this.length; i++) {
    const currentChar = this[i];
    const beforeChar = i > 0 ? this[i - 1] : '';
    const currentCharCode = currentChar.charCodeAt(0);
    const beforeCharCode = beforeChar.charCodeAt(0);
    if (currentCharCode > 64 && currentCharCode < 91) {
      if (beforeCharCode > 96 && beforeCharCode < 123) {
        result += '-' + currentChar;
      }
    } else if (currentCharCode > 96 && currentCharCode < 123) {
      result += currentChar.toLowerCase();
    } else {
      result += '-';
    }
  }

  return result;
}

/**帕斯卡命名法 */
String.prototype.toPascal = function () {
  let result = '';
  let beforeNotLetter = true;
  for (let i = 0; i < this.length; i++) {
    const currentChar = this[i];
    const currentCharCode = currentChar.charCodeAt(0);

    if (currentCharCode < 65 || (currentCharCode > 90 && currentCharCode < 97) || currentCharCode > 122) {
      beforeNotLetter = true;
    } else if (beforeNotLetter) {
      result += currentChar.toUpperCase();
      beforeNotLetter = false;
    } else {
      result += currentChar;
    }
  }

  return result;
}
/**
 * 将数字字符串转化成金额数字字符串
 */
String.prototype.toMoney = function () {
  var origin = this || '';

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

  return thousandList.reverse().join('') + setDotNumber(originList[1]);

  function setDotNumber(str = '') {
    if (!str.length) {
      return '.00';
    }
    if (str.length === 1) {
      return '.' + str + '0';
    }
    if (str.length >= 2) {
      return '.' + str;
    }
    return '';
    // if (str.length > 2) {
    //     return '.' + str.slice(0, 2);
    // }
  }
}
/**
 * 将日元数字字符串转化成金额数字字符串
 */
String.prototype.toJPY = function () {
  var origin = this || '';

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

  return thousandList.reverse().join('')
}
/**
 * 金额字符串前补0
 */
String.prototype.formatZeroMoney = function () {
  var ctx = this;
  var opts = arguments[0] || {
    targetLen: 8,
  };

  if (/\d/.test(targetLen)) {
    throw new Error('arguments[0] is not a number')
  }

  /** 目标长度 */
  var targetLen = opts.targetLen || 8;
  
  if (ctx.length === targetLen) {
    return ctx;
  }
  if (ctx.length > targetLen) {
    return ctx.slice(0, targetLen);
  }

  var zeroArr = [],
    gapLen = targetLen - ctx.length;

  for (var i = 0; i < gapLen; i++) {
    zeroArr.push('0');
  }

  return zeroArr.join('') + ctx;
  
}
