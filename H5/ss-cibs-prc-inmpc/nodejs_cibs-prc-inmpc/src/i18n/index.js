/*
 * @Autor: 朱涛
 * @Date: 2021-11-11 09:49:36
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-28 14:24:59
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\i18n\index.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */
import elEn from "element-ui/lib/locale/lang/en";
import elZhCN from "element-ui/lib/locale/lang/zh-CN";
import elZhXG from "element-ui/lib/locale/lang/zh-TW";
import zh_CN from "./config/zh-CN";
import en_ from "./config/en";
import zh_XG from "./config/zh-XG";
import raoEn from "./config/rao-en";
import raoZhCN from "./config/rao-CN";
import raoZhHK from "./config/rao-HK";

// TODO: 需要后台继续提供語言包
const messages = {
  en: {
    //这里同级可以编写自定义的英文库
    ...en_,
    ...elEn,
    ...raoEn
  },
  zhCN: {
    ...zh_CN,
    ...elZhCN,
    ...raoZhCN
  },
  zhXG: {
    ...zh_XG,
    ...elZhXG,
    ...raoZhHK
  },

};

// 通过选项创建 VueI18n 实例
const i18nConfig = {
  locale: 'zhXG', // 设置地区 (默认为英文) zhCN
  messages // 设置地区信息
};

// 通过 `i18n` 选项创建 Vue 实例
export default i18nConfig;
