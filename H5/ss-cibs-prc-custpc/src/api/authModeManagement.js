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
 * @description 授权模板维护查询
 * @params current 分页
 * @params customerNo 客户号 T24160578001
 * @params userCode 用户代码 INM001
 * @params size 分页尺寸 
 * 
 */

export async function queryListTemplate({
  modelType,
  modelName
  // ebankCstmNo
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryListTemplate, {
      modelType: modelType,
      modelName: modelName
      // ebankCstmNo: ebankCstmNo
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 授权模板维护新增
 * @params cstomerNo 客户号 T24160578001
 * @params userCode 用户代码 INM001
 * 
 */

export async function saveTemplate(params) {
  try {
    const saveTemlate = await axios.post(URI.saveTemplate, {
      ...params
    })
    return saveTemlate
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 授权模板维护新增——授权
 * 
 */
export async function saveInBankManageAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.saveInBankManageAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 授权模板维护——详情
 * 
 */

export async function queryDetailIn({
  modelCode
}) {
  try {
    const {
      body
    } = await axios.post(URI.queryDetailIn, {
      modelCode: modelCode
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 授权模板维护编辑
 * @params cstomerNo 客户号 T24160578001
 * @params userCode 用户代码 INM001
 * 
 */
export async function updateAuthTemplateCommit(params) {
  try {
    const  updateAuth = await axios.post(URI.updateAuthTemplateCommit, {
      ...params
    })
    return updateAuth
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 授权模板维护编辑——授权
 * 
 */
export async function updateAuthTemplateAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.updateAuthTemplateAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询当前用户下的授权提醒人
 */
export async function queryReminder(params = {}) {
  try {
    const { body } = await axios.post(URI.queryReminder, {
      ...params,
    });
    return body;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * @description 授权模板维护删除
 * @params cstomerNo 客户号 T24160578001
 * @params userCode 用户代码 INM001
 * 
 */

export async function delAuthTemplateCommit({
  modelCode
}) {
  try {
    const  delAuth = await axios.post(URI.delAuthTemplateCommit, {
      modelCode: modelCode
    })
    return  delAuth
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 授权模板维护删除——授权
 * 
 */
export async function delAuthTemplateAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.delAuthTemplateAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}