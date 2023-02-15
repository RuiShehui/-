
import http from '../http'

/**
 * 查询网银状态列表
 */
 export function queryCRNList(params = {}) {
  return http.request({
    url: '/reportExcel/showCRNList',
    data: {
      body: {
        ...params
      }
    },
  });
}
/**
 * 网银报表生成
 */
 export function downloadCRNReport(params = {}) {
  return http.request({
    url: '/reportExcel/reportCRNExcel',
    data: {
      body: {
        ...params
      }
    },
    responseType: 'blob'
  });
}