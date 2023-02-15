/*
 * @Author: zhangcheng
 * @Date: 2022-02-28 16:59:59
 * @LastEditTime: 2022-08-26 10:18:21
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \webbank-pc\src\api\sendOTP.js
 */
import {
  getToken
} from '@/utils/user'
import {
  URI,
  TRANCODE
} from '../constant'
import {
  async
} from 'q'
import axios from './'


/**
 * 
 * 发送OTP
 * @params otpType 类型 true  
 *         target  发送目标 false
 */
export async function sendOtp(params) {
  if(window.axios) {
    axios = window.axios
    axios.defaults.headers.common["Authorization"] = getToken()
  }
  try {
    const otpCode = await axios.post(URI.optSend, {
      ...params
    });
    console.log("otpCode", otpCode)
    return otpCode
  } catch (error) {
    return false
  }
}

/**
 * 
 * 验证OTP
 * @params otpType 类型 true  
 *         target  发送目标 false
 *         code    验证码值 true
 */
export async function validOtp(params) {
  
  try {
    const otpVaild = await axios.post(URI.validOtp, {
      ...params
    });
    return otpVaild
  } catch (error) {
    return error
  }
}
/**
 * 取消sosftToken
 */
 export async function cancelTradeInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.cancelTradeInfo, {
      ...params
    },{
      skip: true
    });
    return body
  } catch (error) {
    return false
  }
}