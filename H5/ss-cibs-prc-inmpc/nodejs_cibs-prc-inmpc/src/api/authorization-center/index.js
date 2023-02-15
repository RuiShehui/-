/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2022-06-08 10:18:49
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\authorization-center\index.js
 */
import http from '../http';

/**
 * 授权中心——记录列表查询
 * 
 */
function getAuthorizationList(params) {
  return http.request({
    method: 'POST',
    url: '/auth-com/list',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/qinhongxin'
    // baseURL: '/cibs'
  });
}

/**
 * 授权记录详情查询
 */
function getAuthorizationDetail(params) {
  return http.request({
    method: 'POST',
    url: '/auth-com/detail',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/qinhongxin'
    // baseURL: '/cibs'
  });
}

/**
 * 授权接口
 * 
 */
function empower(params) {
  return http.request({
    method: 'POST',
    url: '/auth-com/empower',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/qinhongxin'
    // baseURL: '/cibs'
  });
}

/**
 * 撤销授权
 * 
 */
function undo(params) {
  return http.request({
    method: 'POST',
    url: '/auth-com/undo',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/qinhongxin'
    // baseURL: '/cibs'
  });
}

export {
  getAuthorizationList,
  getAuthorizationDetail,
  empower,
  undo
};