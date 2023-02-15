/*
 * @Author: zhangcheng
 * @Date: 2022-02-18 09:09:43
 * @LastEditTime: 2022-04-24 19:12:05
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\constant\account-management.js
 */
/** 转账汇款API */
export default {
  depositCasaAccount: '/accountManagement/depositCasaAccount', //活期账户列表查询
  depositFixeAccount: '/accountManagement/depositFixeAccount', //定期账户列表查询
  investmentSecAccount: '/accountManagement/investmentSecAccount', //股票托管账户列表查询
  investmentInvAccount: '/accountManagement/investmentInvAccount', //投资账户列表查询
  getLoansAccountList: '/accountManagement/loanAccount', //贷款账户列表查询
  getStockAccountDetail: '/mock/accountOverview/stockAccountDetailQuery', //股票托管账户详情查询
  getInvestAccountDetail: '/mock/accountOverview/investAccountDetailQuery', //投资账户详情查询
  getLoansAccountDetail: '/accountManagement/loanAccountDetails', //贷款账户详情查询
  getLoansAccountNo: '/accountManagement/loanAccountDropDownQuery', //贷款账号查询
  getTransDetailList: '/transactionDetails/select', //交易明细列表查询
  getTransAccountList: '/transactionDetails/transactionAccount', //交易明细账户列表查询
  downloadTransDetail: '/transactionDetails/download', //交易明细列表下载
  getEleStatementList: '/electronicStatrments/select', //电子结单列表查询
  getstatementsAccount: '/electronicStatrments/statementsAccount', //电子结单账户列表查询
  // previewStatementPdf: '/mock/accountOverview/previewStatementPdf', //电子结单pdf预览
  downloadStatement: '/electronicStatrments/viewOrDownload', //电子结单pdf预览/下载
  getEleReceiptList: '/mock/accountOverview/eleReceiptList', //电子通知书列表查询
  previewEleReceiptPdf: '/mock/accountOverview/previewEleReceiptPdf', //电子通知书pdf预览
  downloadEleReceipt: '/mock/accountOverview/downloadEleReceipt', //电子通知书pdf下载
}