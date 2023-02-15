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
 * @description FPS账户绑定 - 校验客户号中文名称， 英文名称是否变更
 * 
 */
export async function checkLanguage() {
    try {
        const {
            body
        } = await axios.post(URI.checkLanguage)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description FPS账户绑定 - 校验接口
 * 
 */
export async function bindingCheck() {
    try {
        const {
            body
        } = await axios.post(URI.bindingCheck)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description FPS账户绑定 - 客户信息查询
 * 
 */
export async function queryT24Info() {
    try {
        const {
            body
        } = await axios.post(URI.queryT24Info)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description FPS账户绑定 - 客户信息查询
 * 
 */
export async function getInfo() {
    try {
        const {
            body
        } = await axios.post(URI.getInfo)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description FPS账户绑定 - 校验客户是否存在绑定信息
 * 
 */
export async function checkCustomInfo() {
    try {
        const {
            body
        } = await axios.post(URI.checkCustomInfo)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description FPS账户绑定 - 校验手机号是否一致
 * 
 */
export async function checkPhoneInfo() {
    try {
        const {
            body
        } = await axios.post(URI.checkPhoneInfo)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description FPS账户绑定 - 校验绑定邮箱是否一致
 * 
 */
export async function checkEmailInfo() {
    try {
        const {
            body
        } = await axios.post(URI.checkEmailInfo)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 交易授权设置-查询接口
 * @params modelType 类型
 * 
 */
export async function queryBindingInfo() {
    try {
        const {
            body
        } = await axios.post(URI.queryBindingInfo)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 交易授权设置 - 绑定（ 修改） 提交
 * @params modelType 类型
 * 
 */
export async function fpsAccountBindingSubmit(params) {
    try {
     const  submit= await axios.post(URI.fpsAccountBindingSubmit, {
            ...params
        })
        return submit
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置 - 绑定（ 修改） 提交
 * @params modelType 类型
 * 
 */
export async function fpsAccountUpdateSubmit(params) {
    try {
     const  submit= await axios.post(URI.fpsAccountUpdateSubmit, {
            ...params
        })
        return submit
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置 - 绑定（ 修改） 授权
 * @params modelType 类型
 * 
 */
export async function fpsAccountBindingAuth(params = {
    authReqInfo: {},
    body: {}
}) {
    try {
        const {
            body
        } = await axios.post(URI.fpsAccountBindingAuth, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置 - 绑定（ 修改） 详情查询
 * @params modelType 类型
 * 
 */
export async function fpsAccountBindingAuthDetails(params) {
    try {
        const {
            body
        } = await axios.post(URI.fpsAccountBindingAuthDetails, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置 - 解绑提交
 * @params modelType 类型
 * 
 */
export async function fpsAccountUnbindingSubmit(params) {
    try {
        const {
            body
        } = await axios.post(URI.fpsAccountUnbindingSubmit, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置 - 解绑—— 授权
 * @params modelType 类型
 * 
 */
export async function fpsAccountUnbindingAuth(params = {
    authReqInfo: {},
    body: {}
}) {
    try {
        const {
            body
        } = await axios.post(URI.fpsAccountUnbindingAuth, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置 - 解绑——详情
 * @params modelType 类型
 * 
 */
export async function fpsAccountUnbindingAuthDetails(params) {
    try {
        const {
            body
        } = await axios.post(URI.fpsAccountUnbindingAuthDetails, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 账户信息查询
 * @params modelType 类型
 * 
 */
export async function getAcctInfo() {
    try {
        const {
            body
        } = await axios.post(URI.getPreviousInfo)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}