/*
 * @Author: ZhangZhen
 * @Date: 2021-11-09 15:32:45
 * @LastEditTime: 2021-11-10 15:29:25
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\src\api\business-manage\charge.js
 */
/** 收费设置模块 */
import http from '../http';

/**
 * get-charge-list
 * @param {{ current: number; size: number; [key: string]: string | number; }} params get-list-params
 * @return {Promise<any>}
 */
function getChargeList(params = {}) {
  return http.request({
    data: {
      body: {
        ...params
      }
    },
    url: '/charge/list'
  });
}

/**
 * save-charge
 * @param {{ [key: string]: string | number }} data add-submit-data
 */
function saveCharge(data = {}) {
  return http.request({
    data: {
      body: {
        ...data
      }
    },
    url: '/save/charge'
  });
}

/**
 * delete-charge
 * @param {{ [key: string]: string | number }} params delete-submit-data
 */
function deleteCharge(params = {}) {
  return http.request({
    data: {
      body: {
        ...params
      }
    },
    url: '/delete/charge'
  });
}

/**
 * charge-query
 * @param {{ [key: string]: string | number }} params detail-submit-params
 */
function chargeQuery(params) {
  return http.request({
    data: {
      body: {
        ...params
      }
    },
    url: '/charge/query'
  });
}

/**
 * charge-update
 * @param {{ [key: string]: string | number }} data edit-submit-data
 */
function chargeUpdate(data) {
  return http.request({
    data: {
      body: {
        ...data
      }
    },
    url: '/charge/update'
  });
}

export {
  getChargeList,
  saveCharge,
  deleteCharge,
  chargeQuery,
  chargeUpdate
};
