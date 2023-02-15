/*
 * @Author: zhangcheng
 * @Date: 2022-03-10 11:08:46
 * @LastEditTime: 2022-03-10 11:21:35
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\store\modules\fund.js
 */
const ACTION_TYPES = {
  SET_OTP_STATUS: 'SET_OTP_STATUS'
}

const state = {
  isNeedOtp: true
};

const {
  SET_OTP_STATUS
} = ACTION_TYPES;

const mutations = {
  [SET_OTP_STATUS](state, isNeedOtp) {
    state.isNeedOtp = isNeedOtp;
  }
};

const actions = {
  [SET_OTP_STATUS]({
    commit,
  }, payload) {
    commit(SET_OTP_STATUS, payload);
  }
};

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export {
  ACTION_TYPES
};