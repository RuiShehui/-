/*
 * @Author: your name
 * @Date: 2022-06-03 18:02:33
 * @LastEditTime: 2022-09-05 20:28:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\twicLogin\index.js
 */
import Vue from 'vue';
import i18n from '@/i18n';
import tiwceLogin from './tiwceLogin.vue';

const tiwceLoginDialog = Vue.extend(tiwceLogin);

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
   console.log(options,'options')
  const _options = options || {};
  _options.title = options.title || '';
  _options.time = options.time || '';
  _options.dueTime = options.dueTime || '';
  _options.ip = options.ip || '';
  _options.tips = options.tips ||  '';
  _options.type = options.type || 'warn';
  _options.isCancle = options.isCancle || false;
  _options.btnText = options.btnText || {
    cancleText: i18n.t('COMMON.CANCEL'),
    confirmText: i18n.t('COMMON.DETERMINE')
  };
  _options.confirm = options.confirm || (() => { });
  _options.cancel = options.title || (() => { });

  const self = this;
  const container = document.createElement('div');
  container.className = 'confirm-wrapper';
  // const { confirm, cancel } = text;

  return new Promise((resolve, reject) => {
    
    const vm = new tiwceLoginDialog({
      el: container
    });
    document.body.appendChild(vm.$el);
    if (typeof text === 'string') {
      vm.text.message = _options
    }
    if (_options instanceof Object) {
      vm.text = _options
    }
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
