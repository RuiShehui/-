/*
 * @Author: ZhangZhen
 * @Date: 2021-11-04 18:48:39
 * @LastEditTime: 2022-06-08 11:26:26
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\business-management\index.js
 */
/**
 * 银行收费折扣
 */
export {
  getDiscountList,
  getDiscountDetail,
  addDiscount,
  editDiscount,
  deleteDiscount,
} from './discount';
/**
 * 银行限额设置
 */
export {
  getLimitList,
  setLimitList,
  getLimitLevels,
  addLimitItem,
  queryBankLimitRelationList,
  saveBankLimitRelationList,
  updateBankLimitRelation,
  delBankLimitRelation,
} from './limit-assets';