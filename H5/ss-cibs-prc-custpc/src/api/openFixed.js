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
 * @description 判断当前用户是否有定期账户
 * 
 */
export async function judgeDepositAccount(params) {
  try {
    const {
      body
    } = await axios.post(URI.judgeDepositAccount, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 判断当前用户是否有定期账户
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
 * @description 付款账户余额查询
 * 
 */
export async function queryAccBalance(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryAccBalance, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 定期账户概览
 * 
 */
export async function queryAcctListPage(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryAcctListPage, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 定期存款概览查询账户下拉框
 * 
 */
export async function openQueryAccountList() {
  try {
    const {
      body
    } = await axios.post(URI.openQueryAccountList)
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 账户下拉框
 * 
 */
export async function queryAcctList(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryAcctList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 根据账户和币种分页查询定期存款信息列表 未到期
 * 
 */
export async function queryDepositListPage(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryDepositListPage, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询利率
 * 
 */
export async function queryRate(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryRate, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/** 
 * @description 提交开立定期存款
 * 
 */
export async function submitOpen(params) {
  try {
    const submitOpened = await axios.post(URI.submitOpen, {
      ...params
    }, {
      skip: true
    })
    return submitOpened
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 定期存款预约编号信息查询
 * 
 */
export async function queryBookingDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryBookingDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

// mock接口

/**
 * @description 更改到期提示列表查询
 * 
 */
export async function dueTipsList(params) {
  try {
    const {
      body
    } = await axios.post(URI.dueTipsList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 定期存款列表查询
 * 
 */
export async function accountList(params) {
  try {
    const {
      body
    } = await axios.post(URI.accountList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 状态查询
 * 
 */
export async function changeStatusList(params) {
  try {
    const {
      body
    } = await axios.post(URI.changeStatusList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 指定账户
 * 
 */
export async function accountNolist(params) {
  try {
    const {
      body
    } = await axios.post(URI.accountNolist, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 指定账户
 * 
 */
export async function changeDueTips(params) {
  try {
    const {
      body
    } = await axios.post(URI.changeDueTips, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 提交
 * 
 */
export async function changeDueTipsResult(params) {
  try {
    const {
      body
    } = await axios.post(URI.changeDueTipsResult, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 提交
 * 
 */
export async function overDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.overDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 修改到期指示授权提交
 * 
 */
export async function updateInstructionsAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.updateInstructionsAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 修改到期指示验证
 * 
 */
export async function updateInstructionsSubmit(params) {
  try {
    const Submit = await axios.post(URI.updateInstructionsSubmit, {
      ...params
    })
    return Submit
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 提交开立普通定期授权
 * 
 */
export async function openDepositAuth(params) {
  try {
    const Submit = await axios.post(URI.openDepositAuth, {
      ...params
    })
    return Submit
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * @description 利息计算
 * 
 */
export async function calcRate(params) {
  try {
    const {body} = await axios.post(URI.calcRate, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 账户状态查询
 * 
 */
export async function queryAccountStatus(params) {
  try {
    const {body} = await axios.post(URI.queryAccountStatus, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 查询所有币种的所有产品
 * 
 */
export async function interestRateQuery(params) {
  try {
    const {body} = await axios.post(URI.interestRateQuery, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询时间
 * 
 */
export async function queryTime(params) {
  try {
    const {body} = await axios.post(URI.queryTime, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 查询时间
 * 
 */
export async function judgeHoliday(params) {
  try {
    const {body} = await axios.post(URI.judgeHoliday, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 利率查询
 * 
 */
export async function openVerify(params) {
  try {
    const {body} = await axios.post(URI.openVerify, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}