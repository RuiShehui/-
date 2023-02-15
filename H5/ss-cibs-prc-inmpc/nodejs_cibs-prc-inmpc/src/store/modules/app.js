/*
 * @Author: 赵霖
 * @Date: 2021-10-26 10:15:02
 * @LastEditTime: 2022-01-25 10:11:08
 * @LastEditors: ZhangZhen
 * @Description: in18国际化语言
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\store\modules\app.js
 */
function setLang(state, lang = "zhXG") {
  state.lang = lang
}
export default {
  state: {
    lang: 'zhXG'
  },
  mutations: {
    SET_LANG: setLang,
    setLoading(state, boolean) {
      state.loading = boolean;
    }
  },
  actions: {
    SET_LANG({ commit }, lang) {
      commit("SET_LANG", lang);
    }
  },
  namespaced: true,
}
