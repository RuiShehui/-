/*
 * @Author: 赵霖
 * @Date: 2022-04-25 15:31:17
 * @LastEditTime: 2022-05-24 15:54:35
 * @LastEditors: ZhangZhen
 * @Description: 交易成功发送短信接口
 * @FilePath: \webbank-pc\src\api\sendMsg.js
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

function sendEmail(params) {
  const {
    operator = '123456', /*发送者*/
    tempCode = params.tempCode, /* 模板编号 */ 
    transCode =params.transCode, /*交易类型*/
    content = '', /*主体内容（授权提醒人名称、卡号等） */
    currency, /* 币种 */
    amount, /* 金额 */
    email  /* 邮箱 */
  } = params;
  try {
    const res = axios.post(URI.sendMsg, {
      typ: 'email',
      cstmNo: '',
      transCode,
      orgChl: 'cb',
      promptChl: 'cb',
      operator,
      info: `{${tempCode},eevalues:${content}${currency}${amount},email:${email}}`
      // {
      //   tempCode,
      //   eevalues: `${content}${currency}${amount}`,
      //   email:email
      // }
    });
    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function sendMoble(params) {
  const {
    operator = '123456', /*发送者*/
    tempCode = params.tempCode, /* 模板编号 */ 
    transCode =  params.transCode, /*交易类型*/
    content = '', /*主体内容（授权提醒人名称、卡号等） */
    currency, /* 币种 */
    amount, /* 金额 */
    mobile  /* 移动电话 */
  } = params;
  axios({
    method: 'POST',
    url: URI.sendMsg,
    data: {
      typ: 'mobile',
      cstmNo: '',
      // '010101'
      transCode,
      orgChl: 'cb',
      promptChl: 'cb',
      operator,
      info: `{${tempCode},eevalues:${content}${currency}${amount},mobile:${mobile}}`
    }
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

export {
  sendEmail,
  sendMoble
}