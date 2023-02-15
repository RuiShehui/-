/*
 * @Author: zhangcheng
 * @Date: 2021-11-10 10:00:34
 * @LastEditTime: 2021-11-22 16:47:54
 * @LastEditors: zhangcheng
 * @Description: 账单
 * @FilePath: \ss-cibs-prc-inmpc\ss-cibs-prc-inmpc\src\api\client-manage\bill.js
 */
import http from '../http';

// 开票信息列表
export function getBillList(data = {}) {
  return http.request({
    url: '/cust-manage/queryListPageBill',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 新增开票信息
export function saveBill(data = {}) {
  return http.request({
    url: '/cust-manage/saveBill',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 修改开票信息
export function updateBill(data = {}) {
  return http.request({
    url: '/cust-manage/updateBill',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 删除开票信息
export function deleteBill(data = {}) {
  return http.request({
    url: '/cust-manage/deleteBill',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 高风险商户(账单)登记查询
export function queryListPageBill(data = {}) {
  return http.request({
    url: '/cust-manage/queryListPageBill',
    data: {
      body: {
        ...data
      }
    }
  });
}