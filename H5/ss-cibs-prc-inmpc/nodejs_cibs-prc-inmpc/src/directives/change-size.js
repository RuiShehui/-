/*
 * @Author: ZhangZhen
 * @Date: 2021-11-29 18:54:56
 * @LastEditTime: 2022-06-10 17:27:54
 * @LastEditors: ZhangZhen
 * 表单错误提示样式变更
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\directives\change-size.js
 */
import {
  setElStyles
} from "@/utils/tools";

export default {
  parent: null,
  /**
   * @param {HTMLElement} el
   */
  bind(el) {
    const oInput = el.getElementsByTagName('input')[0];
    if (oInput) {
      oInput.addEventListener('blur', onInputBlur, false);
    }
    // const oRoot = getParentByElement(oInput);
    // console.log(oRoot);
  }
};
export function onInputBlur(e) {
  const tar = e.target;
  let inputWrapper = tar.parentNode,
    formContent = inputWrapper.parentNode,
    el = formContent.parentNode;
  if (inputWrapper) {
    while (!Array.from(el.classList).includes('el-form-item')) {
      el = el.parentNode
    }
    if (
      Array.from(el.classList).includes(
        'is-error'
      )
    ) {
      setElStyles(el, {
        marginBottom: '32px'
      });
    } else {
      setElStyles(el, {});
    }
  }
}

export function getRootByElement(element) {
  let parent = element.parentNode;
  if (parent.parentNode) {
    parent = getRootByElement(parent);
  }
  return parent;
}