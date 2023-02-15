/*
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-01-24 13:02:14
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\storageTools.js
 */
import { isType } from '@/utils/tools';
/**
 * 存储前缀名
 */
const prefix = 'Storage-RSK-';
/**
 * 国家地区列表
 */
const COUNTRY_LIST = `${prefix}COUNTRY_LIST`;
/**
 * 分行列表
 */
const BRANCH_LIST = `${prefix}BRANCH_LIST`;
/**
 * 行业列表
 */
const INDUSTRY_LIST = `${prefix}INDUSTRY_LIST`;
/**
 * 岗位列表
 */
const JOB_LIST = `${prefix}JOB_LIST`;
/**
 * 国家列表
 */
const COUNTRIES_LIST = `${prefix}COUNTRIES_LIST`;
/**
 * 省份列表
 */
const PROVINCE_LIST = `${prefix}PROVINCE_LIST`;
/**
 * 存储国家地区列表
 * @param {[]} countryList 国家地区列表
 * @return {void}
 */
const setCountryList = (countryList = []) => {
  if (isType(countryList, 'Array') && countryList.length) {
    sessionStorage.setItem(COUNTRY_LIST, JSON.stringify(countryList));
  } else {
    throw new Error('"countryList" should be a not-empty array');
  }
}
/**
 * 获取国家地区列表
 * @return {[]} 国家地区列表
 */
const getCountryList = () => {
  const _jsonArr = sessionStorage.getItem(COUNTRY_LIST) || '[]';
    const countryList = JSON.parse(_jsonArr);

  return countryList;
}
/**
 * 存储所有分行列表
 * @param {[]} branchList 分行列表
 * @return {void}
 */
const setBranchList = (branchList = []) => {
  if (isType(branchList, 'Array') && branchList.length) {
    sessionStorage.setItem(BRANCH_LIST, JSON.stringify(branchList));
  } else {
    throw new Error('"branchList" should be a not-empty array');
  }
}
/**
 * 获取分行列表
 * @return {[]} 分行列表
 */
 const getBranchList = () => {
  const _jsonArr = sessionStorage.getItem(BRANCH_LIST) || '[]';
    const branchList = JSON.parse(_jsonArr);

  return branchList;
}
/**
 * 存储数据字典列表
 * @param {'INDUSTRY' | 'JOB' | 'COUNTRY'} otp
 * @return {void}
 */
 const setDataDitionaryList = (dataDitionaryList = [], otp) => {
  if (isType(dataDitionaryList, 'Array') && dataDitionaryList.length) {
    switch (otp) {
      case 'INDUSTRY':
        sessionStorage.setItem(INDUSTRY_LIST, JSON.stringify(dataDitionaryList));
        break;
      case 'JOB':
        sessionStorage.setItem(JOB_LIST, JSON.stringify(dataDitionaryList));
        break;
      case 'COUNTRY':
        sessionStorage.setItem(COUNTRIES_LIST, JSON.stringify(dataDitionaryList));
        break;
      case 'PROVINCE':
        sessionStorage.setItem(PROVINCE_LIST, JSON.stringify(dataDitionaryList));
        break;
      default:
        break;
    }
  } else {
    throw new Error('"dataDitionaryList" should be a not-empty array');
  }
}
/**
 * 获取数据字典列表
 * @param {'INDUSTRY' | 'JOB' | 'COUNTRY'} otp
 * @return {[]} 列表
 */
const getDataDitionaryList = (otp) => {
  let _jsonArr = ''
  switch (otp) {
    case 'INDUSTRY':
      _jsonArr = sessionStorage.getItem(INDUSTRY_LIST) || '[]';
      break;
    case 'JOB':
      _jsonArr = sessionStorage.getItem(JOB_LIST) || '[]';
      break;
    case 'COUNTRY':
      _jsonArr = sessionStorage.getItem(COUNTRIES_LIST) || '[]';
      break;
    case 'PROVINCE':
      _jsonArr = sessionStorage.getItem(PROVINCE_LIST) || '[]';
      break;
    default:
      break;
  }
  const dataDitionaryList = JSON.parse(_jsonArr);
  return dataDitionaryList;
}

export {
  prefix,
  /**
   * 国家地区列表
   */
  COUNTRY_LIST,
  /**
   * 存储国家地区列表
   * @param {[]} countryList 国家地区列表
   * @return {void}
   */
  setCountryList,
  /**
   * 获取国家地区列表
   * @return {[]} 国家地区列表
   */
  getCountryList,
  BRANCH_LIST,
  setBranchList,
  getBranchList,
  INDUSTRY_LIST,
  JOB_LIST,
  COUNTRIES_LIST,
  PROVINCE_LIST,
  setDataDitionaryList,
  getDataDitionaryList
};
