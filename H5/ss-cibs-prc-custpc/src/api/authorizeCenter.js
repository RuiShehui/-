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
 * @description 授权中心 - 查询授权记录
 * 
 */
export async function queryAuthRecord(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryAuthRecord, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 我的提交/待我授权-交易详情页面 
 * 
 */
export async function searchAuthRecord(params) {
    try {
        const {
            body
        } = await axios.post(URI.searchAuthRecord, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 授权鉴权
 * 
 */
export async function authInEmpower(params) {
    try {
        const {
            body
        } = await axios.post(URI.authInEmpower, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 提交鉴权
 * 
 */
export async function authInSubmit(params) {
    try {
        const {
            body
        } = await axios.post(URI.authInSubmit, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 我的提交-待授权页面：交易撤销
 * 
 */
export async function transactionRevoke(params) {
    try {
        const {
            body
        } = await axios.post(URI.transactionRevoke, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 待我授权-已授权页面：已授权交易摘要列表查詢
 * 
 */
export async function searchAuthorized(params) {
    try {
        const {
            body
        } = await axios.post(URI.searchAuthorized, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 待我授权-待我授权页面：待我授权交易摘要列表查詢
 * 
 */
export async function searchByAuthorizer(params) {
    try {
        const {
            body
        } = await axios.post(URI.searchByAuthorizer, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 待我授权-待我授权页面：待我授权交易详情
 * 
 */
export async function queryDetail(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryDetail, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 我的提交-待授权/已结束页面：交易摘要列表查詢
 * 
 */
export async function searchBySubmitter(params) {
    try {
        const {
            body
        } = await axios.post(URI.searchBySubmitter, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 待我授权-已授权页面：提交人查詢
 * 
 */
export async function searchSubmitterInAuthorized() {
    try {
        const {
            body
        } = await axios.post(URI.searchSubmitterInAuthorized, {

        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 待我授权-待我授权页面：提交人查詢
 * 
 */
export async function searchSubmitterInToBeAuth() {
    try {
        const {
            body
        } = await axios.post(URI.searchSubmitterInToBeAuth, {})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 待我授权-待我授权页面：提交人查詢(未过滤)
 * 
 */
export async function searchAuther(params) {
    try {
        const {
            body
        } = await axios.post(URI.searchAuther, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 用户管理-待我授权-待我授权页面：数据列表查询
 * 
 */
export async function queryAuthsInManagment(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryAuthsInManagment, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 用户管理-我提交的-我提交的页面：数据列表查询
 * 
 */
export async function submitManagment(params) {
    try {
        const {
            body
        } = await axios.post(URI.submitManagment, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 待我授权-待我授权页面/已授权页面：交易类型查询
 * 
 */
export async function queryAllMenu(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryAllMenu, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 查询一个交易是否需要授权
 * 
 */
export async function queryTranIsAuth(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryTranIsAuth, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 待我授权-行内转账授权
 * 
 */
export async function authExecInterBankTx(params) {
    try {
        const res = await axios.post(URI.authExecInterBankTx, {
            ...params
        })
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 行内转账详情
 * 
 */
export async function getInnerBankDetail(params) {
    try {
        const {
            body
        } = await axios.post(URI.getInnerBankDetail, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 转数快详情
 * 
 */
export async function getFPSDetail(params) {
    try {
        const {
            body
        } = await axios.post(URI.getFPSDetail, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 外币转账
 * 
 */
export async function getTelegraphicDetail(params) {
    try {
        const {
            body
        } = await axios.post(URI.getTelegraphicDetail, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 电汇详情
 * 
 */
export async function getChatsDetail(params) {
    try {
        const {
            body
        } = await axios.post(URI.getChatsDetail, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 外币转账授权
 * 
 */
export async function authExecChatsTx(params) {
    try {
        const {
            body
        } = await axios.post(URI.authExecChatsTx, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 电汇授权
 * 
 */
export async function authExecTelegraphicTx(params) {
    try {
        const res = await axios.post(URI.authExecTelegraphicTx, {
            ...params
        })
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}