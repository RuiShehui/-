/*
 * @Author: ZhangZhen
 * @Date: 2022-02-18 09:31:29
 * @LastEditTime: 2022-05-24 15:53:03
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\api\operatorLog.js
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
 * @description 操作日志查询列表分页查询
 * 
 */
export async function queryListPage(params) {
    try {
        const {
            body
        } = await axios.post(URI.queryListPage, {
            ...params
        })
        console.log('请求到了数据')
        return body
    } catch (error) {
        // console.log('没请求到了数据')
        console.log(error)
        return false
    }
}
export async function downloadListAll(params) {
    try {
        const {
            body
        } = await axios.post(URI.downloadListAll, {
            ...params
        })
        console.log('请求到了数据')
        return body
    } catch (error) {
        // console.log('没请求到了数据')
        console.log(error)
        return false
    }
}
// /**
//  * @description 操作日志查询列表下载
//  * 
//  */
//  export async function downloadListAll(params) {
//     try {
//         const body = await axios({
//             method:'post',
//             url:URI.downloadListAll,
//             data:params,
//             responseType:'blob',
//             // headers:{
//             //     "content-type":"multipart/from-data"
//             // }
//         })
//         console.log('请求到了数据')
//         return body
//     } catch (error) {
//         // console.log('没请求到了数据')
//         console.log(error)
//         return false
//     }
// }