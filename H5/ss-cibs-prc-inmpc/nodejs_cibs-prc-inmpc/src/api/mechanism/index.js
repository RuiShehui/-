/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2021-12-07 17:43:18
 * @LastEditors: 朱涛
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\src\api\mechanism\index.js
 */
import http from '../http';

/**
 * 机构管理——查询
 * 
 */
function findOrganizationListInfo(params) {
    return http.request({
        method: 'POST',
        url: '/organization-manage/findOrganizationListInfo',
        data: {
            body: {
                ...params
            }
        },
      // baseURL: '/cibs'
    });
}

/**
 * 机构管理——新增
 * 
 */
function saveOrganizationInfo(params) {
    return http.request({
        method: 'POST',
        url: '/organization-manage/saveOrganizationInfo',
        data: {
            body: {
                ...params
            }
        },
      // baseURL: '/cibs'
    });
}

/**
 * 机构管理——编辑
 * 
 */
function updateOrganizationInfo(params) {
    return http.request({
        method: 'POST',
        url: '/organization-manage/updateOrganizationInfo',
        data: {
            body: {
                ...params
            }
        },
      // baseURL: '/cibs'
    });
}

/**
 * 机构管理——详情查询
 * 
 */
function findOrganizationInfo(params) {
    return http.request({
        method: 'POST',
        url: '/organization-manage/findOrganizationInfo',
        data: {
            body: {
                ...params
            }
        },
      // baseURL: '/cibs'
    });
}

/**
 * 机构管理——详情查询(不过滤逻辑删除数据)
 * 
 */
function findOrganizationInfoDetail(params) {
    return http.request({
        method: 'POST',
        url: '/organization-manage/findOrganizationInfoDetail',
        data: {
            body: {
                ...params
            }
        },
      // baseURL: '/cibs'
    });
}

/**
 * 机构管理——查询出所有机构(新增用户机构下拉框数据)
 * 
 */
function findORGMainListInfo(params) {
    return http.request({
        method: 'POST',
        url: '/organization-manage/findORGMainListInfo',
        data: {
            body: {
                ...params
            }
        },
      // baseURL: '/cibs'
    });
}

/**
 * 机构管理——删除
 * 
 */
function removeOrganizationInfo(params) {
    return http.request({
        method: 'POST',
        url: '/organization-manage/removeOrganizationInfo',
        data: {
            body: {
                ...params
            }
        },
      // baseURL: '/cibs'
    });
}


export {
    findOrganizationListInfo,
    saveOrganizationInfo,
    updateOrganizationInfo,
    findOrganizationInfo,
    findOrganizationInfoDetail,
    findORGMainListInfo,
    removeOrganizationInfo
};