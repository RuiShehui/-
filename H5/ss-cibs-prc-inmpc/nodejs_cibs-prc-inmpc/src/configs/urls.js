/*
 * @Author: ZhangZhen
 * @Date: 2021-11-04 10:14:12
 * @LastEditTime: 2022-04-29 15:00:37
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\configs\urls.js
 */

const isProduction = process.env.NODE_ENV !== 'development';

/** base-request-url */
const BASE_URLS = {
  DEV: '/cibs',
  UAT: isProduction ? '/cibs' : '/cibs'
};

const BASE_REQUEST_URL = BASE_URLS.DEV;

export {
  BASE_REQUEST_URL,
};