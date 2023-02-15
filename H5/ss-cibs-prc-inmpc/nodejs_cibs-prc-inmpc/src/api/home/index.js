/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2021-12-24 17:42:27
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \workplace\nodejs_cibs-prc-inmpc\src\api\home\index.js
 */
import http from '../http';

/**
 * 用户基本信息
 * 
 */
function getUserInfo() {
    return http.request({
        method: 'POST',
        data: {},
        url: '/home/detail',
        // baseURL: "/login"
      // baseURL: '/cibs'
    });
}

/**
 * 用户授权信息
 */
function getAuthDetail(params) {
    return http.request({
        method: 'POST',
        url: '/home/authDetail',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/login"
      // baseURL: '/cibs'
    });
}

/**
 * 用户未读信息
 */
function getUserMessage(params) {
    return http.request({
        method: 'POST',
        url: '/home/message',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/login"
      // baseURL: '/cibs'
    });
}


/**
 * 用户未读信息条数
 */
function getUserMessageCount(params) {
    return http.request({
        method: 'POST',
        url: '/home/messageCount',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/login"
      // baseURL: '/cibs'
    });
}

/**
 * 用户信息编辑
 */
function updateState(params) {
    return http.request({
        method: 'POST',
        url: '/home/updateState',
        data: {
            body: {
                ...params
            }
        },
        // baseURL: "/login"
      // baseURL: '/cibs'
    });
}


export {
    getUserInfo,
    getAuthDetail,
    getUserMessage,
    getUserMessageCount,
    updateState
};