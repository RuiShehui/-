/*
 * @Author: ZhangZhen
 * @Date: 2022-01-04 16:44:20
 * @LastEditTime: 2022-10-15 14:15:38
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\statiscal-query\index.js
 */
import http from '../http';

/**
 * 获取日志列表
 * @param {{ [key: string]: number | string | [] }} params 请求参数
 */
export function getLogsList(params = {}) {
  return http.request({
    url: '/busi-manage/queryInmTranLog',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * 获取操作员列表
 * @param {{ [key: string]: number | string | [] }} params 请求参数
 */
export function queryRoleList(params = {}) {
  return http.request({
    url: '/busi-manage/queryRoleList',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * 下载文件
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */
export function downloadTemplate(data = {}) {
  return http.request({
    url: '/busi-manage/downLoadFile',
    data: {
      body: {
        ...data,
      },
    },
    responseType: 'blob'
  });
}

/**
 * 网上银行客户情况统计报表
 * @param{} 请求参数对象
 */
export function customerStatisticsQuery(params) {
  return http.request({
    url: '/report/customerStatisticsQuery',
    data: {
      body: {
        ...params
      }
    },
  })
}


/**
 * 网上银行客户情况统计报表下载
 * @param{} 请求参数对象
 */
export function customerStatisticsDownload(params) {
  return http.request({
    url: '/report/customerStatisticsDownload',
    data: {
      body: {
        ...params
      }
    },
  })
}

/**
 * 客户经理团队下拉框查询
 * @param{} 请求参数对象
 */
export function selectManagerName(params) {
  return http.request({
    url: '/customerSalesReport/selectManagerName',
    data: {
      body: {
        ...params
      }
    },
  })
}
/**
 * 客户经理团队下拉框查询
 * @param{} 请求参数对象
 */
 export function selectManagerTeam(params) {
  return http.request({
    url: '/customerSalesReport/selectManagerTeam',
    data: {
      body: {
        ...params
      }
    },
  })
}
// baseURL: '/cibs'
/**
 *  网银密码生成汇总报表查询
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */
export function resetPwdTotalReport(params = {}) {
  return http.request({
    url: '/pwd-report/resetPwdTotalReport',
    data: {
      body: {
        ...params,
      },
    },
  });
}
/**
 *  网银密码生成汇总报表下載
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */
export function downloadResetPwdTotalReport(params = {}) {
  return http.request({
    url: '/pwd-report/downloadResetPwdTotalReport',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * 重置密码报表
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */
export function resetPwdReport(params = {}) {
  return http.request({
    url: '/pwd-report/resetPwdReport',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * 重置密码报表下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */
export function downloadResetPwdReport(params = {}) {
  return http.request({
    url: '/pwd-report/downloadResetPwdReport',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * 网银交易数据报表
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */
export function tradeStatistics(params = {}) {
  return http.request({
    url: '/report/tradeStatistics',
    data: {
      body: {
        ...params,
      },
    },
  });
}
/**
 * 网银交易数据报表
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */
export function tradeStatisticsDownload(params = {}) {
  return http.request({
    url: '/report/tradeStatisticsDownload',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * 公司客户的销售报表
 * @param {*} params 
 * @returns 
 */
export function customerSelect(params = {}) {
  return http.request({
    url: '/customerSalesReport/select',
    data: {
      body: {
        ...params,
      },
    },
  });
}


/**
 * 公司客户的销售报表
 * @param {*} params 
 * @returns 
 */
export function customerSelectDownload(params = {}) {
  return http.request({
    url: '/customerSalesReport/download',
    data: {
      body: {
        ...params,
      },
    },
  });
}


/**
 * 未启用网银客户报表
 * @param{} 请求参数对象
 */
export function noStartQueryList(params) {
  return http.request({
    url: '/not-strat-using-cyber-bank-customer/queryList',
    data: {
      body: {
        ...params,
      }
    },
  })
}

/**
 * 未启用网银客户报表下载
 * @param{} 请求参数对象
 */
export function noStartDownload(params) {
  return http.request({
    url: '/not-strat-using-cyber-bank-customer/download',
    data: {
      body: {
        ...params
      }
    },
  })
}


/** 
 * 已接受的银行间资金转账报表
 * @param {}
 data 请求参数
*/
export function transferStatement(params = {}) {
  return http.request({
    url: '/internal-management-statistical/transferStatement',
    data: {
      body: {
        ...params,
      },
    },
  });
}


/** 
 * 已接受的银行间资金转账报表
 * @param {}
 data 请求参数
*/
export function transferStatementDownload(params = {}) {
  return http.request({
    url: '/internal-management-statistical/transferStatementDownload',
    data: {
      body: {
        ...params,
      },
    },
  });
}


/**
 * 公司客户开户报表
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function openAccount(data = {}) {
  return http.request({
    url: '/company-customer-open-account/queryList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}

/**
 * 客户交易日志
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function queryCtsTransLog(data = {}) {
  return http.request({
    url: '/customerTransLog/queryPageList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 客户交易日志(全部)
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function queryAllCtsTransLog(data = {}) {
  return http.request({
    url: '/customerTransLog/queryCountTrans',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 客户交易日志(下載)
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function downloadCtsTransLog(data = {}) {
  return http.request({
    url: '/customerTransLog/download',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}

/**
 * 公司客户开户报表列表-账户信息查询
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function infoQueryList(data = {}) {
  return http.request({
    url: '/company-customer-open-account/infoQueryList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}

/**
 * 公司客户开户报表列表-用户信息查询
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function operatorQueryList(data = {}) {
  return http.request({
    url: '/update-customer-info/operatorQueryList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}

/**
 * 公司客户修改报表列表-用户信息查询
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function queryList(data = {}) {
  return http.request({
    url: '/update-customer-info/queryList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表列表-用户信息查询
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function operatorQuery(data = {}) {
  return http.request({
    url: '/company-customer-open-account/operatorQueryList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表列表-用户信息查询
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function updateInfoQueryList(data = {}) {
  return http.request({
    url: '/update-customer-info/infoQueryList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}

/**
 * 公司客户开户报表列表下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function openDownload(data = {}) {
  return http.request({
    url: '/company-customer-open-account/download',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });


}
/**
 * 公司客户开户报表列表下载--
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

 export function opendownloadAccount(data = {}) {
  return http.request({
    url: '/company-customer-open-account/downloadUser',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表列表下载--
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

 export function opendownloadOpera(data = {}) {
  return http.request({
    url: '/company-customer-open-account/downloadOpera',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表——账户信息下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

 export function updatedownloadUsers(data = {}) {
  return http.request({
    url: '/update-customer-info/downloadUser',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表——账户信息下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

 export function updownloadOperas(data = {}) {
  return http.request({
    url: '/update-customer-info/downloadOpera',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表——账户信息下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function downloadUser(data = {}) {
  return http.request({
    url: '/company-customer-open-account/downloadUser',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表——账户信息下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function openUser(data = {}) {
  return http.request({
    url: '/company-customer-open-account/downloadOpera',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}

/**
 * 修改公司客户报表下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function downloadUpdateUser(data = {}) {
  return http.request({
    url: '/update-customer-info/download',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}


/**
 * 修改公司客户报表下载 --用戶信息
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function downloadOpera(data = {}) {
  return http.request({
    url: '/update-customer-info/downloadOpera',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}


/**
 * 修改公司客户报表下载 --账户信息下载
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function updateDownloadUser(data = {}) {
  return http.request({
    url: '/update-customer-info/downloadUser',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户修改报表列表-查询全部用户信息
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function queryOperatorList(data = {}) {
  return http.request({
    url: '/update-customer-info/queryOperatorList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户修改报表列表-查询全部用户信息
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function queryAccountList(data = {}) {
  return http.request({
    url: '/update-customer-info/queryAccountList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob's
  });
}
/**
 * 公司客户开户报表列表-全部账户信息查询z
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function openQueryAccountList(data = {}) {
  return http.request({
    url: '/company-customer-open-account/queryAccountList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}
/**
 * 公司客户开户报表列表-全部账户信息查询z
 * @param {{ [key: string]: number | string | [] }} data 请求参数
 */

export function openQueryOpenOperatorList(data = {}) {
  return http.request({
    url: '/company-customer-open-account/queryOpenOperatorList',
    data: {
      body: {
        ...data,
      },
    },
    // responseType: 'blob'
  });
}