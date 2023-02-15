/*
 * @Author: ZhangZhen
 * @Date: 2021-11-08 15:59:06
 * @LastEditTime: 2021-11-15 14:17:06
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\src\api\business-manage\exception.js
 */
/** 业务管理-批量交易 */
import http from '@/api/http';

/**
 * get-exception-list
 * @param {{[key: string]: string | number;}} params list-params
 * @return {Promise<any>} return async-fn
 */
function getExceptionList(params) {
  return http.request({
    url: '/bulkInner/page',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * update-trade-status
 * @param {{[key: string]: string | number;}} data edit-data
 */
function updateTradeStatus(data) {
  return http.request({
    url: '/bulkInner/update',
    data: {
      body: {
        ...data
      }
    }
  });
}

/**
 * 登记第三者账户
 * @param {} data 
 * @returns 
 */
function queryTransferDetail(data){
  return http.request({
    url: '/inner-bank-transfer/queryTransferDetail',
    data: {
      body: {
        ...data
      }
    }
  })
}

/**
 * 账单维护
 * @param {} data 
 * @returns 
 */
function queryMerchantBillDetail(data){
  return http.request({
    url: '/cust-manage/queryMerchantBillDetail',
    data: {
      body: {
        ...data
      }
    }
  })
}

export {
  getExceptionList,
  updateTradeStatus,
  queryTransferDetail,
  queryMerchantBillDetail
};
