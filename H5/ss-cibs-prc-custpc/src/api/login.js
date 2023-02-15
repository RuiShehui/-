import { getToken } from '@/utils/user'
import { URI, TRANCODE } from '../constant'
import { async } from 'q'
import axios from './'

axios.defaults.headers.common["Authorization"] = getToken()

/**
 * @description 登录
 * @params custNo 客户号
 * @params password 密码
 * @params userName 账户名
 */

export async function login(params) {
  try {
    const imageToken = sessionStorage.getItem("imgToken")
    sessionStorage.setItem('token', imageToken)
    const {
      body
    } = await axios.post(URI.login, {
      ...params
    })
    return body
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @description 管理员首次登录验证
 * @params custNo 登录网银客户号
 * @params password 登录密码
 * @params userName 登录用户名
 */

export async function checkFirstPwdForAdmin(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.checkFirstPwdForAdmin, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 获取token

 */

export async function preToken(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.preToken, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 验证Email初始密码
 * @params firstPassword 邮件密码
 * @params token 初始密码验证token
 * @params userName 登录用户名
 */

export async function getEmailPassword(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.getEmailPassword, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 检查用户是否需要首次登录
 * @params custNo 客户号
 * @params verifyCode 验证码
 * @params userName 登录用户名
 */

export async function checkUserFirstLogin(
  params
) {
  try {
    const {
      body,
      headers
    } = await axios.post(URI.checkUserFirstLogin, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 图片验证

 */

export async function verifyImg() {
  try {
    const {
      body
    } = await axios.post(URI.verifyImg)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 获取OTP验证码
 * @params userName 用户名
 */

export async function getOTPCode(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.getOTPCode, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 验证OTP验证码
 * @params userName 用户名
 */

export async function checkOTPCode(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.checkOTPCode, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 验证Email初始密码
 * @params firstPassword 初始密码
 * @params token to
 * @params userName 用户名
 *    
 */

export async function checkEmailPassword(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.checkEmailPassword, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 登出
 */

export async function logoOut() {
  try {
    const logoutResult = await axios.post(URI.logout,
      {skip: true
    })
    return logoutResult
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 检查用户新设置的登录名和登录密码
 */

export async function checkNewLogonInfo(
  params
) {
  try {
    const checkNewLogonInfo = axios.post(URI.checkNewLogonInfo, {
      ...params
    })
    return checkNewLogonInfo
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 检查用户新设置的登录名和登录密码
 */

export async function updatePwd(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.updatePwd, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设置用户新登录名和登录密码
 */

export async function setNewLogonInfo(
  params
) {
  try {
    const logonInfo = await axios.post(URI.setNewLogonInfo, {
      ...params
    })
    return logonInfo
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询安全问题
 */

export async function retrieveQuestion(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.retrieveQuestion, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设置安全问题
 */

export async function createPrivateAnswer(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.createPrivateAnswer, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 检查是否需要校验验证码
 */

export async function loginValid(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.loginValid, {
      ...params
    },{
      skip: true
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 检查是否需要校验验证码
 */

export async function checkHKIDCode4Login(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.checkHKIDCode4Login, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 获取当前时间
 */

export async function getNow(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.getNow, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 获取公钥
 */

export async function getHsmPublicKey(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.getHsmPublicKey, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 验证证件类型/证件号码/账户号码
 */

export async function personalVerify(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.personalVerify, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 获取私密问题
 */

export async function getPrivateAnswerVerify(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.getPrivateAnswerVerify, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 私密答案验证
 */

export async function privateAnswerVerify(
  params
) {
  try {
    const anwser = await axios.post(URI.privateAnswerVerify,
      [...params]

    )
    return anwser
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户名找回OTP验证
 */

export async function retrieveOTPVerify(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.retrieveOTPVerify, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 获取OTP验证码---验证手机号
 */

export async function getRetrieveOTPVerifyCode(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.getRetrieveOTPVerifyCode, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 提交修改用户名
 */

export async function getNewUserName(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.getNewUserName, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 证件类型查找
 */

export async function userType(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.userType, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 首次登录密码验证
 */

export async function checkFirstPwd(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.checkFirstPwd, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设置用户新登录密码
 */

export async function setNewLogonPWD(
  params
) {
  try {
    const LogonPWD = await axios.post(URI.setNewLogonPWD, {
      ...params
    })
    return LogonPWD
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 设置用户新登录密码
 */

export async function checkResetPwd(
  params
) {
  try {
    const LogonPWD = await axios.post(URI.checkResetPwd, {
      ...params
    })
    return LogonPWD
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 设置用户新登录密码
 */

export async function checkResetPwdOTPCode(
  params
) {
  try {
    const LogonPWD = await axios.post(URI.checkResetPwdOTPCode, {
      ...params
    })
    return LogonPWD
  } catch (error) {
    console.log(error)
    return false
  }
}