/*
 * @Author: zhangcheng
 * @Date: 2022-02-28 17:00:57
 * @LastEditTime: 2022-08-26 10:05:06
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\constant\public.js
 */
/** 公共模块 */
export default {
  proSendOtpCode: '/public/proSendOtpCode', // 发送短信验证码
  proCheckOtpCode: '/public/proCheckOtpCode', // 发送短信验证码
  action: "/unify-auth/action", //授权提交
  sendMsg: "/msg/sendMsg", //发送短信
  optSend: "/public/otp/send", // 发送OTP
  validOtp: "/public/otp/valid", // 验证OTP
  modifyPwdNoticeDate: "/IndividualSet/modifyPwdNoticeDate", //更新密码修改提醒
  softTokenInfo: '/softtoken/getInfo', // 获取SoftToken信息
  logff: '/softtoken/logoff', //终止流动保安服务
  registerQRCode: '/softtoken/registerQRCode', //终止流动保安服务
  newTradeToken: '/publicInfo/newTradeToken', //防重提token获取
  cancelTradeInfo:'/softtoken/cancelTradeInfo' // 取消softToken
}