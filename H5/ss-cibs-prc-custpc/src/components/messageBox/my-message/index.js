/*
 * @Author: ZhangZhen
 * @Date: 2022-05-25 16:52:20
 * @LastEditTime: 2022-05-25 16:56:39
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\messageBox\my-message\index.js
 */
import Vue from 'vue';
import i18n from '@/i18n';
import MyMessage from './message.vue';

const Message = Vue.extend(MyMessage);

/**
 * 自定义消息提醒
 */
export default ({
  title = '',
  message = i18n.t('COMMON.CONTENT'),
  type = 'wran',
  delay = 1500,
  clickModal = true
}) => {
  const options = {
    title,
    message,
    type,
    delay,
    clickModal
  };

  return new Promise((resolve, reject) => {
    const vm = new Message({
      el: document.createElement('div')
    });
    document.body.appendChild(vm.$el);
    if (typeof text === 'string') {
      vm.text.message = options;
      vm.text.type = 'warn';
    }
    if (options instanceof Object) {
      vm.text = options;
    }
    vm.isShow = true;
    vm.timer = setTimeout(() => {
      vm.isShow = false;
    }, vm.text.delay);
    resolve('SUCCESS');
    reject();
  });
}
