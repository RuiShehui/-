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
 * @description 特殊天气，不在服务时间
 * 
 */
export async function judgeCurrExchangeDate(params = {}) {
  try {
    const {
      body
    } = await axios.post(URI.judgeCurrExchangeDate, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 外币现钞兑港元牌价页面
 * 
 */
export async function cashRateQuery(params) {
  try {
    const {
      body
    } = await axios.post(URI.cashRateQuery, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 外币电汇兑港元牌价页面
 * 
 */
export async function transferRateQuery(params) {
  try {
    const {
      body
    } = await axios.post(URI.transferRateQuery, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 外币现钞兑港元牌价页面
 * 
 */
export async function rateQuery(params) {
  try {
    const {
      body
    } = await axios.post(URI.rateQuery, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 
 * 
 */
export async function queryUserAcctLimit(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryUserAcctLimit, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 可用结余、账户名称
 * 
 */
export async function queryT24AccountDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryT24AccountDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询货币兑换汇率
 * 
 */
export async function queryExchangeRate(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryExchangeRate, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 买入/卖出金额计算接口
 * 
 */
export async function getAmountCalculation(params) {
  try {
    const {
      body
    } = await axios.post(URI.getAmountCalculation, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 根据个人客户号/币种查询账户列表
 * 
 */
export async function queryAccountListone(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryAccountListone, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 货币兑换验证
 * 
 */
export async function currencyExchangeVerify(params) {
  try {
    const {
      body
    } = await axios.post(URI.currencyExchangeVerify, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 货币兑换前置提交
 * 
 */
export async function currencyExchange(params) {
  try {
    const authResultInfo = await axios.post(URI.currencyExchange, {
      ...params
    })
    return authResultInfo
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 货币兑换交易详情查询
 * 
 */
export async function currencyExchangeDetails(params) {
  try {
    const {
      body
    } = await axios.post(URI.currencyExchangeDetails, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 货币兑换交易详情查询
 * 
 */
export async function currencyExchangeTransRecords(params) {
  try {
    const {
      body
    } = await axios.post(URI.currencyExchangeTransRecords, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * 电汇-外币轉賬交易授权及执行
 */
export async function globalAuthExecTelegraphicTx(params = {}) {
  try {
    const {
      body
    } = axios.post(URI.globalAuthExecTelegraphicTx, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 电汇-刪除最近收款人
 */
export async function globalDeleteRecentDebitAcct(params = {}) {
  try {
    const {
      body
    } = axios.post(URI.globalDeleteRecentDebitAcct, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 电汇-录入信息"前置信息"查询
 */
export async function globalGetPreviousInfo(params = {}) {
  try {
    const {
      body
    } = axios.post(URI.globalGetPreviousInfo, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 电汇-查询已登记电汇第三方账户
 */
export async function globalQueryRegAcctList(params = {}) {
  try {
    const {
      body
    } = axios.post(URI.globalQueryRegAcctList, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 电汇-查询最近收款账户
 */
export async function globalRetrieveRecentDebitAcct(params = {}) {
  try {
    const {
      body
    } = axios.post(URI.globalRetrieveRecentDebitAcct, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 电汇-电汇交易提交
 */
export async function globalSubmitTelegraphicTx(params = {}) {
  try {
    const {
      body
    } = axios.post(URI.globalSubmitTelegraphicTx, {
      ...params
    });
    return body;
  } catch (err) {
    console.error(err);
    return false;
  }
}