/*
 * @Author: ZhangZhen
 * @Date: 2021-11-10 17:48:38
 * @LastEditTime: 2022-01-04 17:35:48
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\business-manage\business-start.js
 */
/** 业务启停控制 */

import http from '../http';

/**
 * 获取业务启停列表
 */
export function getNetbackList(params = {}) {
  return http.request({
    url: '/busi-netbank/getMenuList',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * 获取修改前的业务启停内容
 */
export function getNetbackDetail(params = {}) {
  return http.request({
    url: '/busi-netbank/queryInf',
    // url: ''/busi-netbank/queryDetial'',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * 业务启停---文档下载
 */
export function downloadMenuObjList(params = {}) {
  return http.request({
    url: '/busi-netbank/downloadMenuObjList',
    data: {
      body: {
        ...params
      }
    },
    responseType: 'blob'
  });
}

/**
 * 修改业务启停信息
 */
export function editNetback(data = {}) {
  return http.request({
    url: '/busi-netbank/updateMenu',
    data: {
      body: {
        ...data
      }
    }
  });
}

/**
 * 商户类别维护详情
 */
export function getEpsTypeInf(data = {}) {
  return http.request({
    url: '/busi-manage/getEpsTypeInf',
    data: {
      body: {
        ...data
      }
    }
  });
}