/*
 * @Author: ZhangZhen
 * @Date: 2021-11-18 17:23:42
 * @LastEditTime: 2022-01-05 09:47:39
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\despostiReservation\utils\tools.js
 */
const _submitDataKey = 'DESPOSIT_RESERVATION_SUBMIT_DATA';
/**
 * 设置提交数据
 * @param {{[key: string]: string;}} submitData
 */
function setSubmitData(submitData) {
  sessionStorage.setItem(
    _submitDataKey,
    JSON.stringify(submitData)
  );
}
/**
 * 获取提交数据
 * @return {{[key: string]: string;}} submitData
 */
function getSubmitData() {
  const submitData = JSON.parse(
    sessionStorage.getItem(_submitDataKey) || '{}'
  );
  return submitData;
}

/**
 * remove-submit-data
 */
function removeSubmitData() {
  sessionStorage.removeItem(_submitDataKey);
}

export {
  setSubmitData,
  getSubmitData,
  removeSubmitData,
};