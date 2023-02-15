/*
 * @Author: ZhangZhen
 * @Date: 2022-02-18 09:09:43
 * @LastEditTime: 2022-06-02 18:06:24
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\constant\payment-apis.js
 */
/** 转账汇款API */
export default {
  innerBankSubmitInnerBankTx: '/payment/innerBank/submitInnerBankTx', // 行内转账-交易
  innerBankDeleteRecentCreditAcct: '/payment/innerBank/deleteRecentCreditAcct', // 行内转账-删除最近收款人
  innerBankQueryRecentCreditAcct: '/payment/innerBank/queryRecentCreditAcct', // 行内转账-查询最近收款人
  innerBankGetPreviousInfo: '/payment/innerBank/getPreviousInfo', // 行内转账-获取收款账户/付款账户信息
  nextStepValidate: '/payment/innerBank/nextStepValidate', // 行内转账-提交前置校验 
  innerBankQueryRegAcctList: '/payment/innerBank/queryRegAcctList', // 行内转账-已登记第三者账户查询

  authExecFPSTx: '/payment/fps/authExecFPSTx', // FPS-轉賬交易授权及执行
  checkFPSTermStatus: '/payment/fps/checkFPSTermStatus', // FPS-查詢用户FPS服務条款状态
  deleteFPSRecentDebitAcct: '/payment/fps/deleteRecentDebitAcct', // FPS-删除最近收款人
  getFPSPreviousInfo: '/payment/fps/getPreviousInfo', // FPS-录入页面“前置信息”查詢
  queryFPSRegAcctList: '/thirdPartyAccountReg/findInterBankTransferRegPageList', // FPS-查询已登记第三方账户
  retrieveFPSRecentDebitAcct: '/payment/fps/retrieveRecentDebitAcct', // FPS-查询最近收款账户
  submitFPSTx: '/payment/fps/submitFPSTx', // FPS-轉賬交易提交
  fpsSubmitValidate: '/payment/fps/submitValidate', // FPS-下一步检查并反显数据 
  updateFPSTermStatus: '/payment/fps/updateFPSTermStatus', // FPS-更新用户服務条款状态

  globalAuthExecTelegraphicTx: '/payment/telegraphic/authExecTelegraphicTx', // 电汇-外币轉賬交易授权及执行
  globalDeleteRecentDebitAcct: '/payment/telegraphic/deleteRecentDebitAcct', // 电汇-刪除最近收款人
  globalGetPreviousInfo: '/payment/telegraphic/getPreviousInfo', // 电汇-录入信息'前置信息'查询
  globalQueryRegAcctList: '/payment/telegraphic/queryRegAcctList', // 电汇-查询已登记第三方账户
  globalRetrieveRecentDebitAcct: '/payment/telegraphic/retrieveRecentDebitAcct', // 电汇-查询最近收款账户
  globalSubmitTelegraphicTx: '/payment/telegraphic/submitTelegraphicTx', // 电汇交易提交

  chatsauthExecFPSTx: '/payment/chats/authExecFPSTx', // 外币转账-交易授权及执行
  chatsDeleteRecentDebitAcct: '/payment/chats/deleteRecentDebitAcct', // 外币转账-删除最近收款人
  chatsGetPreviousInfo:'/payment/chats/getPreviousInfo', // 外币转账-录入页面“前置信息”查詢
  chatsQueryRegAcctList: '/payment/chats/queryRegAcctList', // 外币转账-查询已登记第三方外币转账账户
  chatsRetrieveRecentDebitAcct: '/payment/chats/retrieveRecentDebitAcct', // 外币转账-查询最近收款账户
  chatsSubmitFPSBankTx: '/payment/chats/submitFPSBankTx', // 外币转账-外币轉賬交易提交

  findInnerBankRegPageList: '/thirdPartyAccountReg/findInnerBankRegPageList', // 登记第三者账户-行内账户-获取列表
  findAccountName: '/thirdPartyAccountReg/findAccountName', // 登记第三者账户-行内账户-获取新增前置
  addInnerBankReg: '/thirdPartyAccountReg/addInnerBankReg', // 登记第三者账户-行内账户-新增
  updateInnerBankReg: '/thirdPartyAccountReg/updateInnerBankReg', // 登记第三者账户-行内账户-更新
  removeInnerBankReg: '/thirdPartyAccountReg/removeInnerBankReg', // 登记第三者账户-行内账户-删除
  
  findInterBankTransferRegPageList: '/thirdPartyAccountReg/findInterBankTransferRegPageList', // 登记第三者账户-本地跨行-获取列表
  addInterBankTransferReg: '/thirdPartyAccountReg/addInterBankTransferReg', // 登记第三者账户-本地跨行-新增
  updateInterBankTransferReg: '/thirdPartyAccountReg/updateInterBankTransferReg', // 登记第三者账户-本地跨行-更新
  findInnerBankRegDetail: '/thirdPartyAccountReg/findInnerBankRegDetail', // 登记第三者账户-本地跨行-详情
  removeInterBankTransferReg: '/thirdPartyAccountReg/removeInterBankTransferReg', // 登记第三者账户-本地跨行-删除
  findFpsAcctInfo: '/thirdPartyAccountReg/findFpsInfo', // FPS账户信息查询服务
  findFpsInfo:'/FPSAccountBinding/getFpsPayeeInfo', // FPS信息查询服务
  /** 2022-06-01 */
  addInterBankTransferChats: '/thirdPartyAccountReg/addInterBankTransferChats', // 跨行转账登记-外币新增
  updateInterBankTransferChats: '/thirdPartyAccountReg/updateInterBankTransferChats', // 跨行转账登记-外币修改
  removeInterBankTransferChats: '/thirdPartyAccountReg/removeInterBankTransferChats', // 跨行转账登记-外币删除
  /** 2022-06-01 */

  addTransactionDraft: '/transaction-draft/addTransactionDraft', // 公共-交易草稿新增
  findTransactionDraftPageList: '/transaction-draft/findTransactionDraftPageList', // 公共-交易草稿查询列表

  findGlobalRemittanceRegPageList: '/thirdPartyAccountReg/findGlobalRemittanceRegPageList', // 登记第三者账户-电汇账户-列表查询
  findGlobalRemittanceRegDetail: '/thirdPartyAccountReg/findGlobalRemittanceRegDetail', // 登记第三者账户-电汇账户-详情查询
  getSwiftDetails: '/thirdPartyAccountReg/getSwiftDetails', // 根据SwiftCode反显收款银行国家信息
  addGlobalRemittanceReg: '/thirdPartyAccountReg/addGlobalRemittanceReg', // 登记第三者账户-电汇账户-新增
  updateGlobalRemittanceReg: '/thirdPartyAccountReg/updateGlobalRemittanceReg', // 登记第三者账户-电汇账户-修改
  removeGlobalRemittanceReg: '/thirdPartyAccountReg/removeGlobalRemittanceReg', // 登记第三者账户-电汇账户-删除

  recentTransferListQuery: '/recent-transfer/recentTransferListQuery', // (2022-05-26) 最近转账记录-获取列表
  findRecentTransferDetail: '/recent-transfer/findRecentTransferDetail', // (2022-05-26) 最近转账记录详情查询

  getCountryList: '/thirdPartyAccountReg/getCountryList', // 公共-获取国家地区列表
  // getBankList: '/mock/common/getBankList', // 公共-获取FPS银行列表
  queryChatsBanks: '/thirdPartyAccountReg/queryChatsBanks', // 公共-获取CHATS银行列表--外币转账
  getBankList: '/thirdPartyAccountReg/getPayeeBankOrOrgList', // 公共-获取银行列表--转数快
  getAuthReminders: '/authcenter/gcTransactionAbstract/searchSubmitterInToBeAuth', // 授权中心-获取授权提醒人 
  queryPayAccountBalance: '/orderPay/queryPayAccountBalance',// 公共-查询账户余额详情

  recentPayeeQuery: '/recentPayeeMange/recentPayeeQuery', // 最近收款人-列表查询
  recentPayeeDelete: '/recentPayeeMange/recentPayeeDelete', // 最近收款人-删除
  getRecentRecordsAccts: 'recent-transfer/getPreviousInfo',
}
