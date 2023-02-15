/*
 * @Author: ZhangZhen
 * @Date: 2022-03-26 16:08:51
 * @LastEditTime: 2022-03-26 18:12:46
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\paymentSettlement\components\R_BankInfo\utils\enums.js
 */
/**
 * 转账类型
 */
const BANK_TYPES = {
  /** 转数快 (FPS) */
  FAST: 'fast',
  /** 外币转账 (本地特快) */
  LOCAL: 'localtransfer'
}
/**
 * 收款人类型
 * 1-本人名下演示账户
 * 2-已登记第三者账户
 * 3-未定义登记第三者账户
 */
const CREDITOR_TYPES = {
  /** 本人名下演示账户 */
  CHUANGXING: '1',
  /** 已登记第三者账户 */
  REGISTERED: '2',
  /** 未定义登记第三者账户 */
  NOT_REGISTERED: '3'
};
/**
 * 单个显示表单
 */
const FORM_ITEM_TYPES = {
  /** 付款人 */
  PAYER: 'PAYER',
  /** 收款人 */
  RECEIVER: 'RECEIVER',
};

export {
  BANK_TYPES,
  CREDITOR_TYPES,
  FORM_ITEM_TYPES,
};
