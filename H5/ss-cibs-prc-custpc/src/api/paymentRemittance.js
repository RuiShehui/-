/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-08-16 09:48:01
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\api\paymentRemittance.js
 */
import {
  getToken
} from '@/utils/user';
import {
  URI,
  TRANCODE
} from '../constant';
import {
  async
} from 'q';
import {
  INTRA_ACCT_TYPES
} from '@bank-transfer/utils/constant';
import axios from './';

axios.defaults.headers.common["Authorization"] = getToken();

/**
 * @public 获取国家列表
 **/
export async function getCountryList(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.getCountryList, {
      ...params
    });
    return body;
  } catch (error) {
    console.error(error);
    return false;
  }
}
/**
 * 获取fps银行列表--转数快
 */
export async function getBankList(params = {}) {
  try {
    const result = await axios.post(URI.getBankList, {
      ...params
    });
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * 获取chats银行列表--外币转账
 */
export async function queryChatsBanks(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.queryChatsBanks, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 获取chats银行列表
 */
export async function getChatsBankList(params = {}) {
  try {
    const {
      body
    } = axios.post(URI.queryChatsBanks, {
      ...params,
    });
    return body;
  } catch (err) {
    console.error(err);
    return err;
  }
}

/**
 * @description 行内转账-交易提交
 * @params customerNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */

export async function innerBankSubmitInnerBankTx(params) {
  try {
    const otpdemo = await axios.post(URI.innerBankSubmitInnerBankTx, {
      ...params
    })
    return otpdemo;
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @description 行内转账-交易提交
 * @params customerNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */

export async function newTradeToken(params) {
  try {
    const otpdemo = await axios.post(URI.newTradeToken, {
      ...params
    })
    return otpdemo;
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @description 行内转账-收款账户/付款账户查询
 * @params customerNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */

export async function innerBankGetPreviousInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.innerBankGetPreviousInfo, {
      ...params
    })
    return body
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @description 行内转账-已登记第三者账户查询
 * @params customerNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */

export async function innerBankQueryRegAcctList(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.innerBankQueryRegAcctList, {
      ...params
    })
    return body
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @description 行内转账-最近收款人查询
 * @params customerNo  客户编号
 * @params userCode  用户编号
 * @params language  当前语言
 */
export async function innerBankQueryRecentCreditAcct(params) {
  try {
    const {
      body
    } = await axios.post(URI.innerBankQueryRecentCreditAcct, {
      ...params
    })
    return body
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @description 行内转账-删除最近收款人
 * @param {{ [key: string]: number | string | [] | {} }} params 请求参数
 */
export async function innerBankDeleteRecentCreditAcct(params) {
  try {
    // const { body } = await axios.post(URI.innerBankDeleteRecentCreditAcct, params);
    const {
      body
    } = await axios({
      method: 'POST',
      url: URI.innerBankDeleteRecentCreditAcct,
      data: {
        head: JSON.parse(localStorage.getItem('head') || '{}'),
        body: params
      }
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * FPS轉賬-交易授权及执行
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function authExecFPSTx(params) {
  try {
    const res = await axios.post(URI.authExecFPSTx, params);
    return res;
  } catch (err) {
    console.error(err);
  }
}

/**
 * FPS轉賬-查詢用户FPS服務条款状态
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function checkFPSTermStatus(params = {
  body: {
    "flowNumList": [20220209100067714]
  },
  authReqInfo: {}
}) {
  try {
    const {
      body
    } = await axios.post(URI.checkFPSTermStatus, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * FPS轉賬-删除最近收款人
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export function deleteFPSRecentDebitAcct(params) {
  try {
    const {
      body
    } = axios.post(URI.deleteFPSRecentDebitAcct, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * FPS轉賬-录入页面“前置信息”查詢
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function getFPSPreviousInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.getFPSPreviousInfo, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * FPS轉賬-查询已登记FPS第三方账户
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function queryFPSRegAcctList(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryFPSRegAcctList, {
      ...params,
      transferWay: INTRA_ACCT_TYPES.FAST
    });
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * FPS轉賬-查询最近收款账户
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function retrieveFPSRecentDebitAcct(params) {
  try {
    const {
      body
    } = await axios.post(URI.retrieveFPSRecentDebitAcct, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * FPS轉賬-交易提交
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function submitFPSTx(params) {
  try {
    const otpdemo = await axios.post(URI.submitFPSTx, params);
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}
/**
 * FPS轉賬-下一步检查并反显数据
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function fpsSubmitValidate(params) {
  try {
    const {
      body
    } = await axios.post(URI.fpsSubmitValidate, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 更新用户FPS服務条款状态
 * @param {{ [key: string]: string | number; }} params
 * @return {Promise<any>}
 */
export async function updateFPSTermStatus(params) {
  try {
    const {
      body
    } = await axios.post(URI.updateFPSTermStatus, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账账户-新增
 */
export async function addInterBankTransferChats(params = {}) {
  try {
    const otpdemo = await axios.post(URI.addInterBankTransferChats, params);
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账账户-修改
 */
export async function updateInterBankTransferChats(params = {}) {
  try {
    const otpdemo = await axios.post(URI.updateInterBankTransferChats, params);
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账账户-删除
 */
export async function removeInterBankTransferChats(params = {}) {
  try {
    const otpdemo = await axios.post(URI.removeInterBankTransferChats, params);
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 电汇-外币轉賬交易授权及执行
 */
export async function globalAuthExecTelegraphicTx(params) {
  try {
    const {
      body
    } = await axios.post(URI.globalAuthExecTelegraphicTx, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 电汇-刪除最近收款人
 */
export async function globalDeleteRecentDebitAcct(params) {
  try {
    const {
      body
    } = await axios.post(URI.globalDeleteRecentDebitAcct, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 电汇-录入信息"前置信息"查询
 */
export async function globalGetPreviousInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.globalGetPreviousInfo, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 查询已登记电汇第三方账户
 */
export async function globalQueryRegAcctList(params) {
  try {
    const {
      body
    } = await axios.post(URI.globalQueryRegAcctList, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 查询最近收款账户
 */
export async function globalRetrieveRecentDebitAcct(params) {
  try {
    const {
      body
    } = await axios.post(URI.globalRetrieveRecentDebitAcct, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 电汇交易提交
 */
export async function globalSubmitTelegraphicTx(params) {
  try {
    const {
      body
    } = await axios.post(URI.globalSubmitTelegraphicTx, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 外币转账-交易授权及执行
 */
export async function chatsauthExecFPSTx(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.chatsauthExecFPSTx, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账-删除最近收款人
 */
export async function chatsDeleteRecentDebitAcct(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.chatsDeleteRecentDebitAcct, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账-录入页面“前置信息”查詢
 */
export async function chatsGetPreviousInfo(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.chatsGetPreviousInfo, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账-查询已登记第三方外币转账账户
 */
export async function chatsQueryRegAcctList(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.chatsQueryRegAcctList, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账-查询最近收款账户
 */
export async function chatsRetrieveRecentDebitAcct(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.chatsRetrieveRecentDebitAcct, params);
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 外币转账-外币轉賬交易提交
 */
export async function chatsSubmitFPSBankTx(params = {}) {
  try {
    const otpdemo = await axios.post(URI.chatsSubmitFPSBankTx, params);
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}

/**
 * mock-获取授权提醒人
 */
export async function getAuthReminders(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.getAuthReminders, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 登记第三者账户-行内账户-获取列表
 */
export async function findInnerBankRegPageList(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.findInnerBankRegPageList, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 登记第三者账户-行内账户-获取新增前置
 */
export async function findAccountName(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.findAccountName, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 登记第三者账户-行内账户-新增
 */
export async function addInnerBankReg(params = {}) {
  try {
    const otpdemo = await axios.post(URI.addInnerBankReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 登记第三者账户-行内账户-更新
 */
export async function updateInnerBankReg(params = {}) {
  try {
    const otpdemo = await axios.post(URI.updateInnerBankReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 登记第三者账户-行内账户-删除
 */
export async function removeInnerBankReg(params = {}) {
  try {
    const otpdemo = await axios.post(URI.removeInnerBankReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 登记第三者账户-本地跨行-列表
 */
export async function findInterBankTransferRegPageList(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.findInterBankTransferRegPageList, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 登记第三者账户-本地跨行-新增
 */
export async function addInterBankTransferReg(params = {}) {
  try {
    const otpdemo = await axios.post(URI.addInterBankTransferReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 登记第三者账户-本地跨行-更新
 */
export async function updateInterBankTransferReg(params = {}) {
  try {
    const otpdemo = await axios.post(URI.updateInterBankTransferReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}
/**
 * 登记第三者账户-本地跨行-详情
 */
export async function findInnerBankRegDetail(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.findInnerBankRegDetail, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}
/**
 * 登记第三者账户-回显
 */
export async function findFpsAcctInfo(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.findFpsAcctInfo, {
      ...params,
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}
/**
 * 登记第三者账户-本地跨行-删除
 */
export async function removeInterBankTransferReg(params = {}) {
  try {
    const otpdemo = await axios.post(URI.removeInterBankTransferReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    console.error(err);
  }
}

/**
 * 新增交易草稿
 */
export async function addTransactionDraft(params = {}) {
  try {
    const res = await axios.post(URI.addTransactionDraft, {
      ...params
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 移除交易草稿
 */
export async function removeTransactionDraft(params = {}) {
  try {
    const res = await axios.post(URI.removeTransactionDraft, {
      ...params
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 获取交易草稿列表
 */
export async function findTransactionDraftPageList(params = {}) {
  try {
    const res = await axios.post(URI.findTransactionDraftPageList, {
      ...params
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 行内轉賬交易提交前下一步检查
 */
export async function nextStepValidate(params = {}) {
  try {
    const res = await axios.post(URI.nextStepValidate, {
      ...params
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 登记第三者账户-电汇账户-列表查询
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function findGlobalRemittanceRegPageList(params) {
  try {
    const {
      body
    } = await axios.post(URI.findGlobalRemittanceRegPageList, {
      ...params
    });
    return body;
  } catch (err) {
    throw new Error(err);
  }
}
/**
 * 登记第三者账户-电汇账户-详情查询
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function findGlobalRemittanceRegDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.findGlobalRemittanceRegDetail, {
      ...params
    });
    return body;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 登记第三者账户-电汇-根据swiftCode反显收款银行信息
 */
export async function getSwiftDetails(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.getSwiftDetails, {
      ...params,
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 登记第三者账户-电汇账户-新增
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function addGlobalRemittanceReg(params) {
  try {
    const otpdemo = await axios.post(URI.addGlobalRemittanceReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    throw new Error(err);
  }
}
/**
 * 登记第三者账户-电汇账户-修改
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function updateGlobalRemittanceReg(params) {
  try {
    const otpdemo = await axios.post(URI.updateGlobalRemittanceReg, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    throw new Error(err);
  }
}
/**
 * 登记第三者账户-电汇账户-删除
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function removeGlobalRemittanceReg(params) {
  try {
    const
      demo = await axios.post(URI.removeGlobalRemittanceReg, {
        ...params
      });
    return demo;
  } catch (err) {
    throw new Error(err);
  }
}

export function fundSubscriptionAuth() {}

/**
 * 外币转账-外币轉賬交易校验请求
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function requestChatsTx(params) {
  try {
    const {
      body
    } = await axios.post(URI.requestChatsTx, {
      ...params
    });
    return body;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 外币转账-外币轉賬交易提交
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function submitChatsTx(params) {
  try {
    const otpdemo = await axios.post(URI.submitChatsTx, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 电汇-电汇交易校验请求
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function requestTelegraphicTx(params) {
  try {
    const {
      body
    } = await axios.post(URI.requestTelegraphicTx, {
      ...params
    });
    return body;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 电汇-电汇交易提交
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function submitTelegraphicTx(params) {
  try {
    const otpdemo = await axios.post(URI.submitTelegraphicTx, {
      ...params
    });
    return otpdemo;
  } catch (err) {
    throw new Error(err);
  }
}


/**
 * fps信息查询
 * @param {{ [key: string]: any }} params 请求参数
 */
export async function findFpsInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.findFpsInfo, {
      ...params
    });
    return body;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 最近转账查询
 */
export async function recentPayeeQuery(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.recentPayeeQuery, {
      ...params
    });
    return body;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 删除最近收款人
 */
export async function recentPayeeDelete(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.recentPayeeDelete, {
      ...params,
    })
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 查询最近收款人账户
 */
export async function getRecentRecordsAccts(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.getRecentRecordsAccts, {
      ...params,
    })
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 最近转账记录-获取列表
 */
export async function recentTransferListQuery(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.recentTransferListQuery, {
      ...params,
    })
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 最近转账记录-获取详情
 */
export async function findRecentTransferDetail(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.findRecentTransferDetail, {
      ...params,
    })
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 手续费扣款账户金额计算，适用于外币转账/电汇
 * 
 */
export async function getChargeFeeOnline(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.getChargeFeeOnline, {
      ...params,
    })
    return body;
  } catch (err) {
    return false;
  }
}

/**
 * 特殊天气提示，适用于外币转账/电汇
 * 
 */
export async function getTyphoonFlag(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.getTyphoonFlag, {
      ...params,
    })
    return body;
  } catch (err) {
    return false;
  }
}