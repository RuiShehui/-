/*
 * @Author: ZhangZhen
 * @Date: 2022-02-11 11:50:23
 * @LastEditTime: 2022-04-02 10:51:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\common\phone-input\data.js
 */
const defaultRules = [
  {
    type: 'string',
    // maxlength: 10,
    pattern: /(\d|\+){1}(\d){1,9}/
  },
  {
    type: 'string',
    // maxlength: 11,
    pattern: /\d{7,11}/ // 实际测试数据
    // pattern: /\d{8,11}/ // 需求是这个
  }
];

export {
  defaultRules,
};
