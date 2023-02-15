/*
 * @Author: ZhangZhen
 * @Date: 2022-05-10 16:53:57
 * @LastEditTime: 2022-05-12 11:28:32
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\service\constant\auth-fn-map.js
 */
import {
  chequeBookAuth
} from '@/api/applyCheckbook';
import {
  auth
} from '@/api/cashManage';
import {
  orderPayTranAuth,
  currencyExchangeAuth
} from '@/api/payService';
import {
  authExecFPSTx
} from '@/api/paymentRemittance';
import {
  authExecInterBankTx,
  authExecTelegraphicTx
} from '@/api/authorizeCenter';
import {
  action
} from '@/api/public.js';
import {
  updateScheduleDateAuth
} from '@/api/reservationTransaction';
import {
  openDepositAuth
} from '@/api/openFixed.js';
import {
  fundSubscriptionAuth
} from '@/api/investmentServices';
import {
  fundChangeAuth,
  fundRedeemAuth
} from '@/api/investmentServices';
import {
  saveMyMerchantAuth,
  updateMyMerchantAuth,
  deleteMyMerchantAuth
} from '@/api/payService';
/**
 * @description 授权方法映射表
 */
export default {
  '030101': authExecInterBankTx, // 行内转账
  '03010201': authExecFPSTx, // FPS转账
  '03010202': action, // 外币转账
  '030103': authExecTelegraphicTx, // 电汇
  '03010401': auth, // 批量转账
  '03010501': auth, // 批量发薪
  '030107': action, // 登记第三者账户
  '030201': '', // 自动转账收款
  '0303': updateScheduleDateAuth, // 预约交易管理
  '0402': openDepositAuth, // 开立定期存款
  '0403': action, // 更改到期指示
  '050102': currencyExchangeAuth, // 货币兑换
  '050201': fundSubscriptionAuth, // 基金认购
  // '05020201': fundChangeAuth, // 我的基金（转换赎回）
  // '05020202': fundRedeemAuth, // 我的基金（转换赎回）
  '060101': orderPayTranAuth, // 缴付账单
  // '06010201': saveMyMerchantAuth, // 我的商户清单
  // '06010202': updateMyMerchantAuth, // 我的商户清单
  // '06010203': deleteMyMerchantAuth, // 我的商户清单
  '060103': '', // 预约缴付管理
  '10': chequeBookAuth // 申请支票簿
};