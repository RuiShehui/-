/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2022-06-10 17:00:10
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\role-management\index.js
 */
import http from '../http';

/**
 * 角色列表查询
 * 
 */
function getFindRuleInfoPageList(params) {
  return http.request({
    method: 'POST',
    url: '/role-manage/findRuleInfoPageList',
    data: {
      body: {
        ...params
      }
    },
  // baseURL: '/cibs'
  });
}

/**
 * 根据角色编号查询详情
 */
function findRuleInfoCode(params) {
  return http.request({
    method: 'POST',
    url: '/role-manage/findRoleInfo',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/system-manage'
  // baseURL: '/cibs'
  });
}

/**
 * 角色新增
 * 
 */
function roleAdd(params) {
  return http.request({
    method: 'POST',
    url: '/role-manage/addRuleInfo',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/system-manage'
  // baseURL: '/cibs'
  });
}

// /**
//  * 查询当前角色下的菜单信息
//  * 
//  */
// function findMenuCodeByRoleCode(params) {
//     return http.request({
//         method: 'POST',
//         url: '/findMenuCodeByRoleCode',
//         data: {
//             body: {
//                 ...params
//             }
//         }
//     });
// }

// /**
//  * 角色菜单关联详情信息查询
//  * 
//  */
// function findRoleMenuRLATR(params) {
//     return http.request({
//         method: 'POST',
//         url: '/findRoleMenuRLATR',
//         data: {
//             body: {
//                 ...params
//             }
//         }
//     });
// }

/**
 * 角色管理——删除
 * 
 */
function removeRuleInfo(params) {
  return http.request({
    method: 'POST',
    url: '/role-manage/removeRuleInfo',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/system-manage'
  // baseURL: '/cibs'
  });
}

/**
 * 角色管理——更新
 * 
 */
function updateRuleInfo(params) {
  return http.request({
    method: 'POST',
    url: '/role-manage/updateRuleInfo',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/system-manage'
  // baseURL: '/cibs'
  });
}

export {
  getFindRuleInfoPageList,
  findRuleInfoCode,
  roleAdd,
  // findMenuCodeByRoleCode,
  // findRoleMenuRLATR,
  removeRuleInfo,
  updateRuleInfo
};