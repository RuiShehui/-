
import http from '../http'

/**
 * 查询投资户列表
 */
export function queryEiaoList(params = {}) {
  return http.request({
    url: '/eiaoreview/showList',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 查询开户申请审核详情
 */
export function queryEiaoDetail(params = {}) {
  return http.request({
    url: '/eiaoreview/detailInfo',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 投资户记录锁定-解锁
 */
export function eiaoBinding(params = {}) {
  return http.request({
    url: '/eiaoreview/binding',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 投资户补充地址证明通知
 */
export function eiaoCheckerUpdateFile(params = {}) {
  return http.request({
    url: '/eiaoreview/checkerUpdateFile',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 投资户审核并变更
 */
export function eiaoSuppleCertificates(params = {}) {
  return http.request({
    url: '/eiaoreview/suppleCertificates',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 投资户审核
 */
export function eiaoCheck(params = {}) {
  return http.request({
    url: '/eiaoreview/maker',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 投资户开户结果确认
 */
export function eiaoResultConfirm_backup(params = {}) {
  return http.request({
    url: '/eiaoreview/checker',
    data: {
      body: {
        ...params
      }
    },
  });
}
/**
 * 投资户开户结果确认PCSD
 */
export function eiaoResultConfirm(params = {}) {
  return http.request({
    url: '/eiaoreview/pcsdDoneAction',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 报表生成
 */
 export function eiaoDownloadReport(params = {}) {
  return http.request({
    url: '/eiaoreview/downloadReport',
    data: {
      body: {
        ...params
      }
    },
    responseType: 'blob'
  });
}