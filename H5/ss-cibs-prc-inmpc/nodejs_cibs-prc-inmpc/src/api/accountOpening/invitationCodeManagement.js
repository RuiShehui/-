import http from '../http'

/**
 * 获取邀请码列表
 */
 export function getRecommendationCodeList(params = {}) {
  return http.request({
    url: '/recommendationCode/showList',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 查询分行机构
 */
 export function queryiMBranchList(params = {}) {
  return http.request({
    url: '/imbranch/iMBranchShowList',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 查询邀请码详情
 */
 export function queryCodeDetial(params = {}) {
  return http.request({
    url: '/recommendationCode/detailInfo',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 新增邀请码
 */
 export function addCode(params = {}) {
  return http.request({
    url: '/recommendationCode/add',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 修改邀请码信息
 */
 export function updateCode(params = {}) {
  return http.request({
    url: '/recommendationCode/update',
    data: {
      body: {
        ...params
      }
    },
  });
}

/**
 * 删除邀请码
 */
 export function deleteCode(params = {}) {
  return http.request({
    url: '/recommendationCode/delete',
    data: {
      body: {
        ...params
      }
    },
  });
}