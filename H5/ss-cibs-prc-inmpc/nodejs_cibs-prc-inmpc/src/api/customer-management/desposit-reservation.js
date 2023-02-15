/*
 * @Author: ZhangZhen
 * @Date: 2021-11-22 14:38:34
 * @LastEditTime: 2022-01-05 10:35:25
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\client-manage\desposit-reservation.js
 */
/**
 * 新增预约编号生成
 */
import http from '../http';

/**
 * 生成预约编号
 * @param {{ [key: string]: number | string; }} data 上传数据
 */
export function saveNumber(data = {}) {
  return http.request({
    // url:'/client-manage',
    url: '/cust-manage/saveNumber',
    data: {
      body: {
        ...data
      }
    },
  });
}

/**
 * 编号列表查询
 */
export function getNumberList(params = {}) {
  return http.request({
    url: '/cust-manage/queryNumberPage',
    data: {
      body: {
        ...params
      },
    },
  });
}