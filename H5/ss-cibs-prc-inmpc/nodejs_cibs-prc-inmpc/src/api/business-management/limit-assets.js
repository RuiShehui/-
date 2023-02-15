/*
 * @Author: ZhangZhen
 * @Date: 2021-11-18 19:48:41
 * @LastEditTime: 2022-06-06 11:11:30
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\business-management\limit-assets.js
 */
/**
 * 11-19: 银行交易限额
 * 
 */
import http from '../http';

/**
 * get-limit-list
 * @description 获取交易限额列表
 */
export function getLimitList(params = {}) {
  return http.request({
    // baseURL:'/business-manage',
    url: '/busi-bankLimit/getLimitList',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * set-limit-list
 * @description 银行限额列表批量修改
 */
export function setLimitList(data = {}) {
  return http.request({
    // baseURL:'/business-manage',
    url: '/busi-bankLimit/updateLimitList',
    data: {
      body: {
        ...data,
      }
    }
  });
}

/**
 * get-limit-levels
 */
export function getLimitLevels(params = {}) {
  return http.request({
    url: '/busi-bankLimit/getCustClazzList',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * add-limit-item
 */
export function addLimitItem(data = {}) {
  return http.request({
    url: '/busi-bankLimit/saveLimitMoudle',
    data: {
      body: {
        ...data,
      },
    },
  });
}

/**
 * get-limit-white-list
 */
export function queryBankLimitRelationList(params = {}) {
  return http.request({
    url: '/busi-specialLimit/queryBankLimitRelationList',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * add-limit-white-list
 */
export function saveBankLimitRelationList(params = {}) {
  return http.request({
    url: '/busi-specialLimit/saveBankLimitRelationList',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * edit-limit-white-list
 */
export function updateBankLimitRelation(params = {}) {
  return http.request({
    url: '/busi-specialLimit/updateBankLimitRelation',
    data: {
      body: {
        ...params,
      },
    },
  });
}

/**
 * del-limit-white-list
 */
export function delBankLimitRelation(params = {}) {
  return http.request({
    url: '/busi-specialLimit/delBankLimitRelation',
    data: {
      body: {
        ...params,
      },
    },
  });
}