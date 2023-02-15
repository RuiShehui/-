/*
 * @Author: ZhangZhen
 * @Date: 2022-01-28 09:20:07
 * @LastEditTime: 2022-01-28 09:28:02
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\i18n\instance.js
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import { getHead } from '@/utils/user';
import I18nConfig from './';

window.Vue = Vue;

const head = getHead();

const locale = head ? head.lang : 'lang';

const i18nIns = new VueI18n({
  ...I18nConfig,
  locale
});

ElementUI.i18n((key, value) => i18nIns.t(key, value));

export default i18nIns;
