export function setToken(token) {
  sessionStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export function getToken() {
  return window.sessionStorage.getItem('token');
}

export function getImgToken() {
  return localStorage.getItem('imgToken');
}

export function setImgToken(imgToken) {
  sessionStorage.setItem('imgToken', imgToken);
}

export function setNeedUpdatePassword(value) {
  return window.localStorage.setItem('needUpdatePassword', value);
}

export function removeNeedUpdatePassword() {
  return window.localStorage.removeItem('needUpdatePassword');
}

export function getNeedUpdatePassword() {
  return window.localStorage.getItem('needUpdatePassword') || 'Y';
}

export function setVerifPwdMethod(value) {
  return window.localStorage.setItem('verifPwdMethod', value);
}

export function getVerifPwdMethod() {
  return window.localStorage.getItem('verifPwdMethod');
}

export function removeVerifPwdMethod() {
  return window.localStorage.removeItem('verifPwdMethod');
}

export function getUser() {
  return window.localStorage.getItem('user');
}

export function setUser(user) {
  return window.localStorage.setItem('user', user);
}

export function removeUser() {
  return window.localStorage.removeItem('user');
}

export function getUserMenus() {
  return window.localStorage.getItem('menus') || [];
}

export function setUserMenus(menus) {
  return window.localStorage.setItem('menus', menus);
}

export function removeUserMenus() {
  return window.localStorage.removeItem('menus');
}

export function getUserInfo() {
  var infoObj = window.localStorage.getItem('userInfo');
  return infoObj ? JSON.parse(infoObj) : '';
}

export function setUserInfo(info) {
  var infoStr = info ? JSON.stringify(info) : '';
  return window.localStorage.setItem('userInfo', infoStr);
}

export function removeUserInfo() {
  return window.localStorage.removeItem('userInfo');
}

export function getBranch() {
  const res = getUserInfo() || {};
  return res.branch || '';
}

export function setAuth(auth) {
  var infoStr = auth ? JSON.stringify(auth) : '';
  window.localStorage.setItem('auth', infoStr);
}

export function getAuth() {
  var infoObj = window.localStorage.getItem('auth');
  return infoObj ? JSON.parse(infoObj) : '';
}

export function removeAuth() {
  window.localStorage.removeItem('auth');
}


