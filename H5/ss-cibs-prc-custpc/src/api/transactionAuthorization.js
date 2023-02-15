/*
 * @Author: ZhangZhen
 * @Date: 2022-02-18 09:31:29
 * @LastEditTime: 2022-06-17 14:41:13
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\api\transactionAuthorization.js
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
 * @description 交易授权设置-查询账户接口
 * @params modelType 类型
 * 
 */
export async function queryUserAccNo(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryUserAccNo, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置-查询所有交易类型以及现有的已设置的模板
 * @params modelType 类型
 * 
 */
export async function queryAuthALL(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryAuthALL, {
            ...params
        })
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
export async function queryMenuBy({
    transType
}) {
    try {
        const {
            body
        } = await axios.post(URI.queryMenuBy, {
            transType: transType
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置-编辑接口
 * 
 */
export async function addAuthTradeAuthSetting(params) {
    try {
        const addAuth = await axios.post(URI.addAuthTradeAuthSetting, {
            ...params
        })
        return addAuth
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置批量新增 授权
 * 
 */
export async function addAuthTradeAuthSettingAuth(params) {
    try {
        const {
            body
        } = await axios.post(URI.addAuthTradeAuthSettingAuth, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 交易授权设置-编辑接口
 * 
 */
export async function queryTranIsAuthing() {
    try {
        const {
            body
        } = await axios.post(URI.queryTranIsAuthing)
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}