import {
  TOKEN,
  HEAD,
  STORAGE_TABS
} from "@/configs/keys";

/*
 * @Author: ZhangZhen
 * @Date: 2021-11-08 10:18:22
 * @LastEditTime: 2022-01-28 09:11:41
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\user.js
 */
export function setToken(token) {
  return window.sessionStorage.setItem(TOKEN, token);
}

export function getToken() {
  // mock-token
  // return 'mock-token';
  // real-storage-token
  return window.sessionStorage.getItem(TOKEN);
}

export function removeToken() {
  return window.sessionStorage.removeItem(TOKEN);
}

export function getUser() {
  return window.sessionStorage.getItem('user');

}

export function setUser(user) {
  return window.sessionStorage.setItem('user', user);
}

export function removeUser() {
  return window.sessionStorage.removeItem('user');
}

export function getRoleMaps() {
  return window.sessionStorage.getItem('roleMaps');
}

export function setRoleMaps(roleMaps) {
  return window.sessionStorage.setItem('roleMaps', JSON.stringify(roleMaps));
}

export function getRoleCode() {
  return sessionStorage.getItem('roleCode');
}

export function setRoleCode(roleCode = '') {
  sessionStorage.setItem('roleCode', roleCode);
}

export function removeRoleMaps() {
  return window.sessionStorage.getItem('roleMaps');
}

export function getRoleDetail() {
  const roleDetailStr = sessionStorage.getItem('roleDetail') || '{}';

  return JSON.parse(roleDetailStr);
}

export function setRoleDetail(roleDetail) {
  return sessionStorage.setItem('roleDetail', JSON.stringify(roleDetail));
}

export function removeRoleDetail() {
  return window.sessionStorage.getItem('roleDetail');
}

export function setHead(head) {
  sessionStorage.setItem(HEAD, JSON.stringify(head));
}

export function getHead() {
  // const headJsonStr =
  //   sessionStorage.getItem(HEAD) ? sessionStorage.getItem(HEAD) : '{ "lang": "zhXG" }';
  const headJsonStr = '{ "lang": "zhXG" }';
  return JSON.parse(headJsonStr);
  // return {
  //   channel: 'IN',
  //   tranCode: '',
  //   custNo: '',
  //   userNo: '',
  //   orgCode: '',
  //   globalSeqNo: '',
  //   serviceUrl: '',
  //   requestNo: '',
  //   tranDate: '',
  //   tranTime: '',
  //   fileFlag: '',
  //   reserved: '',
  //   startNum: '',
  //   queryNum: '',
  //   totalNum: '',
  //   programId: '',
  //   serialNo: '',
  //   succFlag: '',
  //   succMessage: '',
  //   returnCode: '',
  //   returnMessage: ''
  // };
}