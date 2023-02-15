/*
 * @Author: your name
 * @Date: 2022-10-27 14:35:36
 * @LastEditTime: 2022-11-04 09:30:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\api\specialInstruction\index.js
 */

import http from '../http';


/**
 * 白名单表查询
 * 
 */
 function queryList(params) {
  return http.request({
    method: 'POST',
    url: '/corpbank/user-coas-whitelist-info/queryList',
    data: {
      body: {
        ...params
      }
    },
  // baseURL: '/cibs'
  });
}
/**
 * 白名单新增
 * 
 */
 function querySave(params) {
  return http.request({
    method: 'POST',
    url: '/corpbank/user-coas-whitelist-info/save',
    data: {
      body: {
        ...params
      }
    },
  // baseURL: '/cibs'
  });
}

function getFindUserInfoListPage(params) {
  return http.request({
      method: 'POST',
      url: '/user-manage/findUserInf',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}



function unBind(params) {
  return http.request({
      method: 'POST',
      url: '/corpbank/user-coas-whitelist-info/delete',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}



function update(params) {
  return http.request({
      method: 'POST',
      url: '/corpbank/user-coas-whitelist-info/update',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}

//管理 
function queryApplyList(params) {
  return http.request({
      method: 'POST',
      url: '/corpbank/user-special-instruct-apply/queryApplyList',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}

//管理 
function exportExcel(params) {
  return http.request({
      method: 'POST',
      url: '/corpbank/user-special-instruct-apply/exportExcel',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}
function queryApplyDetail(params) {
  return http.request({
      method: 'POST',
      url: '/corpbank/user-special-instruct-apply/queryApplyDetail',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}


function processApply(params) {
  return http.request({
      method: 'POST',
      url: '/corpbank/user-special-instruct-apply/processApply',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}
function markInProcess(params) {
  return http.request({
      method: 'POST',
      url: '/corpbank/user-special-instruct-apply/markInProcess',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}

function downloadFiles(params) {
  return http.request({
      method: 'POST',
      url: '/raoreview/downloadFile',
      data: {
          body: {
              ...params
          }
      },
      // baseURL: "/ranzican"
      // baseURL: '/cibs',
  });
}
export {
  queryList,
  querySave,
  getFindUserInfoListPage,
  unBind,
  update,
  queryApplyList,
  exportExcel,
  queryApplyDetail,
  processApply,
  markInProcess,
  downloadFiles
};