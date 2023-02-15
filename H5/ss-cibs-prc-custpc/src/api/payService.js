/*
 * @Author: your name
 * @Date: 2022-06-28 10:26:24
 * @LastEditTime: 2022-06-28 10:26:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\api\payService.js
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

axios.defaults.headers.common["Authorization"] = getToken()

/**
 * @description 缴付账单-付款账户列表
 */
export async function account() {
  try {
    const {
      body
    } = await axios.post(URI.account)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴费服务-余额查询
 */
export async function queryPayAccountBalance(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryPayAccountBalance, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 賬單號碼的校驗
 */
 export async function checkMerchantBillNo(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkMerchantBillNo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 我的商户清单-账单号码校验接口
 */
 export async function checkMyMerchantBillNo(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkMyMerchantBillNo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 预约缴付账单修改-授权
 */
export async function subscribePayModifyAuth(params) {
  try {
    const res = await axios.post(URI.subscribePayModifyAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 新增我的商户授权
 */
export async function saveMyMerchantAuth(params) {
  try {
    const res = await axios.post(URI.saveMyMerchantAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 修改我的商户授权
 */
export async function updateMyMerchantAuth(params) {
  try {
    const res = await axios.post(URI.updateMyMerchantAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}



/**
 * @description 删除我的商户授权
 */
export async function deleteMyMerchantAuth(params) {
  try {
    const res = await axios.post(URI.deleteMyMerchantAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 预约缴付取消-授权
 */
export async function subscribePayCancelAuth(params) {
  try {
    const res = await axios.post(URI.subscribePayCancelAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴付账单-商户类别列表
 */
export async function queryMerchantTypeList(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryMerchantTypeList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 是否高风险商户校验
 */
 export async function isHighRiskMerchant(params) {
  try {
    const {
      body
    } = await axios.post(URI.isHighRiskMerchant, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴付账单-商户名称列表
 */
export async function queryMerchantList(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryMerchantList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询我的商户清单详情
 */
 export async function myMerchantDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.myMerchantDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 我的商户清单-高风险商户类别接口
 */
 export async function queryHighMerTypeList(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryHighMerTypeList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴付账单-商户名称列表
 */
export async function accountype() {
  try {
    const {
      body
    } = await axios.post(URI.accountype)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴付账单-我的商户清单
 */
export async function myMerchantList(params) {
  try {
    const {
      body
    } = await axios.post(URI.myMerchantList,{
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴付账单-全部商户名单
 */
export async function alllist(params) {
  try {
    const {
      body
    } = await axios.post(URI.alllist, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询个人客户信息-判断是否需要授权
 */
export async function queryCstMessage(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryCstMessage, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴付账单-信息录入提交
 */
export async function orderPayConfirmStep(params) {
  try {
    const otpdemo= await axios.post(URI.orderPayConfirmStep, {
      ...params
    })
    return otpdemo
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 缴付账单-全部商户名单
 */
export async function queryMerchantListPage(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryMerchantListPage, {
      ...params
    })

    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴付账单-全部商户名单
 */
export async function saletype() {
  try {
    const {
      body
    } = await axios.post(URI.saletype)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴费服务-我的商户清单-商户名称列表查询
 */
export async function salename() {
  try {
    const {
      body
    } = await axios.post(URI.salename)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 我的商户清单-账单类别列表查询
 */
export async function typeone() {
  try {
    const {
      body
    } = await axios.post(URI.typeone)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 我的商户清单-高风险商户录入
 */
export async function updateMyMerchantSubmit(params) {
  try {
    const otpdemo= await axios.post(URI.updateMyMerchantSubmit, {
      ...params
    })
    return otpdemo
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴费服务-预约缴付-缴付账单列表
 */
export async function accountone(params) {
  try {
    const {
      body
    } = await axios.post(URI.accountone, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询缴付账单详情
 */
 export async function orderPayDetails(params) {
  try {
    const {
      body
    } = await axios.post(URI.orderPayDetails, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴费服务-刪除商戶清單
 */
export async function deleteMyMerchantSubmit(params) {
  try {
    const otpdemo= await axios.post(URI.deleteMyMerchantSubmit, {
      ...params
    })
    return otpdemo
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description //繳費服務新增提交
 */
export async function saveMyMerchantSubmit(params) {
  try {
    const otpdemo= await axios.post(URI.saveMyMerchantSubmit, {
      ...params
    })
    return otpdemo
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 缴费服务-预约缴付-缴付账单修改
 */
export async function update(params) {
  try {
    const otpdemo= await axios.post(URI.update, {
      ...params
    })
    return otpdemo
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description //预约缴付取消
 */
export async function subscribePayCancel(params) {
  try {
    const otpdemo= await axios.post(URI.subscribePayCancel, {
      ...params
    })
    return otpdemo
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description //缴付账单信息-详情查询
 */
export async function orderPayConfirmDetails(params) {
  try {
    const {
      body
    } = await axios.post(URI.orderPayConfirmDetails, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description //缴付账单信息-详情查询
 */
export async function orderPayTranAuth(params = {
  authReqInfo: {},
  body: {}
}) {
  try {
    const res = await axios.post(URI.orderPayTranAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description //货币兑换已授权交易提交
 */
export async function currencyExchangeAuth(params) {
  try {
    const res = await axios.post(URI.currencyExchangeAuth, {
      ...params
    })
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}
