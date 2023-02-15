/*
 * @Author: ZhangZhen
 * @Date: 2022-03-28 19:36:11
 * @LastEditTime: 2022-05-24 15:54:31
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\api\reservationTransaction.js
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
 * @description 预约交易管理-查询
 * @params 待联调时补充
 */

export async function transferListQuery(params) {
	try {
		const {
			body
		} = await axios.post(URI.transferListQuery, {
			...params
		})
		return body
	} catch (error) {
		console.log(error)
		return false
	}
}

/**
 * @description 预约交易管理-授权
 * @params 待联调时补充
 */

export async function updateScheduleDateAuth(params) {
	try {
		const res = await axios.post(URI.updateScheduleDateAuth, {
			...params
		})
		return res
	} catch (error) {
		console.log(error)
		return false
	}
}

/**
 * @description 预约交易管理-修改
 * @params 待联调时补充
 */

export async function updateScheduleDateSubmit(params) {
	try {
		const otpdemo = await axios.post(URI.updateScheduleDateSubmit, {
			...params
		})
		return otpdemo
	} catch (error) {
		console.log(error)
		return false
	}
}


/**
 * @description 预约交易管理-详情
 * @params 待联调时补充
 */

export async function updateScheduleDateDetailQuery(params) {
	try {
		const {
			body
		} = await axios.post(URI.updateScheduleDateDetailQuery, {
			...params
		})
		return body
	} catch (error) {
		console.log(error)
		return false
	}
}