/*
 * @Author: zhangcheng
 * @Date: 2022-02-16 16:10:19
 * @LastEditTime: 2022-07-26 17:46:04
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\api\accountManagement.js
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
 * @description 活期账户列表查询
 */
export async function depositCasaAccount(params) {
  try {
    const {
      body
    } = await axios.post(URI.depositCasaAccount, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 定期账户列表查询
 */
export async function depositFixeAccount(params) {
  try {
    const {
      body
    } = await axios.post(URI.depositFixeAccount, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 股票托管账户列表查询
 */
export async function investmentSecAccount(params) {
  try {
    const {
      body
    } = await axios.post(URI.investmentSecAccount, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 股票托管账户详情查询
 */
export async function getStockAccountDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.getStockAccountDetail, {
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
export async function investmentInvAccount(params) {
  try {
    const {
      body
    } = await axios.post(URI.investmentInvAccount, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 投资账户详情查询
 */
export async function getInvestAccountDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.getInvestAccountDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 贷款账户列表查询
 */
export async function getLoansAccountList(params) {
  try {
    const {
      body
    } = await axios.post(URI.getLoansAccountList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 贷款账户详情查询
 */
export async function getLoansAccountDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.getLoansAccountDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 贷款账号查询
 */
export async function getLoansAccountNo(params) {
  try {
    const {
      body
    } = await axios.post(URI.getLoansAccountNo, {
      ...params
    })
    return body || {}
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 交易明细列表查询
 */
export async function getTransDetailList(params) {
  try {
    const {
      body
    } = await axios.post(URI.getTransDetailList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 交易明细账号列表查询
 */
export async function getTransAccountList(params) {
  try {
    const {
      body
    } = await axios.post(URI.getTransAccountList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 交易明细下载
 */
export async function downloadTransDetail(params) {
  try {
    const {
      body
    } = await axios.post(URI.downloadTransDetail, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 电子结单列表查询
 */
export async function getEleStatementList(params) {
  try {
    const {
      body
    } = await axios.post(URI.getEleStatementList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 电子结单账号列表查询
 */
export async function getstatementsAccount(params) {
  try {
    const {
      body
    } = await axios.post(URI.getstatementsAccount, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 电子结单pdf预览
 */
// export async function previewStatementPdf(params) {
//   try {
//     const {
//       body
//     } = await axios.post(URI.previewStatementPdf, {
//       ...params
//     })
//     return body
//   } catch (error) {
//     console.log(error)
//     return false
//   }
// }
/**
 * @description 电子结单pdf下载
 */
export async function downloadStatement(params) {
  try {
    const {
      body
    } = await axios.post(URI.downloadStatement, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 电子通知书列表查询
 */
export async function getEleReceiptList(params) {
  try {
    const {
      body
    } = await axios.post(URI.getEleReceiptList, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 电子通知书pdf预览
 */
export async function previewEleReceiptPdf(params) {
  try {
    const {
      body
    } = await axios.post(URI.previewEleReceiptPdf, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * @description 电子通知书pdf下载
 */
export async function downloadEleReceipt(params) {
  try {
    const {
      body
    } = await axios.post(URI.downloadEleReceipt, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * @description 交易明细下载（需求变更）
 */
export async function downloadLoop(params) {
  try {
    const {
      body
    } = await axios.post(URI.downloadLoop, {
      ...params
    })
    return body
  } catch (error) {
    console.log(error)
    return false
  }
}