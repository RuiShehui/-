/*
 * @Author: ZhangZhen
 * @Date: 2021-11-22 10:20:23
 * @LastEditTime: 2022-06-10 17:28:19
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * 隐藏不兼容的图标
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\directives\hide-icon.js
 */
export default {
  /**
   * inserted element
   * @param {HTMLElement} el current-element
   * @param {{ [key: string]: any; value: { bodyClass: string; removeTags: string[] }; }} binding binding-value-and-other-info
   */
  inserted(el, binding) {
    const { bodyClass, removeTags } = binding.value;

    const oBody = el.querySelector(`.${bodyClass}`);

    if (Array.isArray(removeTags) && removeTags.length) {
      removeTags.forEach(tag => {
        if (tag && tag.length) {
          const oTagList = oBody.getElementsByTagName(tag);
          Array.from(oTagList, (el) => {
            el.style.display = 'none';
          });
        }
      });
    }
  }
};
