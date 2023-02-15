/*
 * @Author: ZhangZhen
 * @Date: 2022-05-25 16:39:46
 * @LastEditTime: 2022-09-17 15:39:41
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\my-confirm\index.js
 */
import Vue from 'vue';
import i18n from '@/i18n';
import Confirm from './confirm.vue';

const ConfrimBox = Vue.extend(Confirm);

/**
 * 自定义模态确认框
 */
export default (options) => {
  /*
    {
      title: '',
      isIcon: true,
      type: 'wran',
      message: '内容',
      btnText: {
          cancleText: i18n.t('COMMON.CANCEL'),
          confirmText: i18n.t('COMMON.DETERMINE')
      },
      confirm: () => {},
      cancel: () => {}
    }
  */

  const _options = options || {};
  _options.title = options.title ||  i18n.t('COMMON.TIPS');
  _options.isIcon = options.isIcon || true;
  _options.type = options.type || 'warn';
  _options.isCancle = options.isCancle || false;
  _options.countDown = options.countDown || false;
  _options.btnText = options.btnText || {
    cancleText: i18n.t('COMMON.CANCEL'),
    confirmText: i18n.t('COMMON.DETERMINE')
  };
  _options.confirm = options.confirm || (() => {});
  _options.cancel = options.title || (() => {});

  const self = this;
  const container = document.createElement('div');
  container.className = 'confirm-wrapper';
  // const { confirm, cancel } = text;

  return new Promise((resolve, reject) => {
    const vm = new ConfrimBox({
      el: container
    });
    document.body.appendChild(vm.$el);
    if (typeof text === 'string') {
      vm.text.message = _options
    }
    if (_options instanceof Object) {
      vm.text = _options
    }
    console.log(vm, 'vmmmm')
    vm.isShow = true
    vm.onConfirm = () => {
      resolve();
      vm.isShow = false
    }
    vm.onCancel = () => {
      reject();
      vm.isShow = false
    }
  });
};