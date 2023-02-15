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
 * @description 账户管理分页查询
 * @params current 分页
 * @params cstmNo 客户号 T24160578001
 * @params accountType 账户类别
 * @params size 分页尺寸 
 * 
 */
export async function queryAccountList({
  accountType,
  cstmNo,
  current,
  size
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryAccountList, {
      accountType: accountType,
      cstmNo: cstmNo,
      current: current,
      size: size
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 账户管理未登记查询
 * @params current 分页
 * @params cstmNo 客户号 T24160578001
 * @params accountType 账户类别
 * @params size 分页尺寸 
 * 
 */
export async function queryUnregisteredAccount({
  accountType
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryUnregisteredAccount, {
      accountType: accountType
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 校验账户是否在授权审批中的状态
 * @params params
 * 
 */

export async function checkAccountAuthStatus({
  accountName,
  accountNo,
  accountType,
  currencyType
}) {
  try {
    const {
      body
    } = await axios.post(URI.checkAccountAuthStatus, {
      accountName: accountName,
      accountNo: accountNo,
      accountType: accountType,
      currencyType: currencyType
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 校验账户是否有在途交易
 * @params params
 * 
 */
export async function checkInTransitTransaction({
  accountName,
  accountNo,
  accountType,
  currencyType
}) {
  try {
    const {
      body
    } = await axios.post(URI.checkInTransitTransaction, {
      accountName: accountName,
      accountNo: accountNo,
      accountType: accountType,
      currencyType: currencyType
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 解除登记账户前置提交
 * @params accountNo 客户号 T24160578001
 * @params bindStatus 用户代码 INM001
 * 
 */
export async function updateBindStatus({
  accountNo,
  accountName,
  accountType,
  category,
  currencyType,
  bindStatus
}) {
  try {
    const BindStatus= await axios.post(URI.updateBindStatus, {
      accountNo: accountNo,
      accountName: accountName,
      accountType: accountType,
      category: category,
      currencyType: currencyType,
      bindStatus: bindStatus
    })
    return BindStatus
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 登记账户前置提交
 * @params params
 * 
 */
export async function saveRegisteredAccount(params) {
  try {
    const save = await axios.post(URI.saveRegisteredAccount, {
      ...params
    })
    return save
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 登记账户交易已授权
 * @params params
 * 
 */
export async function saveRegisteredAccountAuth(params = {
  body: {},
  authReqInfo: {}
}) {
  try {
    const res = await axios.post(URI.saveRegisteredAccountAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 解除登记账户已授权交易提交
 * @params params
 * 
 */
export async function updateBindStatusAuth(params = {
  body: {},
  authReqInfo: {}
}) {
  try {
    const res = await axios.post(URI.updateBindStatusAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户管理 - 用户账户交易详情查询
 * 
 */
export async function customerAccountDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.customerAccountDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}