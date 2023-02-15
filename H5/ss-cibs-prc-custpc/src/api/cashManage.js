import {
    getToken
} from '@/utils/user'
import {
    URI,
} from '../constant'
import axios from './'

axios.defaults.headers.common["Authorization"] = getToken()

/**
 * @description 查询付款账户
 */
export async function queryPayAccount(params) {
    try {
        const {
            body
        } = await axios.post(URI.getBankList, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 批量查询付款账户、扣款账户
 */
 export async function acctList(params) {
    try {
        const {
            body
        } = await axios.post(URI.acctList, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 批量查询付款收款银行
 */
 export async function getPayeeBankOrOrgList(params) {
    try {
        const {
            body
        } = await axios.post(URI.getPayeeBankOrOrgList, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 手续费计算
 */
 export async function computeCharge(params) {
    try {
        const {
            body
        } = await axios.post(URI.computeCharge, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 第三者账户查询
 */
 export async function queryThirdPartyAccount(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryThirdPartyAccount, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 批量转入提交
 */
 export async function submit(params) {
    try {
        const res = await axios.post(URI.tsubmit, {...params})
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 批量转入提交(新)
 */
export async function transferSubmit(params) {
    try {
        const otpdemo = await axios.post(URI.transferSubmit, {...params})
        return otpdemo;
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 批量发薪提交（新）
 */
export async function paydaySubmit(params) {
    try {
        const res = await axios.post(URI.paydaySubmit, {...params})
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 批量转账授权
 */
 export async function auth(params={authReqInfo:{}}) {
    try {
        const res = await axios.post(URI.auth, {...params})
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 批量转账授权（新）
 */
export async function transferAuth(params={authReqInfo:{}}) {
    try {
        const res = await axios.post(URI.transferAuth, {...params})
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 批量发薪授权（新）
 */
export async function paydayAuth(params={authReqInfo:{}}) {
    try {
        const res = await axios.post(URI.paydayAuth, {...params})
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 查詢詳情
 */
 export async function bthTranPage(params) {
    try {
        const {
            body
        } = await axios.post(URI.bthTranPage, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 查询批次详情
 */
 export async function detail(params) {
    try {
        const {
            body
        } = await axios.post(URI.detail, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 查询批次明细
 */
 export async function batchDetail(params) {
    try {
        const {
            body
        } = await axios.post(URI.batchDetail, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
/**
 * @description 文件上傳
 */
 export async function upload(data) {
    try {
        const {
            body
        } = await axios({
            url: URI.upload,
            method: 'POST',
            data,
            timeout: 1 * 60 * 1000,
            headers: { 'Content-Type': 'multipart/form-data'}
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
export async function uploadFiles(data) {
    // console.log("文件上传",data);
   try {
       const {
           body
       } = await axios({
           url: URI.upolodfile,
           method: 'POST',
           data,
           timeout: 1 * 60 * 1000,
       })
       return body
   } catch (error) {
       console.log(error)
       return false
   }
}
/**
 * @description 手续费批处理任务
 */
 export async function executeCharge(params) {
    try {
        const {
            body
        } = await axios.post(URI.executeCharge, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 转账批处理任务
 */
 export async function executeTransfer(params) {
    try {
        const {
            body
        } = await axios.post(URI.executeTransfer, {...params})
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 批量转账/发薪校验行内账户
 */
 export async function valid(params) {
    try {
        const res = await axios.post(URI.valid, {...params})
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}