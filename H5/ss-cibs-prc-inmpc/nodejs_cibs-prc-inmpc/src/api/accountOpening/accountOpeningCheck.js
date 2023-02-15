
import http from '../http'

/**
 * 查询开户申请审核列表
 */
 export function queryAccountOpenList(params = {}) {
  return http.request({
    url: '/raoreview/showList',
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
 export function queryAccountOpenDetail(params = {}) {
  return http.request({
    url: '/raoreview/detailInfo',
    data: {
      body: {
        ...params
      }
    },
  });
}
/**
 * 开户maker提交
 */
 export function makerSubmit(params = {}) {
  return http.request({
    url: '/raoreview/maker',
    data: {
      body: {
        ...params
      }
    },
  });
}
/**
 * 开户checker提交
 */
 export function checkerSubmit(params = {}) {
  return http.request({
    url: '/raoreview/checker',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 开户记录锁定-解锁
 */
 export function binding(params = {}) {
  return http.request({
    url: '/raoreview/binding',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 补充辅助证件通知
 */
 export function checkerUpdateFile(params = {}) {
  return http.request({
    url: '/raoreview/checkerUpdateFile',
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
 export function downloadReport(params = {}) {
  return http.request({
    url: '/raoreview/downloadReport',
    data: {
      body: {
        ...params
      }
    },
    responseType: 'blob'
  });
}

/**
 * 确认开户信息
 */
 export function confirmAccInfo(params = {}) {
  return http.request({
    url: '/raoreview/confirmAO',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 文件归档
 */
 export function archiveByAlone(params = {}) {
  return http.request({
    url: '/raoreview/archiveByAlone',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * mcismaker MCIS Maker 同意/拒绝
 */
 export function mcismaker(params = {}) {
  return http.request({
    url: '/raoreview/mcismaker',
    data: {
      body: {
        ...params
      }
    },
  });
}
/**
 * mcismaker MCIS Checker 同意/拒绝
 */
 export function mcischecker(params = {}) {
  return http.request({
    url: '/raoreview/mcischecker',
    data: {
      body: {
        ...params
      }
    },
  });
}
/**
 * mcismaker amender 同意
 */
 export function amenderApprove(params = {}) {
  return http.request({
    url: '/raoreview/amender',
    data: {
      body: {
        ...params
      }
    },
  });
}

