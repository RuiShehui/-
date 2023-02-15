/*
 * @Author: ZhangZhen
 * @Date: 2021-12-03 15:35:21
 * @LastEditTime: 2021-12-14 20:48:34
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\src\api\client-manage\common.js
 */
import http from '../http';

/**
 * 获取国家信息列表
 */
export function getCountryInfoList(params = {}) {
  return http.request({
    url: '/cust-country/getAllCountryList',
    data: {
      body: {
        ...params
      }
    },
    // baseURL: '/liukewei',
  });
}

/**
 * 校验swift-code是否合法
 */
export function validateSwiftCode(data = {}) {
  return http.request({
    url: '/cust-swift/judgeSwiftCode',
    data: {
      body: {
        ...data
      }
    },
   // baseURL: '/liukewei'
  });
}