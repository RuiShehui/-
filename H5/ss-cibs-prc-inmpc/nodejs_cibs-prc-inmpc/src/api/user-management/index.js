/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2022-05-13 18:56:25
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\user-management\index.js
 */
import http from '../http';

/**
 * 用户信息列表分页查询
 * 
 */
function getFindUserInfoListPage(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/findUserInfoListPage',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/ranzican"
        // baseURL: '/cibs',
    });
}

/**
 * 用户信息新增
 */
function addUserInfo(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/addUserInfo',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/system-manage"
    });
}

/**
 * 用户角色关联信息查询服务
 * 
 */
function findUserRuleInfoList(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/findUserRuleInfoList',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/system-manage"
        // baseURL: '/cibs'
    });
}

/**
 * 用户角色清单查询服务
 * 
 */
function findUserRuleLRLATInfoList(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/findUserRuleLRLATInfoList',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/system-manage"
        // baseURL: '/cibs'
    });
}

/**
 * 用户管理——删除
 */
function removeUserInfo(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/removeUserInfo',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/system-manage"
        // baseURL: '/cibs'
    });
}

/**
 * 用户管理——更新
 * 
 */
function updateUserInfo(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/updateUserInfo',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/system-manage"
        // baseURL: '/cibs'
    });
}

/**
 * 用户管理——用户名校验
 * 
 */
function validateUserName(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/validateUserName',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/system-manage"
        // baseURL: '/cibs'
    });
}

/**
 * 用户管理——用户下拉框信息查询
 * 
 */
function findUserInfoFromDropDownBox(params) {
    return http.request({
        method: 'POST',
        url: '/user-manage/findUserInfoFromDropDownBox',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/ranzican"
        // baseURL: '/cibs'
    });
}

/**
 * 查看是否为台风天
 * 
 */
function getTyphoonFlag(params) {
    return http.request({
        method: 'POST',
        url: '/special-weather-setting/getTyphoonFlag',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/ranzican"
        // baseURL: '/cibs'
    });
}

/**
 * 更新是否为台风天
 * 
 */
function updateTyphoonFlag(params) {
    return http.request({
        method: 'POST',
        url: '/special-weather-setting/updateTyphoonFlag',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/ranzican"
        // baseURL: '/cibs'
    });
}

export {
    getFindUserInfoListPage,
    addUserInfo,
    findUserRuleInfoList,
    removeUserInfo,
    updateUserInfo,
    findUserRuleLRLATInfoList,
    validateUserName,
    findUserInfoFromDropDownBox,
    getTyphoonFlag,
    updateTyphoonFlag
};