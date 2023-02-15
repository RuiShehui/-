
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

axios.defaults.headers.common["Authorization"] = getToken()

/**
 * @description 发送短信验证码
 */
export async function proSendOtpCode(params) {
  try {
    const {
      body
    } = await axios.post(URI.proSendOtpCode, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 校验短息验证码
 */
export async function proCheckOtpCode(params) {
  try {
    const {
      body
    } = await axios.post(URI.proCheckOtpCode, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * 查询账户余额查询
 * @description 通过账户和币种，查询账户余额详情
 * @param {{}} params 查询参数
 * @example { "accountNo": "248100000513", "accountType": "", "category": "", "currencyType": "HKD" }
 */
export async function queryPayAccountBalance(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.queryPayAccountBalance, {
      ...params
    });
    return body;
  } catch (error) {
    console.error(`余额查询出错啦, 原因: ${error}`);
    return false;
  }
}


/**
 * 授权提交
 * @description
 * @param {{}} params 查询参数
 */
export async function action(params = {}) {
  try {
    const res = await axios.post(URI.action,params);
    return res;
  } catch (error) {
    return false;
  }
}

/**
 * 授权提交
 * @description
 * @param {{}} params 查询参数
 */
export async function modifyPwdNoticeDate() {
  try {
    const {
      body
    } = await axios.post(URI.modifyPwdNoticeDate);
    return body;
  } catch (error) {
    return false;
  }
}

/**
 * 获取SoftToken信息
 * @description 
 * @param {{}} params 查询参数
 */
export async function softTokenInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.softTokenInfo,{...params});
    return body;
  } catch (error) {
    return false;
  }
}

/**
 * 获取SoftToken信息
 * @description 
 * @param {{}} params 查询参数
 */
export async function logff() {
  try {
    const {
      body
    } = await axios.post(URI.logff);
    return body;
  } catch (error) {
    return false;
  }
}
/**
 * 获取SoftToken信息
 * @description 
 * @param {{}} params 查询参数
 */
export async function registerQRCode() {
  try {
    const {
      body
    } = await axios.post(URI.registerQRCode);
    return body;
  } catch (error) {
    return false;
  }
}

// /**
//  *
//  * 发送OTP
//  * @params otpType 类型 true
//  *         target  发送目标 false
//  */
// export async function sendOtp(params) {
//   if(window.axios) {
//     axios = window.axios
//     axios.defaults.headers.common["Authorization"] = getToken()
//   }
//   try {
//     const otpCode = await axios.post(URI.optSend, {
//       ...params
//     });
//     console.log("otpCode", otpCode)
//     return otpCode
//   } catch (error) {
//     return false
//   }
// }

// /**
//  *
//  * 验证OTP
//  * @params otpType 类型 true
//  *         target  发送目标 false
//  *         code    验证码值 true
//  */
// export async function validOtp(params) {
//   try {
//     const {
//       body
//     } = await axios.post(URI.validOtp, {
//       ...params
//     });
//     return body
//   } catch (error) {
//     return false
//   }
// }

/**
 * 发送邮件
 */
export async function remindAutherByEmail(params) {
  try {
    const {
      body
    } = await axios.post(URI.remindAutherByEmail, {
      ...params
    });
    return body
  } catch (error) {
    return false
  }
}

export async function generateGetSessionKey(clientX, clientY) {
  try {
    let body = {};
    await axios.post(URI.generateGetSessionKey, { clientX, clientY }).then(res => {body = res.body });
    return body
  } catch (error) {
    return false
  }
}



