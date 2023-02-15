/*
 * @Author: zhangcheng
 * @Date: 2022-02-16 16:10:19
 * @LastEditTime: 2022-05-24 15:52:44
 * @LastEditors: ZhangZhen
 * @Description: Do not Edit
 * @FilePath: \webbank-pc\src\api\investmentServices.js
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
 * @description 基金认购首页信息查询
 */
export async function getFundSubscribeInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.getFundSubscribeInfo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 获取OTP
 */
export async function getOTP(params) {
  try {
    const {
      body
    } = await axios.post(URI.getOTP, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description OTP校验
 */
export async function checkOTP(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkOTP, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 风险评估
 */
export async function checkInvestmentAccountAndRisk(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkInvestmentAccountAndRisk, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金认购首页信息查询
 */
export async function getFunSubscribeInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.getFunSubscribeInfo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金认购及适用性校验
 */
export async function checkSubscriptionAndSuitability(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkSubscriptionAndSuitability, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金转换和适用性检查请求
 */
export async function fundChange(params) {
  try {
    const {
      body
    } = await axios.post(URI.fundChange, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金认购费/赎回费/转换费（折扣前）
 */
export async function fundDiscountFee(params) {
  try {
    const {
      body
    } = await axios.post(URI.fundDiscountFee, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 获取基金详情
 */
export async function getFundDetails(params) {
  try {
    const {
      body
    } = await axios.post(URI.getFundDetails, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 获取该公司下所有的基金列表
 */
export async function getFundComAllFundProduct(params) {
  try {
    const {
      body
    } = await axios.post(URI.getFundComAllFundProduct, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金认购授权
 */
export async function fundSubscriptionAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.fundSubscriptionAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金认购提交
 */
export async function fundSubscriptionSubmit(params) {
  try {
    const result = await axios.post(URI.fundSubscriptionSubmit, {
      ...params
    })
    return result
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金转换提交
 */
export async function fundChangeSubmit(params) {
  try {
    const {
      body
    } = await axios.post(URI.fundChangeSubmit, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金转换授权
 */
export async function fundChangeAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.fundChangeAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金赎回授权
 */
export async function fundRedeemAuth(params) {
  try {
    const {
      body
    } = await axios.post(URI.fundRedeemAuth, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金赎回校验
 */
export async function fundRedeemRequest(params) {
  try {
    const {
      body
    } = await axios.post(URI.fundRedeemRequest, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金赎回提交
 */
export async function fundRedeemSubmit(params) {
  try {
    const result = await axios.post(URI.fundRedeemSubmit, {
      ...params
    });
    return result
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 已购基金列表查询
 */
export async function getFundList(params) {
  try {
    const {
      body
    } = await axios.post(URI.getFundList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 投资账户列表查询
 */
export async function queryInvestmentAccount(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryInvestmentAccount, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金转换信息提交
 */
export async function getFundTransitionInfo(params) {
  try {
    const {
      body
    } = await axios.post(URI.getFundTransitionInfo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 基金转换信息提交
 */
export async function submitredemptionFund(params) {
  try {
    const {
      body
    } = await axios.post(URI.submitredemptionFund, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 投资交易记录查询（外币）
 */
export async function queryEnquiryForCLD(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryEnquiryForCLD, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 投资交易记录查询（其他）
 */
export async function queryOtherProduct(params) {
  try {
    const {
      body
    } = await axios.post(URI.queryOtherProduct, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 校验基金编号
 */
export async function checkFundNo(params) {
  try {
    const {
      body
    } = await axios.post(URI.checkFundNo, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 校验基金编号
 */
export async function getAllFunds(params) {
  try {
    const {
      body
    } = await axios.post(URI.getAllFunds, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}