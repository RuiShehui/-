/*
 * @Author: ZhangZhen
 * @Date: 2022-06-09 11:04:38
 * @LastEditTime: 2022-06-10 17:14:47
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\plugins\src\show-modal\src\index.js
 */
import Modal from './modal.vue';
import Vue from 'vue';
import i18n from '@/i18n/instance';

/** 控制自动关闭的定时器 */
let t;

class CreateModal {
  /** @type {import('vue').default} current vm */
  vm;
  /** @type {{}} current options */
  options;
  /** @type {HTMLElement} root-el */
  root;

  constructor(options) {
    this.options = options;

    this.init();
  }

  init() {
    this.bindEvent();
  }

  bindEvent() {
    this._initRoot();
    this._removeNode();
    this._initVm();
    this._autoClose();
  }

  /** init modal root */
  _initRoot() {
    if (document.getElementById('modal')) {
      this.root = document.getElementById('modal');
      return;
    }

    this.root = document.createElement('div');
    this.root.id = 'modal';

    document.body.appendChild(this.root);
  }
  /** remove before node */
  _removeNode() {
    const prevNode = document.querySelector('.msg-box');

    console.log('prevNode', prevNode);

    if (prevNode) {
      setTimeout(() => {
        prevNode.parentNode.removeChild(prevNode);
      }, this.options.animationTime * 1.5);
    }
  }
  /** init-vm */
  _initVm() {

    // if (document.querySelector('.msg-box')) {
    //   return;
    // }

    const ModalCreator = Vue.extend(Modal);

    this.vm = new ModalCreator({
      data: {
        ...this.options,
      }
    }).$mount('#modal');
  }
  /** auto-close */
  _autoClose() {
    const { removeDelay, animationTime } = this.options;

    if (!removeDelay || typeof removeDelay !== 'number') {
      return;
    }

    t = setTimeout(() => {
      /** close vm */
      this.close({ animationTime });

      clearTimeout(t);
      t = null;
    }, removeDelay);
  }
  close(opts = {}) {

    const animationTime = opts.animationTime || 300;

    let _t = setTimeout(async () => {
      await this.vm.onCancel();
      this.vm.$destroy();

      this._removeNode();

      clearTimeout(_t);
      _t = null;
    }, animationTime * 1.5);
  }
}

export default (options = {}) => {

  const _options = typeof options === 'object' ? {
    title: options.title || '',
    content: options.content || 'This is a msgBox instance',
    confirm: options.confirm || (() => {}),
    cancel: options.cancel || (() => {}),
    confirmButtonText: options.confirmButtonText || i18n.t('COMMON.CONFIRM'),
    cancelButtonText: options.cancelButtonText || i18n.t('COMMON.CANCEL'),
    showCancelButton: options.showCancelButton || true,
    animationTime: options.animationTime || 500,
    removeDelay: options.removeDelay, // 自动关闭 (ms)
    closeByMask: options.hasOwnProperty('closeByMask') ? options.closeByMask : true,
  } : {
    title: '',
    content: options,
    confirmButtonText: i18n.t('COMMON.CONFIRM'),
    cancelButtonText: i18n.t('COMMON.CANCEL'),
  };

  return new CreateModal({
    ..._options,
  });
};

export {
  Modal,
}