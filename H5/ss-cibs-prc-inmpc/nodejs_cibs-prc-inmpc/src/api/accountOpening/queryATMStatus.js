
import http from '../http'

/**
 * 查询ATM卡状态列表
 */
 export function queryATMList(params = {}) {
  return http.request({
    url: '/reportExcel/showATMList',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * ATM报表生成
 */
 export function downloadATMReport(params = {}) {
  return http.request({
    url: '/reportExcel/reportATMExcel',
    data: {
      body: {
        ...params
      }
    },
    responseType: 'blob'
  });
}