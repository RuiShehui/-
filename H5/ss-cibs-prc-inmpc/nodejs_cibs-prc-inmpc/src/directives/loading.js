/*
 * @Author: ZhangZhen
 * @Date: 2021-11-05 12:50:59
 * @LastEditTime: 2021-11-10 19:17:12
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\ss-cibs-prc-inmpc\src\directives\loading.js
 */
/**
 * v-loading
 * @module import('vue').DirectiveOptions
 */

export default {
  inserted(el, binding, vNode) {
    watchLoading(el, binding);
  },
  update(el, binding) {
    watchLoading(el, binding);
  }
}

function watchLoading(el, binding) {
  const loading = binding.value;
  _handleElLoading(el, loading);
}

/**
 * handle-element-loading
 * @param {HTMLElement} el target-html-element
 * @param {boolean} loading element-is-loading
 * 
 */
function _handleElLoading(el, loading) {
  switch (loading) {
    case true:
      el.style = {
        opacity: '0.5',
        backgroundColor: '#f6f6f6',
      };
      break;
    case false:
      el.style = {};
      break;
  }
}