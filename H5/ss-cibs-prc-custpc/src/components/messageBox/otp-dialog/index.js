/*
 * @Author: ZhangZhen
 * @Date: 2022-05-25 17:07:23
 * @LastEditTime: 2022-09-28 14:59:15
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\messageBox\otp-dialog\index.js
 */
import Vue from 'vue';
import i18n from '@/i18n';
import OtpDialog from './otp-dialog.vue';
import {
  sendOtp,
  validOtp
} from '@/api/sendOTP';
import { singleInstanceDecorate } from '../libs/utils';
import myMessage from '../my-message';
const OtpCheckBox = singleInstanceDecorate(Vue.extend(OtpDialog));

/**
 * 自定义短信验证框
 */
export default (options) => {
  const _options = options || {};

  _options.otpType = options.otpType || '';
  _options.custNo = options.custNo || '';
  _options.isSubmit = true;
  _options.btnValue = i18n.t('COMMON.GET_VR_CODE');
  _options.btnText = options.btnText || {
    cancleText: i18n.t('COMMON.CANCEL'),
    confirmText: i18n.t('COMMON.CONFIRM')
  };
  _options.otpVerfiy = i18n.t('SOFT_TOKEN.OTP')
  _options.otpCode = i18n.t('SOFT_TOKEN.OTP_CODE')
  _options.tocheck = i18n.t('SOFT_TOKEN.CHECK_INFORMATION')
  _options.tosms = i18n.t('SOFT_TOKEN.SEND_SMS')
  _options.fa = i18n.t('SOFT_TOKEN.FA')
  _options.smsCode = i18n.t('SOFT_TOKEN.SMS_CODE')
  // TODO
  _options.confirm = options.confirm || (() => { });
  // TODO
  _options.cancel = options.title || (() => { });
  _options.otpMode = options.otpMode || ''


  const container = document.createElement('div');
  container.className = 'confirm-wrapper';

  return new Promise((resolve, reject) => {

    const vm = OtpCheckBox.create({
      el: container
    });
    document.body.appendChild(vm.$el);
    if (typeof text === 'string') {
      vm.text.message = _options;
    }
    if (_options instanceof Object) {
      vm.text = _options;
    }
    console.log(vm, 'otp')
    let wait = 100;
    let interval = ''
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    let status = vm.text.otpMode
    console.log(status, 'statusssssss')
    let params = {}
    let random= ''
    // let radio = vm.text.radio
    vm.onConfirm = async () => {

      // 判断是否是 softToken首笔交易
      if (status == 'otp-st') {
        params = {
          custNo: vm.text.custNo,
          otpType: vm.text.otpType,
          otpMode: 'otp-st',
          refNum: vm.text.randomNum,
          flag: vm.text.flag,
          code: vm.text.otp
        }
      } else {
        params = {
          custNo: vm.text.custNo,
          otpType: vm.text.otpType,
          otpMode: 'otp',
          refNum: vm.text.randomNum,
          flag: vm.text.flag,
          code: vm.text.otp
        }
      }
      const result = await validOtp(params)
      console.log(vm.text.otpType, 'vm.text.otpType')
      // 判断是否是 softToken首笔交易
      if (result.body && status == 'otp-st') {
        sessionStorage.setItem('otpToken', result.body);
        wait = 0

        vm.isShow = false;
        window.clearInterval(interval);
        myMessage({
          type: 'success',
          message: i18n.t('SOFT_TOKEN.VERIFICATION_SUCCESSFUL'),
          delay: 3000
        })
        resolve();
      } else if (result.body) {
        sessionStorage.setItem('otpToken', result.body);
        wait = 0
        // userInfo.softTokenInfo.status = '5'
        // sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        vm.isShow = false;
        window.clearInterval(interval);
        myMessage({
          type: 'success',
          message: i18n.t('SOFT_TOKEN.VERIFICATION_SUCCESSFUL'),
          delay: 3000
        })
        resolve();
      }
      if (result.head.returnCode == "OTP000113") {
        window.clearInterval(interval);
        vm.isShow = false;
      }
    }

    vm.onCancel = () => {
      vm.isShow = false;
      wait = 0
      window.clearInterval(interval);
      reject();

    }

    vm.isShow = true;

    let flag = '0'
    vm.submit = () => {
      if (flag === '0') {
        // 判断是否是 softToken首笔交易
        if (status == 'otp-st') {
          params = {
            custNo: vm.text.custNo,
            otpType: vm.text.otpType,
            otpMode: 'otp-st',
            refNum: vm.text.randomNum,
            flag: vm.text.flag
          }
        } else {
          params = {
            custNo: vm.text.custNo,
            otpType: vm.text.otpType,
            otpMode: 'otp',
            refNum: vm.text.randomNum,
            flag: vm.text.flag
          }
        }
        flag = '1'
        // this.$emit('getOTP',params)
        sendOtp(params).then(res => {
          if (res.body) {
            vm.text.randomNum = res.body.refNum
            myMessage({
              type: 'success',
              message: i18n.t('SOFT_TOKEN.SEND_SCUSS'),
              delay: 3000
            })
          } else {
            myMessage({
              type: 'fail',
              message: i18n.t('SOFT_TOKEN.SEND_FAIL'),
              delay: 3000
            })
          }
        })

      } else {
        vm.text.randomNum =''
        // 判断是否是 softToken首笔交易
        if (status == 'otp-st') {
          params = {
            custNo: vm.text.custNo,
            otpType: vm.text.otpType,
            otpMode: 'otp-st',
            refNum: vm.text.randomNum,
            flag: vm.text.flag
          }
        } else {
          params = {
            custNo: vm.text.custNo,
            otpType: vm.text.otpType,
            otpMode: 'otp',
            refNum: vm.text.randomNum,
            flag: vm.text.flag
          }
        }

        // this.$emit('getOTP',params)
        sendOtp(params).then(res => {
          vm.text.randomNum = res.body.refNum
          if (res.body) {
            myMessage({
              type: 'success',
              message: i18n.t('SOFT_TOKEN.SEND_SCUSS'),
              delay: 3000
            })
          } else {
            myMessage({
              type: 'fail',
              message: i18n.t('SOFT_TOKEN.SEND_FAIL'),
              delay: 3000
            })
          }
        })
      }
      vm.text.isdisabled = true;
      interval = window.setInterval(() => {
        vm.text.btnValue = i18n.t('FIRST_LOGIN.GET_ANAIN', {
          time: wait
        });
        --wait;
        if (wait <= 0) {
          vm.text.btnValue = i18n.t('FIRST_LOGIN.SEND_AGNIN');
          // vm.text.randomNum = Math.random().toFixed(3).slice(-3)
          wait = 100;
          vm.text.isdisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    }
  });
};
