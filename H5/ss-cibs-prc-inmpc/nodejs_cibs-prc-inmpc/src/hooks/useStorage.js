/*
 * @Author: ZhangZhen
 * @Date: 2022-01-24 13:01:49
 * @LastEditTime: 2022-06-10 17:44:00
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\hooks\useStorage.js
 */
/**
 * @param { string } storageKey storage-key (localStorage/sessionStorage)
 * @param { object } initialValue storage-key
 */
export default (storageKey, initialValue = {}) => {
  if (!storageKey) {
    throw new Error('storageKey can\'t be null, undefined or NAN!');
  }

  let cache = {
    COUNTRY_LIST: []
  };
  cache[storageKey] = cache[storageKey] || initialValue;

  // console.log(cache);

  function getStorage() {
    const itemJsonString = sessionStorage.getItem(storageKey),
      storageItem = itemJsonString ? JSON.parse(itemJsonString) : initialValue;
    return storageItem;
  }
  function setStorage (newValue = {}) {
    const itemJsonString = JSON.stringify(newValue);

    sessionStorage.setItem(storageKey, itemJsonString);
  }
  function initStorage () {
    setStorage(cache[storageKey]);
  }

  return [
    getStorage,
    setStorage,
    initStorage
  ];
}
