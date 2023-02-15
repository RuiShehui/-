/*
 * @Author: zhangcheng
 * @Date: 2021-12-04 14:41:46
 * @LastEditTime: 2021-12-28 09:47:34
 * @LastEditors: zhangcheng
 * @Description: 字典
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\client-manage\dictionary.js
 */
import http from '../http';

// 证件类型查询
export function getListCardType(data = {}) {
  return http.request({
    url: '/card-info-manage/getListCardType',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 国家地区
export function getListCardArea(data = {}) {
  return http.request({
    url: '/card-info-manage/getListCardArea',
    data: {
      body: {
        ...data
      }
    }
  });
}