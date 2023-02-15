/*
 * @Author: your name
 * @Date: 2022-10-29 17:20:18
 * @LastEditTime: 2022-11-01 19:44:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\api\specialInstruction.js
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


export async function submitApply(params) {
  try {
    const submitApply= await axios.post(URI.submitApply, {
      ...params
    })
    return submitApply
  } catch (error) {
    console.log(error)
    return false
  }
}
