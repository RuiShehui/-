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
 * @description 设定交易提示
 * @params params [] 
 * @params userCode 用户代码 INM001
 * 
 */
export async function transactionPromptSubmit(params) {
  try {
    const {
      body
    } = await axios.post(URI.transactionPromptSubmit, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设置交易指示授权
 * 
 */
export async function transactionPromptAuth(params = {
  authReqInfo: {},
  body: {}
}) {
  try {
    const {
      body
    } = await axios.post(URI.transactionPromptAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询交易指示
 * 
 */
export async function transactionPromptQuery({
  flowNo
}) {
  try {
    const {
      body
    } = await axios.post(URI.transactionPromptQuery, {
      flowNo: flowNo
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


// ================================需求变更，新接口======================================
/**
 * @description 设置交易指示提交—— 需求变更
 * @params params {}
 * 
 */
export async function setTransactionPromptSubmit(params) {
  try {
    const etTransaction = await axios.post(URI.setTransactionPromptSubmit, {
      ...params
    })
    return etTransaction
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设置交易指示返显 —— 需求变更
 * @params params {}
 * 
 */
export async function setTransactionPromptRecurrence(params) {
  try {
    const {
      body
    } = await axios.post(URI.setTransactionPromptRecurrence, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询交易指示 - 需求变更
 * @params params {}
 * 
 */
export async function setTransactionPromptQuery(params) {
  try {
    const {
      body
    } = await axios.post(URI.setTransactionPromptQuery, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 设置交易指示授权 - 需求变更
 * @params params {}
 * 
 */
export async function setTransactionPromptAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.setTransactionPromptAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}