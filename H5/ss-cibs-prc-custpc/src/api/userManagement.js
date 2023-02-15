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
 * @description 用户管理-操作员分页查询
 * @params current 分页
 * @params customerNo 客户号 123456789
 * @params userCode 用户代码 INM001
 * @params size 分页尺寸 
 * 
 */
export async function queryOperationListPage({
  current,
  size,
  userStatus,
  userName,
  userType,
  ebankCstmNo
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryOperationListPage, {
      current: current,
      size: size,
      userStatus: userStatus,
      userName: userName,
      userType: userType,
      ebankCstmNo: ebankCstmNo
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理-操作员详情查询(个人当前用户基本详情查询)
 * @params userCode 用户代码 INM001
 * 
 */

export async function queryOperatorInfo({
  userCode,
  cstmNo
}) {
  try {
    const result = await axios.post(URI.queryOperatorInfo, {
      userCode: userCode,
      cstmNo: cstmNo
    })
    return result
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 个人当前用户基本信息加密查询
 * @params userCode 用户代码 INM001
 * 
 */

export async function queryOperatorEncryption(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryOperatorEncryption, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 个人当前用户基本详情查询 需要验证OTP
 * @params userCode 用户代码 INM001
 * 
 */

export async function queryOperatorInfoOtp(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryOperatorInfoOtp, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理-个人当前用户菜单权限列表查询
 * @params cstmNo 客户号 123456789
 * @params userCode 用户代码 INM001
 * 
 */

export async function queryMenuPermission({
  cstmNo,
  userCode
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryMenuPermission, {
      cstmNo: cstmNo,
      userCode: userCode
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/** 
 * @description 用户管理 - 查询个人账户
 * 
 */

export async function queryAccount() {
  try {
    const {
      body
    } = await axios.post(URI.queryAccount)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理-查询用户可操作的账号
 * 
 */

export async function queryCstUserAcctList(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryCstUserAcctList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 用户管理-个人账户限额查询
 * @params cstmNo 客户号 123456789
 * @params userCode 用户代码 INM001
 * 
 */

export async function queryAccountListLimit() {
  try {
    const {
      body
    } = await axios.post(URI.queryAccountListLimit)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理-客户可操作的用户
 * 
 */

export async function queryAllOperationList() {
  try {
    const {
      body
    } = await axios.post(URI.queryAllOperationList)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 用户管理-个人当前用户账户限额查询
 * @params cstmNo 客户号 123456789
 * @params userCode 用户代码 INM001
 * 
 */
export async function queryUserAccountLimit({
  cstmNo,
  userCode
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryUserAccountLimit, {
      cstmNo: cstmNo,
      userCode: userCode
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理-查询个人菜单(查询所有菜单)
 * @params cstmNo 客户号 123456789
 * @params userCode 用户代码 INM001
 * 
 */
export async function queryMenuAll() {
  try {
    const {
      body
    } = await axios.post(URI.queryMenuAll)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 检查新增用户信息
 * 
 */
export async function checkOperatorInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkOperatorInfo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 检查新增用户信息
 * 
 */
export async function checkAccountLimit(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkAccountLimit, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理-个人用户新增前置提交(操作员新增)
 * @params menuPermission  菜单数组
 * @params operator  操作员基本信息
 * @params userAccountLimit  账户限额
 * 
 */
export async function saveOperatorSubmit(params) {
  try {
    const save = await axios.post(URI.saveOperatorSubmit, {
      ...params
    })
    return save
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 个人用户新增交易已授权
 * 
 */
export async function saveOperatorAuth(params = {
  body: {},
  authReqInfo: {}
}) {
  try {
    const res = await axios.post(URI.saveOperatorAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理-操作员删除(删除用户前置提交)
 * @params userCode 用户代码 INM001
 * 
 */

export async function delelteOperator({
  userCode,
  // cstmNo,
  empowerGroup,
  userType
}) {
  try {
    const deletse = await axios.post(URI.delelteOperator, {
      userCode: userCode,
      // cstmNo: cstmNo,
      empowerGroup: empowerGroup,
      userType
    })
    return deletse
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 个人用户删除交易已授权
 * 
 */
export async function delelteOperatorAuth(params = {
  body: {},
  authReqInfo: {}
}) {
  try {
    const res = await axios.post(URI.delelteOperatorAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 用户管理 - 检查用户修改信息是否还在授权审批中
 * @params flowNo 流水号
 * @params userCode 操作员编号
 *
 */
export async function checkUpdateAuthStatus({
  operationType,
  userCode
}) {
  try {
    const {
      body
    } = await axios.post(URI.checkUpdateAuthStatus, {
      operationType: operationType,
      userCode: userCode
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 用户管理 - 修改用户信息前置提交(操作员修改)
 * @params menuPermission  菜单数组
 * @params operator  操作员基本信息
 * @params userAccountLimit  账户限额
 * 
 */
export async function updateOperator(params) {
  try {
    const update = await axios.post(URI.updateOperator, {
      ...params
    })
    return update
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 用户管理 - 个人用户修改交易已授权
 * 
 */
export async function updateOperatorAuth(params = {
  body: {},
  authReqInfo: {}
}) {
  try {
    const res = await axios.post(URI.updateOperatorAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - TOP验证码获取
 * @params number 短讯号
 *
 */
export async function getTopVerificationCode({
  number
}) {
  try {
    const {
      body
    } = await axios.post(URI.getTopVerificationCode, {
      number: number
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - TOP验证验证码
 * @params phone 验证码
 *
 */
export async function otpCodeVerification({
  phone
}) {
  try {
    const {
      body
    } = await axios.post(URI.otpCodeVerification, {
      phone: phone
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 重置密码
 * @params pwdStatus 用户密码状态, 0 - 新增 1 - 重置
 * @params repeatPwdType 重发密码原因, 0 未收到密码 1 忘记密码
 * @params userCode 用户编码
 *
 */
export async function updateSecret({
  pwdStatus,
  repeatPwdType,
  userCode
}) {
  try {
  const  Secret = await axios.post(URI.updateSecret, {
      pwdStatus: pwdStatus,
      repeatPwdType: repeatPwdType,
      userCode: userCode
    })
    return Secret
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 个人用户重发密码交易已授权
 * 
 */
export async function updateSecretAuth(params = {
  body: {},
  authReqInfo: {}
}) {
  try {
    const res = await axios.post(URI.updateSecretAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 用户启用停用
 * @params status 用户状态, 0 - 启用 1 - 停用
 * @params userCode 用户编码
 *
 */
export async function updateStatus({
  status,
  userCode,
  revokeReason
}) {
  try {
    const update = await axios.post(URI.updateStatus, {
      status: status,
      userCode: userCode,
      revokeReason: revokeReason
    })
    return update
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 用户启用停用已授权
 * 
 */
export async function updateStatusAuth(params = {
  body: {},
  authReqInfo: {}
}) {
  try {
    const res = await axios.post(URI.updateStatusAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 个人用户交易详情查询（授权详情查询）
 * 
 */
export async function operatorDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.operatorDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 证件签发地 / 国家查询
 * 
 */
export async function getListCardArea(params) {
  try {
    const {
      body
    } = await axios.post(URI.getListCardArea, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}