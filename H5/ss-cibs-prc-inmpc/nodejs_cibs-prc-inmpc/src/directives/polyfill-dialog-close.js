/*
 * @Author: ZhangZhen
 * @Date: 2022-01-21 11:39:39
 * @LastEditTime: 2022-01-24 10:07:26
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\directives\polyfill-dialog-close.js
 */
import { setElStyles } from "@/utils/tools";
import { isIE, isIE11 } from '@/utils/tools';

const closeTpl = `
  <span>
    &times
  </span>
`;

export default {
  bind(el, binding) {
    const { icon } = binding.value;

    const oHeader = el.querySelector('.el-dialog__header'),
      oCloseBtn = oHeader.querySelector('.el-dialog__headerbtn');
    if (isIE() || isIE11()) {
      oHeader.style.position = 'relative';
      setElStyles(oCloseBtn, {
        position: 'absolute',
        top: '0',
        right: '20px',
        color: '#999', // #e3414
        fontSize: '25px'
      });
      oCloseBtn.innerHTML = getRenderTpl(icon);
    }
  }
}

function getRenderTpl(icon) {
  switch (icon) {
    case 'close':
      return closeTpl;
    default:
      return '<span>null</span>';
  }
}