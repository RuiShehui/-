/*
 * @Author: zhangcheng
 * @Date: 2022-02-18 09:09:43
 * @LastEditTime: 2022-04-11 19:30:16
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\constant\fund.js
 */
/** 转账汇款API */
export default {
  checkInvestmentAccountAndRisk: '/fund/checkInvestmentAccountAndRisk', //对投资账户进行基本校验（投资风险）
  checkSubscriptionAndSuitability: '/fund/checkSubscriptionAndSuitability', //基金认购及适用性校验
  fundChange: '/fund/fundChange', //基金转换和适用性检查请求
  fundDiscountFee: '/fund/fundDiscountFee', //基金认购费/赎回费/转换费（折扣前）
  fundSubscriptionAuth: '/fund/fundSubscriptionAuth', //基金认购授权
  fundSubscriptionSubmit: '/fund/fundSubscriptionSubmit', //基金认购提交
  fundChangeSubmit: '/fund/fundChangeSubmit', //基金转换提交
  fundChangeAuth: '/fund/fundChangeAuth', //基金转换授权
  fundRedeemAuth: '/fund/fundRedeemAuth', //基金赎回授权
  fundRedeemRequest: '/fund/fundRedeemRequest', //基金赎回请求
  fundRedeemSubmit: '/fund/fundRedeemSubmit', //基金赎回请求
  // checkAccount: '/investment/checkAccount', //投资校验
  getFundDetails: '/fund/getFundDetails', //获取基金详情
  getFundComAllFundProduct: '/fund/getFundComAllFundProduct', //获取基金公司所有的基金列表
  getFundList: '/fund/querySubscriptionFund', //已购基金列表查询
  queryInvestmentAccount: '/fund/queryInvestmentAccount', //投资账号列表查询
  getFundTransitionInfo: '/mock/investment/fundTransitionInfo', //基金转换信息查询
  submitFundTransition: '/mock/investment/submitFundTransition', //基金转换信息提交
  submitredemptionFund: '/mock/investment/submitredemptionFund', //基金赎回信息提交
  checkFundNo: '/mock/investment/checkFundNo', //校验基金编号
  queryEnquiryForCLD: '/fund/queryEnquiryForCLD', //投资交易查询
  queryOtherProduct: '/fund/queryFundAndBondAndStructuredProduct', //投资交易查询
  getAllFunds: '/mock/investment/allFunds', //查询所有基金
}