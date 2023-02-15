import http from '../http'
import fileHttp from '../uploadFileHttp'

/**
 * 数据字典
 */
 export function dataDitionaryShowList(params = {}) {
  return http.request({
    url: '/dataditionary/dataDitionaryShowList',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 文件上传
 */
export function uploadFile(params = {}) {
  return fileHttp.request({
    url: '/raoreview/uploadFile',
    data: params,
  });
}

/**
 * 文件文件下载信息
 */
export function queryFileInfo(params = {}) {
  return http.request({
    url: '/raoreview/downloadFile',
    data: {
      body: {
        ...params
      }
    },
    showLoading: false
  });
}

/**
 * 审核并变更
 */
export function suppleCertificates(params = {}) {
  return http.request({
    url: '/raoreview/suppleCertificates',
    data: {
      body: {
        ...params
      }
    },
  });
}