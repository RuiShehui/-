/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2022-08-10 09:51:48
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\apply-checkbook\index.js
 */
import http from '../http';

/**
 * 申请支票簿查询
 * 
 */
function checkApplyQuery(params) {
  return http.request({
    method: 'POST',
    url: '/check-apply-statistics/queryList',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

/**
 * 申请支票簿下载
 * 
 */
function checkApplyDownload(params) {
  return http.request({
    method: 'POST',
    url: '/check-apply-statistics/download',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

/**
 * 公司客户销户报表
 * 
 */
function closeAccountQuery(params) {
  return http.request({
    method: 'POST',
    url: '/company-customer-close-account/queryList',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}
/**
 * 公司客户销户报表下載
 * 
 */
function closeAccountDownLoad(params) {
  return http.request({
    method: 'POST',
    url: '/company-customer-close-account/download',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

/**
 * 密码生成/重置异常报表查询
 * 
 */

function resetPwdErrorReport(params) {
  return http.request({
    method: 'POST',
    url: '/pwd-report/resetPwdErrorReport',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

/**
 * 密码生成/重置异常报表查询
 * 
 */

function downloadResetPwdErrorReport(params) {
  return http.request({
    method: 'POST',
    url: '/pwd-report/downloadResetPwdErrorReport',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

/**
 * 交付賬單對賬報表
 * 
 */

function orderPaySummaryReport(params) {
  return http.request({
    method: 'POST',
    url: '/orderPayReport/orderPaySummaryReport',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/liwenqi"
    // baseURL: '/cibs',
  });
}

/**
 * 交付賬單對賬報表下载
 * 
 */

function orderPaySummaryReportDownload(params) {
  return http.request({
    method: 'POST',
    url: '/orderPayReport/orderPaySummaryReportDownload',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/liwenqi"
    // baseURL: '/cibs',
  });
}

/**
 * 交付賬單對賬詳情報表
 * 
 */
function orderPayDetailReport(params) {
  return http.request({
    method: 'POST',
    url: '/orderPayReport/orderPayDetailReport',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/liwenqi"
    // baseURL: '/cibs',
  });
}

/**
 * 交付賬單對賬詳情報表下载
 * 
 */
function orderPayDetailReportDownload(params) {
  return http.request({
    method: 'POST',
    url: '/orderPayReport/orderPayDetailReportDownload',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/liwenqi"
    // baseURL: '/cibs',
  });
}

/**
 * 网上银行每日高风险交易设置报表查询
 * 
 */

function OnlineBankHighRiskTransSelect(params) {
  return http.request({
    method: 'POST',
    url: '/OnlineBankHighRiskTrans/select',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

/**
 * 网上银行每日高风险交易设置报表下载
 * 
 */

function OnlineBankHighRiskTransDownload(params) {
  return http.request({
    method: 'POST',
    url: '/OnlineBankHighRiskTrans/download',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

// 网上银行每日高风险交易设置报表
function SummaryTransacHighSelsect(params) {
  return http.request({
    method: 'POST',
    url: '/SummaryTransacHigh/select',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}

// 网上银行每日高风险交易设置报表下载
function SummaryTransacHighDown(params) {
  return http.request({
    method: 'POST',
    url: '/SummaryTransacHigh/download',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: "/ranzican"
    // baseURL: '/cibs',
  });
}
export {
  closeAccountQuery,
  closeAccountDownLoad,
  resetPwdErrorReport,
  downloadResetPwdErrorReport,
  OnlineBankHighRiskTransSelect,
  OnlineBankHighRiskTransDownload,
  checkApplyQuery,
  checkApplyDownload,
  SummaryTransacHighSelsect,
  SummaryTransacHighDown,
  orderPaySummaryReport,
  orderPayDetailReport,
  orderPaySummaryReportDownload,
  orderPayDetailReportDownload
};