/*
 * @Author: your name
 * @Date: 2021-11-29 09:22:04
 * @LastEditTime: 2022-05-06 10:34:03
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \webbank-pc\src\i18n\index.js
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
// 引入各个语言配置文件
import zh from './lang/zh';
import en from './lang/en';
import zhXG from './lang/zh-XG';
// Element-Langs
import elEn from 'element-ui/lib/locale/lang/en';
import elZh from './element-locale-override/zh';
import elZhXG from 'element-ui/lib/locale/lang/zh-TW';
const userCode = sessionStorage.getItem('userCode')
// 在未登录情况下进行初始化设置，解决登录后再次刷新页面，三语言变成浏览器设置语言的问题
if (userCode === null) {
  let webLang = navigator.language
  if (webLang === 'zh-TW' || webLang === 'zh-HK' ) {
    webLang = 'zh-HK'
    document.title = '創興個人網上銀行'
  }else if(webLang === 'zh-CN' || webLang === 'zh' ){
    webLang = 'zh-CN'
    document.title = '演示个人网上银行'
  }else if (webLang === 'en' || webLang === 'en-US' || webLang === 'en-UA') {
    webLang = 'en'
    document.title = 'Yan Shi Personal Internet Banking'
  }else {
    webLang = 'en'
    document.title = 'Yan Shi Personal Internet Banking'
  }
  localStorage.setItem('lang', webLang)
}
// 创建vue-i18n实例
const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'zh-CN', // 缓存语言标识
  // 添加多语言（每个语言标识对应一个语言文件）
  messages: {
    "zh-CN": {
      ...elZh,
      ...zh
    },
    'en': {
      ...elEn,
      ...en
    },
    "zh-HK": {
      ...elZhXG,
      ...zhXG
    }
  }
});

export default i18n;
