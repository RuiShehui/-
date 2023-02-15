/*
 * @Author: ZhangZhen
 * @Date: 2021-11-25 15:13:45
 * @LastEditTime: 2022-06-10 17:28:33
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * 表单文字对齐
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\directives\label-align.js
 */
import { setElStyles } from '@/utils/tools';

export default {
  /**
   * when element binding on vnode
   * @param {Element} el current-element
   */
  bind(el) {
    _setElFormLabel(el);
  },
  /**
   * update && bind again
   */
  update(el) {
    _setElFormLabel(el);
  }
};

/**
 * set-element-form's label
 * @param {Element} el current-element
 */
function _setElFormLabel(el, width = 12.5) {
  const oLabel = el.querySelector('.el-form-item__label');
  if (oLabel) {
    const { innerText } = oLabel,
      _leftLen = innerText.length - 5;

    const { children } = oLabel.parentNode;

    const iretablleChild = Array.from(children).find(el => el.querySelector('.el-form-item__label'));

    if (iretablleChild) {
      _setElFormLabel(iretablleChild, width - 1);
    }
    // oLabel prefix style
    setElStyles(oLabel, {
      'text-align': 'left',
      position: 'relative',
      right: `${(0 + _leftLen * width)}px`
    });
    // oLabel's borther prefix style
    Array.from(children)
      .filter(el => el !== oLabel)
      .forEach(el => setElStyles(el, {
        'text-align': 'left',
        position: 'relative',
        right: `${(0 + _leftLen * width)}px`
      }));
  }
}
