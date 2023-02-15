/*
 * @Author: zhangcheng
 * @Date: 2021-12-08 15:03:06
 * @LastEditTime: 2021-12-08 15:50:54
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\src\store\modules\loading.js
 */
export default {
  namespaced: true,
  state: {
    loading: false
  },
  mutations: {
    SET_LOADING: (state, boolean) => {
      state.loading = boolean;
    }
  }
}