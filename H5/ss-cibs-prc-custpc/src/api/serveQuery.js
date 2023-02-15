/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-05-24 15:55:19
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\api\serveQuery.js
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
 * @description app下载url查询
 */
export async function downLoadApp() {
    try {
        const {
            body
        } = await axios.post(URI.downLoadApp)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description //储蓄存款利率查询
 */
 export async function rateSavingQuery(params) {
    try {
        const {
            body
        } = await axios.post(URI.rateSavingQuery,{
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 网银交易记录分页查询
 */
 export async function findCommFlowList(params) {
    try {
        const {
            body
        } = await axios.post(URI.findCommFlowList,{
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 网银交易记录详情查询
 */
 export async function querySingleTradeDetail(params) {
    try {
        const {
            body
        } = await axios.post(URI.querySingleTradeDetail,{
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * @description 查询服务-网银交易记录查询
 */
 export async function historyQuery() {
    try {
        const {
            body
        } = await axios.post(URI.historyQuery)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 银行分行信息查询
 */
 export async function getBranchInfo() {
    try {
        const {
            body
        } = await axios.post(URI.getBranchInfo)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
