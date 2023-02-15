/*
 * @Author: ZhangZhen
 * @Date: 2022-05-25 17:20:00
 * @LastEditTime: 2022-09-16 17:31:36
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\messageBox\my-alert\index.js
 */
import Vue from 'vue';
import i18n from '@/i18n';
import Alert from './alert.vue';

const AlertBox = Vue.extend(Alert);

/**
 * 自定义告警框
 */
export default (text = {
  title:  i18n.t('COMMON.TISHI'),
  message: '内容',
  btnText: {
    confirmText: i18n.t('COMMON.DETERMINE')
  }
}) => {
  return new Promise((resolve, reject) => {
    const vm = new AlertBox({
      el: document.createElement('div')
    });
    document.body.appendChild(vm.$el);
    if (typeof text === 'string') {
      vm.text.message = text;
    }
    if (text instanceof Object) {
      vm.text = text;
    }
    vm.isShow = true;
    vm.onConfirm = function () {
      resolve();
      vm.isShow = false;
    }
    reject();
  });
}
