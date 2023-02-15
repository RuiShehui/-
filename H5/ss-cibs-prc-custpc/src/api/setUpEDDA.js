/*
 * @Author: 朱涛
 * @Date: 2022-02-18 17:03:50
 * @LastEditTime: 2022-06-21 17:16:21
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \webbank-pc\src\api\setUpEDDA.js
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
 * @description 设定EDDA - 校验客户号中文名称， 英文名称是否变更
 * 
 */
export async function examineApproveTranc(params) {
	try {
		const {
			body
		} = await axios.post(URI.examineApproveTranc, params)
		return body
	} catch (error) {
		console.log(error)
		return false
	}
}


/**
 * @description 设定EDDA - 审批交易操作(0: 同意 / 1: 拒绝 / 2: 删除) 提交
 * 
 */
export async function examineApproveTrancOperationSubmit(
	params) {
	try {
		const examine = await axios.post(URI.examineApproveTrancOperationSubmit, {
			...params
		})
		return examine
	} catch (error) {
		console.log(error)
		return false
	}
}

/**
 * @description 设定EDDA - 审批交易操作(0: 同意 / 1: 拒绝 / 2: 删除) 提交
 * 
 */
export async function operationTransaAuth(
	params = {
		authReqInfo: {},
		body: {}
	}) {
	try {
		const {
			body
		} = await axios.post(URI.operationTransaAuth, {
			...params
		})
		return body
	} catch (error) {
		console.log(error)
		return false
	}
}

/**
 * @description 设定EDDA - EDDA提交
 * 
 */
export async function haveApprovalUpdateSumbit(params) {
	try {
		const result = await axios.post(URI.haveApprovalUpdateSumbit, params)
		return result
	} catch (error) {
		console.log(error)
		return false
	}
}

/**
 * @description 设定EDDA - EDDA提交——授权
 * 
 */
export async function haveApprovalUpdateAuth(params) {
	try {
		const result = await axios.post(URI.haveApprovalUpdateAuth, params)
		return result
	} catch (error) {
		console.log(error)
		return false
	}
}

/**
 * @description 设定EDDA - EDDA交易详情查询
 * 
 */
export async function operationTransaQuery({
	flowNo
}) {
	try {
		const result = await axios.post(URI.operationTransaQuery, {
			flowNo: flowNo
		})
		return result
	} catch (error) {
		console.log(error)
		return false
	}
}