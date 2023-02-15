/*
 * @Author: ZhangZhen
 * @Date: 2022-02-18 09:43:37
 * @LastEditTime: 2022-03-31 16:02:53
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\utils\hooks.js
 */
function useLocalStorage(key = '', defaultValue = '[]') {
  if (!key || !key.length) {
    throw new Error('need provide arguments: ["key"]');
  }

  /** get localStorage banks */
  function GET_STORAGE_ITEMS() {
    const strValue = localStorage.getItem(key) || defaultValue;

    return JSON.parse(strValue);
  }
  /** set localStorage banks */
  function SET_STORAGE_ITEMS(bankInfos = []) {
    localStorage.setItem(key, JSON.stringify(bankInfos));
  }
  
  return [
    GET_STORAGE_ITEMS,
    SET_STORAGE_ITEMS,
  ];
}

export {
  useLocalStorage
};
