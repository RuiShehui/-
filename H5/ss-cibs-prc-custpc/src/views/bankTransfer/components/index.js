/*
 * @Author: ZhangZhen
 * @Date: 2022-04-08 10:05:02
 * @LastEditTime: 2022-05-30 09:58:10
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\index.js
 */

/** 行内转账确认页 */
import InnerConfirm from
  '@bank-transfer/paymentSettlement/intraBankTransfer/components/confirm-info';
/** 跨行转账确认页 */
import IntraConfirm from
  '@bank-transfer/paymentSettlement/components/confirmInfo.vue';
/** 电汇确认页 */
import RemittanceConfirm from
  '@bank-transfer/paymentSettlement/remittance/components/confirmInfo.vue';

/** 银行代理费详情 */
import BankProxyDetail from '@bank-transfer/components/bank-proxy-detail/index.vue';

/**
 * @module CommonComponentsExposed 公共组件暴露
 * @alias @bank-transfer/components
 */
export {
  InnerConfirm,
  IntraConfirm,
  RemittanceConfirm,
  BankProxyDetail,
};
