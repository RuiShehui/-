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
 * @description 公告分页查询接口
 * @params current 当前页
 * @params size 条数
 * @params endTime 结束时间
 * @params StartTime 开始时间
 * @params title 标题
 * @params language 语言
 * 
 */
export async function findBankNoticeInfoList(params) {
  try {
    const {
      body
    } = await axios.post(URI.findBankNoticeInfoList, {
      ...params,
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 公告详情接口
 * @params announcementCode 编号
 * @params endTime 结束时间
 * @params StartTime 开始时间
 * @params title 标题
 * @params language 语言
 * 
 */

export async function findBankNoticeDetail({
  announcementCode
}) {
  try {
    const {
      body
    } = await axios.post(URI.findBankNoticeDetail, {
      announcementCode: announcementCode,

    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 交易草稿
 * @params current 分页
 * @params size 条数
 * 
 */

export async function TransactionDraftPageList(params) {
  try {
    const {
      body
    } = await axios.post(URI.findTransactionDraftPageList, {
      ...params
    })
    return body
  } catch (error) {
    return false
  }
}

/**
 * @description 消息提醒
 * @params current 分页
 * @params customerNo 客户号 202112280001
 * @params userCode 用户代码 INM001
 * @params size 分页尺寸
 */

export async function MsgNotificationList(
  params
) {
  try {
    const {
      body
    } = await axios.post(URI.findMsgNotificationPageList,
      params
    )
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 消息提醒 ---详情已读
 * @params mnId  确认新密码
 * 
 */

export async function updateOneMsgMark({
  mnId
}) {
  try {
    const {
      body
    } = await axios.post(URI.updateOneMsgMark, {
      mnId: mnId
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 消息提醒 ---详情已读
 * @params mnId  确认新密码
 * 
 */

export async function findMsgCount({
  customerNo,
  readMark,
  userCode
}) {
  try {
    const {
      body
    } = await axios.post(URI.findMsgCount, {
      customerNo: customerNo,
      readMark: readMark,
      userCode: userCode
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 消息提醒 ---清除未读
 * @params customerNo  用户编号
 * 
 */

export async function updateMultipleMsgMark({
  customerNo,
  userCode
}) {
  try {
    const {
      body
    } = await axios.post(URI.updateMultipleMsgMark, {
      customerNo: customerNo,
      userCode: userCode
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 个人设定 ---修改用户名
 * @params loginName  用户名
 * 
 */

export async function updateUserName({
  loginName,
  // language
}) {
  try {
    const {
      body
    } = await axios.post(URI.updateUserName, {
      loginName: loginName,
      // language:language
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 个人设定 ---修改密码
 * @params confirmNewPassword  确认新密码
 * @params loginNewPassword  现时登录密码
 * @params newPassword  新密码
 * 
 */

export async function updatePwd(params) {
  try {
    const {
      body
    } = await axios.post(URI.updatePwd, {...params})
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 菜单列表查询
 */

export async function queryMenuList() {
  try {
    const {
      body
    } = await axios.post(URI.queryMenuList)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 用户基本信息查询
 */

export async function queryUserInfo() {
  try {
    const {
      body
    } = await axios.post(URI.queryUserInfo)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 快捷菜单查询
 */

export async function findShortcutMenuDetail() {
  try {
    const {
      body
    } = await axios.post(URI.findShortcutMenuDetail)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 快捷菜单更新
 * @params cstmNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */

export async function updateShortcutMenuInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.updateShortcutMenuInfo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 转账记录列表查询
 * @params customerNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */

export async function findRecentTransferPageList(params) {
  try {
    const {
      body
    } = await axios.post(URI.findRecentTransferPageList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 交易明细账户查询
 */
export async function transactionAccount() {
  try {
    const {
      body
    } = await axios.post(URI.transactionAccount)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 转账记录详情查询
 * @params customerNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */

export async function findRecentTransferDetail({
  customerNo,
  flowNo,
  current,
  size,
  userCode,
  language
}) {
  try {
    const {
      body
    } = await axios.post(URI.findRecentTransferDetail, {
      customerNo,
      flowNo,
      current,
      size,
      userCode,
      language
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 资产视图
 */

export async function findAssetsViewDetail() {
  try {
    const {
      body
    } = await axios.post(URI.findAssetsViewDetail, {

    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 资产视图
 */

export async function findViewDetail() {
  try {
    const {
      body
    } = await axios.post(URI.findViewDetail, {

    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 待办任务
 */

export async function searchByAuthorizer(params) {
  try {
    const {
      body
    } = await axios.post(URI.searchByAuthorizer, {
      ...params
    }, {
      skip: true
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 出账消息提醒
 */

export async function setPaymentPrompt(params) {
  try {
    const {
      body
    } = await axios.post(URI.setPaymentPrompt, {
      ...params
    }, {
      skip: true
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}


//mock 待办任务

export async function todotasks() {
  try {
    const {
      body
    } = await axios.post(URI.todotasks, {

    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
//mock 待办任务

export async function getXml() {
  try {
    const {
      body
    } = await axios.get('')
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}