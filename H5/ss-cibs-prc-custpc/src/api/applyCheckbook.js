/*
 * @Author: ZhangZhen
 * @Date: 2022-02-15 11:25:52
 * @LastEditTime: 2022-05-24 15:51:21
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\api\applyCheckbook.js
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
 * @description 申领支票簿授权
 * 
 */
export async function chequeBookAuth(params={
    authReqInfo:{},
    body:{}
}) {
    try {
        const res = await axios.post(URI.chequeBookAuth, {
            ...params
        })
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}

 /**
 * @description 申领支票簿查询
 * 
 */
  export async function chequeBookQuery(params) {
    try {
        const {
            body
        } = await axios.post(URI.chequeBookQuery, {
            ...params
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 申领支票簿提交
 * 
 */
 export async function chequeBookSubmit(params) {
    try {
        const res = await axios.post(URI.chequeBookSubmit, {
            ...params
        })
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @description 申领支票簿下拉框查询(往来账户信息下拉框）
 * 
 */
 export async function currentAcctDropDown() {
    try {
        const {
            body
        } = await axios.post(URI.currentAcctDropDown, {
            
        })
        return body
    } catch (error) {
        console.log(error)
        return false
    }
}
