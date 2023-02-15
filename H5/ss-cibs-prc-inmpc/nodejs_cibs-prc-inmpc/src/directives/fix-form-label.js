/*
 * @Author: ZhangZhen
 * @Date: 2022-01-28 09:40:49
 * @LastEditTime: 2022-06-10 17:28:08
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * 修复表单对齐的样式
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\directives\fix-form-label.js
 */
import { setElStyles } from '@/utils/tools';

export default {
  bind(el) {
    const oLabel = el.querySelector('.el-form-item__label');
    if (oLabel) {
      setElStyles(el, {
        textAlign: 'right',
      });
      setElStyles(oLabel, {
        width: '120px',
      });
      // oLabel.style.width = 'auto';
      // console.log(el);
    }
  }
}