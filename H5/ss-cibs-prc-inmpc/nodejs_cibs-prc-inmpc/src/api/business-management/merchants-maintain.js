/*
 * @Author: your name
 * @Date: 2021-11-05 16:04:21
 * @LastEditTime: 2021-12-24 17:32:24
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \workplace\nodejs_cibs-prc-inmpc\src\api\business-manage\merchants-maintain.js
 */
import http from '../http';

/**
 * getmerchants-maintain-list
 */
function getMMList(params) {
  return http.request({
    url: '/bus-manage/getEpsListPage',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * add-getmerchants-maintain
 */
function addMMItem(data) {
  return http.request({
    url: '/bus-manage/saveEpsAndBill',
    data: {
      body: {
        ...data
      }
    }
  });
}

/**
 * edit-getmerchants-maintain (type-0)
 */
function editMMItem(data) {
  return http.request({
    url: '/bus-manage/updateEpsAndBill',
    data: {
      body: {
        ...data
      }
    }
  });
}

/**
 * edit-getmerchants-maintain-1 (type-1)
 */
function editMMItem1(data) {
  return http.request({
    url: '/bus-manage/updateMerAndBillList1',
    data: {
      body: {
        ...data
      }
    }
  });
}

/**
 * del-getmerchants-maintain
 */
function delMMItem(params) {
  return http.request({
    url: '/bus-manage/delEpsAndBill',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * get-merachants-detail
 */
function getMMDetail(params = {}) {
  return http.request({
    url: '/bus-manage/getEpsInf',
    data: {
      body: {
        ...params
      }
    }
  });
}

export {
  getMMList,
  addMMItem,
  editMMItem,
  editMMItem1,
  delMMItem,
  getMMDetail
};
