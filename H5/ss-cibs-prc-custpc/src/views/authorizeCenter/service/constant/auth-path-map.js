/*
 * @Author: ZhangZhen
 * @Date: 2022-05-07 15:18:38
 * @LastEditTime: 2022-05-11 14:01:55
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\authorizeCenter\service\constant\auth-path-map.js
 */
/**
 * 授权列表路由映射
 */
const transfer = {
  /** 付款 */
  '030101': '/bankTransfer/paymentSettlement/intraBankTransfer',
  '03010201': '/bankTransfer/paymentSettlement/fast',
  '03010202': '/bankTransfer/paymentSettlement/localtransfer',
  '030103': '/bankTransfer/paymentSettlement/remittance',
  '03010401': '/paymentSettlement/batchTransfer/recordManually',
  '03010402': '/paymentSettlement/batchTransfer/search',
  '03010501': '/paymentSettlement/payDay/recordManually',
  '03010502': '/paymentSettlement/payDay/search',
  '030106': '/bankTransfer/transferRecord/index',
  '030107': '/bankTransfer/registerThirdAccount/registerAccountIndex',
  /** 收款 */
  /** 预约交易管理 */
  '0303': '/bankTransfer/appointTransactionManage/index',
};

/**
 * 授权-跳转路径映射表
 */
export default {
  /** 转账汇款对应菜单 */
  ...transfer,
};