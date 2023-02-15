/*
 * @Author: ZhangZhen
 * @Date: 2022-01-24 10:01:11
 * @LastEditTime: 2022-01-24 10:21:34
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\directives\polyfill-tab-close.js
 */
import { isIE, isIE11 } from '@/utils/tools';

const closeTpl = `
  <span class="inner-close-icon" style="position: relative; left: 5px; font-size: 18px;">
    &times
  </span>
`;


export default {
  bind(el, binding) {
    const { icon } = binding.value;

    const closeTag  = el.querySelector('.el-icon-close');

    if (isIE() || isIE11()) {
      if (closeTag) {
        closeTag.className = 'ie-icon';
        closeTag.innerHTML = closeTpl;
      }
    }
  },
  update(el, binding) {
    const { icon } = binding.value;

    const closeTag  = el.querySelector('.el-icon-close');

    if (isIE() || isIE11()) {
      // console.log(icon, closeTag);
      if (closeTag && ['close'].includes(icon)) {
        closeTag.className = 'ie-icon';
        closeTag.innerHTML = closeTpl;
      }
    }
  }
}
