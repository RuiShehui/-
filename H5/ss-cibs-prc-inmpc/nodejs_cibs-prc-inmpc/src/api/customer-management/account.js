/*
 * @Author: zhangcheng
 * @Date: 2021-11-23 10:08:54
 * @LastEditTime: 2021-12-08 14:37:11
 * @LastEditors: ZhangZhen
 * @Description: Do not Edit
 * @FilePath: \workplace\src\api\client-manage\account.js
 */
import http from '../http';

// 账户信息查询
export function queryAccountPage(data = {}) {
  return http.request({
    url: '/account-manage/queryAccountPage',
    data: {
      body: {
        ...data
      }
    }
  });
}