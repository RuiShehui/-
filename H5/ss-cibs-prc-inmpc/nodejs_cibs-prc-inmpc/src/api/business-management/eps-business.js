/*
 * @Author: ZhangZhen
 * @Date: 2021-11-04 11:00:15
 * @LastEditTime: 2021-12-09 16:11:27
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \workplace\src\api\business-manage\eps-business.js
 */
import http from '../http';

/**
 * get-eps-business-list
 * @param {{ current: number; size: number; }} params get-submit-data
 * @return {Promise<any>}
 */
function getEpsBusinessList(params) {
  return http.request({
    data: {
      body: {
        ...params
      }
    },
    url: '/busi-manage/getEpsTypeListPage'
  });
}

/**
 * add-eps-business
 * @param {{ [key: string]: string | number }} data add-submit-data
 */
function addEpsBusiness(data) {
  return http.request({
    data: {
      body: {
        ...data
      }
    },
    url: '/busi-manage/saveEpsType',
  });
}

/**
 * edit-eps-business
 * @param {{ [key: string]: string | number }} data edit-submit-data
 */
function editEpsBusiness(data) {
  return http.request({
    data: {
      body: {
        ...data
      }
    },
    url: '/busi-manage/updateEpsType',
  });
}

/**
 * del-eps-business
 * @param {{ [key: string]: string | number }} data delete-submit-data
 */
function delEpsBusiness(data) {
  return http.request({
    data: {
      body: {
        ...data,
        // // 删除接口需要添加deleteStatus
        // // deleteStatus: '1'
      }
    },
    url: '/busi-manage/deleteEpsType'
  });
}

/**
 * del-eps-business
 * @param {{ [key: string]: string | number }} data delete-submit-data
 */
// 查询所有商户类别列表
function getAllEpsTypeList(data) {
  return http.request({
    data: {
      body: {
        ...data,
      }
    },
    url: '/busi-manage/getAllEpsTypeList'
  });
}

/**
 * del-eps-business
 * @param {{ [key: string]: string | number }} data delete-submit-data
 */
// 查询商户类别下商户名称
function getEps(data) {
  return http.request({
    data: {
      body: {
        ...data,
      }
    },
    url: '/bus-manage/getEps'
  });
}

/**
 * get-bill-type-list
 * @param {{ [key: string]: string | number }} data delete-submit-data
 */
// 查询商户类别下商户名称
function getBillTypeList(data) {
  return http.request({
    data: {
      body: {
        ...data,
      }
    },
    url: '/bus-manage/getBillTypeList'
  });
}
//校验商户维护新增时是否合法
function checkMyMercharntBillNo(data){
  return http.request({
    data: {
      body: {
        ...data,
      }
    },
    url: '/cust-manage/checkMyMerchantBillNo'
  });
}
export {
  getEpsBusinessList,
  addEpsBusiness,
  editEpsBusiness,
  delEpsBusiness,
  getAllEpsTypeList,
  getEps,
  getBillTypeList,
  checkMyMercharntBillNo
};