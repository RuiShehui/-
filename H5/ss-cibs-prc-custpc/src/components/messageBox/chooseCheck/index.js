/*
 * @Author: your name
 * @Date: 2022-06-13 09:58:38
 * @LastEditTime: 2022-08-27 16:33:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\chooseCheck\index.js
 */

import Vue from 'vue'
import i18n from '@/i18n';
import choosesWay from './choosesCheck.vue'
import { otpDialog,softToken } from '../index';
import myMessage from '../my-message';
import myConfirm from '../my-confirm';
import router from '@/router';
import { Message } from 'element-ui';
const chossesWay = Vue.extend(choosesWay)


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
  let custNo = sessionStorage.getItem('custNo');
  let menuId = localStorage.getItem('sliderMenusAct');
  let entType = localStorage.getItem('entType');
  const _options = options || {};
  _options.checkWay = options.checkWay || ''
  _options.tradeInfo = options.tradeInfo || ''

  _options.status = options.status || ''
  _options.btnText = options.btnText || {
    cancleText: i18n.t('COMMON.CANCEL'),
    confirmText: i18n.t('COMMON.CONFIRM')
  };
  _options.softTokenCode = options.softTokenCode || ''
  _options.confirm = options.confirm || (() => { });
  _options.cancel = options.title || (() => { });
  _options.verifyWay = i18n.t('SOFT_TOKEN.VERIFY_WAY')
  _options.optcerification = i18n.t('SOFT_TOKEN.OTP_CERTIFICATION')
  _options.mobileToken = i18n.t('SOFT_TOKEN.MOBILE_TOKEN')

  const self = this;
  const container = document.createElement('div');
  container.className = 'confirm-wrapper';
  // const { confirm, cancel } = text;

  return new Promise((resolve, reject) => {
    const vm = new chossesWay({
      el: container
    });
    document.body.appendChild(vm.$el);
    console.log(vm,'checkWay')
    if (typeof text === 'string') {
      vm.text.message = _options
    }
    if (_options instanceof Object) {
      vm.text = _options
    }
    let status = sessionStorage.getItem('softTokenStatus')
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo') ) 
    if(userInfo.tfaStatus == '0'){
      myConfirm({
        title: i18n.t('COMMON.TIPS'),
        message: i18n.t('MOBILE_TOKEN.OPEN_SOFTTOKEN'),
        btnText: {
          confirmText: i18n.t('COMMON.DETERMINE')
        },
        isCancle: false
      }).then(()=>{
        router.replace('/home')
        vm.isShow = false
      })
    }else{
      vm.isShow = true
    }
   
    console.log(vm,'fge')
    vm.onConfirm = () => {
    
      
      // this.$router.push('/login')
      if(vm.text.checkWay == '1'){
        vm.isShow =false
        otpDialog({
          otpType:menuId,
          custNo:custNo,
          otpMode:'otp',
          flag:vm.text.flag
        }).then(()=>{
          resolve();
        })
      }else if(vm.text.checkWay == '2'){
        vm.isShow =false
        softToken({
          softTokenCode:vm.text.softTokenCode,
          otpType:menuId,
          tradeInfo:vm.text.tradeInfo,
          status: vm.text.status
        }).then(()=>{
          resolve();
        })
      }else{
        myMessage({
          type: 'fail',
          message: i18n.t('AUTHORIZE.SELECT_WAY'),
          delay: 3000
        })
      }
      // vm.isShow = false
    }
    vm.onCancel = () => {
      vm.isShow = false
      reject();
      // 
    }
  });
};