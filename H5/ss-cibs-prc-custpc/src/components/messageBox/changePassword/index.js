/*
 * @Author: ZhangZhen
 * @Date: 2022-05-25 16:39:46
 * @LastEditTime: 2022-09-05 14:20:54
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\messageBox\my-confirm\index.js
 */
import Vue from 'vue';
import i18n from '@/i18n';
import changPass from './changePassword.vue';
import {modifyPwdNoticeDate} from "@/api/public"
const changePassword = Vue.extend(changPass);

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
  _options.title = options.title || '';
  _options.isIcon = options.isIcon || true;
  _options.type = options.type || 'warn';
  _options.isCancle = options.isCancle || false;
  _options.tipsMe = options.tipsMe || false;
  _options.message =i18n.t('HOME.PASSWORD_IMMEDIATELY'),
  _options.remindme= i18n.t('HOME.REMIND_ME')
  _options.btnText = options.btnText || {
    cancleText: i18n.t('COMMON.CANCEL'),
    confirmText: i18n.t('COMMON.DETERMINE')
  };
  
  _options.confirm = options.confirm || (() => { });
  _options.cancel = options.cancel || (() => { });

  const self = this;
  const container = document.createElement('div');
  container.className = 'confirm-wrapper';
  // const { confirm, cancel } = text;

  return new Promise((resolve, reject) => {
    const vm = new changePassword({
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
      // this.$router.push('/login')
      vm.isShow = false
    }
    vm.onCancel = () => {
      console.log(vm.text.tipsMe,'tipssssss')
      if(vm.text.tipsMe){
        modifyPwdNoticeDate().then(res=>{
          if(res){
            vm.isShow = false
            sessionStorage.setItem('needPwdModify',"false")
          }
        })
      }else{
        vm.isShow = false
        sessionStorage.setItem('needPwdModify',"false")
      }
      reject();
      // vm.isShow = false
    }
  });
};
