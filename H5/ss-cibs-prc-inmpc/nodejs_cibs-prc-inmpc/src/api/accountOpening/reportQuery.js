
import http from '../http'

/**
 * RAO开户统计报表接口
 */
 export function raoCountReport(params = {}) {
  return http.request({
    url: '/reportExcel/raoCountReport',
    data: {
      body: {
        ...params
      }
    },
    responseType: 'blob'
  });
}