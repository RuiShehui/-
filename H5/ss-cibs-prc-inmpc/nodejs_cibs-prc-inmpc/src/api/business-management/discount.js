/*
 * @Author: ZhangZhen
 * @Date: 2021-11-15 11:29:58
 * @LastEditTime: 2021-12-07 17:35:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\src\api\business-manage\discount.js
 */
/** 银行收费折扣管理 */
import http from '../http';

/**
 * get-discount-list
 * @param {{ [key: string]: number | string | [] }} params 请求参数
 * @return {Promise<any>} result-list-info
 */
export function getDiscountList(params = {}) {
  return http.request({
  // baseURL:'/business-manage',
    url: '/busi-bankDiscount/getChargeListPage',
    data: {
      body: {
        ...params
      }
    }
  });
}
/**
 * get-discount-detail
 * @param {{ [key: string]: number | string | [] }} params 请求参数
 * @return {Promise<any>} result-detail-info
 */
export function getDiscountDetail(params = {}) {
  return http.request({
  // baseURL:'/business-manage',
    url: '/busi-bankDiscount/getChargeInf',
    data: {
      body: {
        ...params
      }
    }
  });
}
/**
 * down-load-ObjList
 * @param {{ [key: string]: number | string | [] }} params 请求参数
 * @return {Promise<any>} result-detail-info
 */
export function downloadObjList(params = {}) {
  return http.request({
    url: '/busi-bankDiscount/downloadObjList',
    data: {
      body: {
        ...params
      }
    },
    responseType: 'blob'
  });
}
/**
 * add-discount
 * @param {{ [key: string]: number | string | [] }} data 提交参数
 * @return {Promise<any>} result-add-info
 */
export function addDiscount(data) {
  return http.request({
  // baseURL:'/business-manage',
    url: '/busi-bankDiscount/saveCharge',
    data: {
      body: {
        ...data
      }
    }
  });
}
/**
 * edit-discount
 * @param {{ [key: string]: number | string | [] }} data 提交参数
 * @return {Promise<any>} result-edit-info
 */
export function editDiscount(data) {
  return http.request({
  // baseURL:'/business-manage',
    url: '/busi-bankDiscount/updateCharge',
    data: {
      body: {
        ...data
      }
    }
  });
}
/**
 * delete-discount
 * @param {{ [key: string]: number | string | [] }} params 提交参数
 * @return {Promise<any>} result-delete-info
 */
export function deleteDiscount(params) {
  return http.request({
  // baseURL:'/business-manage',
    url: '/busi-bankDiscount/delChargeInf',
    data: {
      body: {
        ...params
      }
    }
  });
}
