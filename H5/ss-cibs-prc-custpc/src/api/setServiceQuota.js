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
 * @description 查询服务限额设定
 * @params customerClazz 客户级别 2
 * @params userCode 用户代码 INM001
 * 
 */
export async function queryQuotaInfo({
  customerClazz
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryQuotaInfo, {
      customerClazz: customerClazz,
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询服务限额设置结果
 * 
 */
export async function queryQuotaSetResult() {
  try {
    const {
      body
    } = await axios.post(URI.queryQuotaSetResult)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 判断服务限额设置是否有在授权审批中的交易（ 含待授权）
 * 
 */
export async function checkAuthQuata() {
  try {
    const {
      body
    } = await axios.post(URI.checkAuthQuata)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 更新服务限额设定
 * @params params [] 
 * @params userCode 用户代码 INM001
 * 
 */
export async function updateQuotaInfo(params) {
  try {
    const update = await axios.post(URI.updateQuotaInfo,
      params
    )
    return update
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 更新服务设定限额授权
 * @params params
 * 
 */
export async function updateQuotaInfoAuth(params = {
  authReqInfo: {},
  body: {}
}) {
  try {
    const {
      body
    } = await axios.post(URI.updateQuotaInfoAuth,
      params
    )
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询授权交易详情
 * @params params
 * 
 */
export async function queryAuthDetails(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryAuthDetails,
      params
    )
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询设定小额转账
 * 
 */
export async function querySetResult() {
  try {
    const {
      body
    } = await axios.post(URI.querySetResult)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 判断设定小额转账是否有在授权审批中的交易（ 含待授权）
 * @params params [] 
 */
export async function checkAuthStt(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkAuthStt, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设定小额转账交易详情查询
 * @params params [] 
 */
export async function setUpSmallTransferDetails({
  commFlow
}) {
  try {
    const {
      body
    } = await axios.post(URI.setUpSmallTransferDetails, {
      commFlow: commFlow
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设定小额转账提交
 * @params params [] 
 * @params userCode 用户代码 INM001
 * 
 */
export async function setUpSmallTransferSubmit(params) {
  try {
    const setUpSmall = await axios.post(URI.setUpSmallTransferSubmit, {
      ...params
    })
    return setUpSmall
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设定小额转账授权
 * 
 */
export async function setUpSmallTransferAuth(params = {
  authReqInfo: {},
  body: {}
}) {
  try {
    const {
      body
    } = await axios.post(URI.setUpSmallTransferAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 查询电子结单
 * 
 */
export async function queryElecState({
  current,
  size
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryElecState, {
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
 * @description 修改电子结单状态查询
 * 
 */
export async function updateElecStateQuery({
  flowNo,
}) {
  try {
    const {
      body
    } = await axios.post(URI.updateElecStateQuery, {
      flowNo: flowNo,
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 判断电子结单是否在授权中
 * 
 */
export async function updateElecState(params) {
  try {
    const {
      body
    } = await axios.post(URI.updateElecState, params)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 修改电子结单状态提交
 * 
 */
export async function updateElecStateSubmit(params) {
  try {
    const update = await axios.post(URI.updateElecStateSubmit, params)
    return update
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 修改电子结单状态授权
 * 
 */
export async function updateElecStateAuth(params = {
  authReqInfo: {},
  body: {}
}) {
  try {
    const {
      body
    } = await axios.post(URI.updateElecStateAuth, params)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}