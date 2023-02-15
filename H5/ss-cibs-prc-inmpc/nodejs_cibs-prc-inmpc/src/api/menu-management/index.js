/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2022-06-01 16:12:44
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\menu-management\index.js
 */
import http from '../http';

/**
 * 菜单查询
 * 
 */
function getMenuList(params) {
  return http.request({
    url: '/menu-manage/findMenuInfo',
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
 * 菜单新增
 * 
 */
function menuAdd(params) {
  return http.request({
    method: 'POST',
    url: '/menu-manage/addMenuInfo',
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
 * 菜单编辑
 * 
 */
function menuEdit(params) {
  return http.request({
    url: '/menu-manage/updateMenuInfo',
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
 * 菜单删除
 * 
 */
function menudelete(params) {
  return http.request({
    url: '/menu-manage/deleteMenuInfo',
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
 * 菜单下拉框数据来源接口
 * 
 */
function getMenuInfoList() {
  return http.request({
    url: '/menu-manage/findMenuMainInfoList',
    data: {},
    // baseURL: '/system-manage'
  // baseURL: '/cibs'
  });
}

/**
 * 登录
 * 
 */
function userLogin(params = {}) {
  return http.request({
    url: '/login/cocLoginInfo',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/qinhongxin'
    // baseURL: '/UAT'
  });
}

/**
 * 登出
 */
function userLogout(
  // params = {}
) {
  return http.request({
    url: '/login/cocLogout',
    data: {
      body: {
        // ...params
      }
    },
    // baseURL: '/qinhongxin'
    // baseURL: '/cibs'
  });
}

/**
 * 当前用户下所有菜单信息查询
 * 
 */
function findUserRoleMenuList(params) {
  return http.request({
    url: '/menu-manage/findUserRoleMenuList',
    data: {
      body: {
        ...params
      }
    },
  // baseURL: '/cibs'
  });
}

/**
 * get-menu-by-role
 * @description 用户切换(获取菜单)
 * @param {{[key: string]: number | string | [] | {}}} params
 */
export function getMenusByRole(params) {
  return http.request({
    // baseURL: '/qinhongxin',
    url: '/home/changeRole',
    data: {
      body: {
        ...params
      }
    },
  });
}

export {
  getMenuList,
  menuAdd,
  menuEdit,
  menudelete,
  getMenuInfoList,
  userLogin,
  userLogout,
  findUserRoleMenuList
};