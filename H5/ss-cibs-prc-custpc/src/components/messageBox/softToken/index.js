/*
 * @Author: your name
 * @Date: 2022-06-01 10:50:04
 * @LastEditTime: 2022-11-17 09:28:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\softToken\index.js
 */

import Vue from 'vue';
import i18n from '@/i18n';
import softToken from './softToken.vue';
import { otpDialog } from '../index';
import {
  sendOtp,
  validOtp,
  cancelTradeInfo
} from '@/api/sendOTP';
import { softTokenInfo } from '@/api/public.js'
import myMessage from '../my-message';
import myConfirm from '../my-confirm';
import _ from 'lodash';
import router from '@/router';
const softTokenBox = Vue.extend(softToken);

let interval = ''
let waits = 100;

function timer(vm) {
  vm.text.isdisabled = true;

  interval = window.setInterval(() => {
    --waits;
    vm.text.btnText.confirmText = `${waits}S${i18n.t('COMMON.DETERMINE')}`;
    console.log(waits, 'waits')
    if (waits == 0) {
      vm.text.btnText.confirmText = i18n.t('FIRST_LOGIN.SEND_AGNIN');
      console.log(waits, '第二个waitss')
      window.clearInterval(interval);
    }
  }, 1000);
}
/**
 * 自定义模态确认框
 */
export default (options) => {
  
  const _options = options || {};
  _options.softTokenCode = options.softTokenCode
  _options.tradeInfo = options.tradeInfo || {}

  _options.btnText = options.btnText || {
    cancleText: i18n.t('COMMON.CANCEL'),
    confirmText: i18n.t('COMMON.DETERMINE')
  };
  _options.confirm = options.confirm || (() => { });

  _options.verify = i18n.t('SOFT_TOKEN.VERIFY')
  _options.needSoftToken = i18n.t('SOFT_TOKEN.NEED_SOFTTOKEN')
  _options.changeCode = i18n.t('SOFT_TOKEN.CHANG_CODE')
  _options.safeCode = i18n.t('SOFT_TOKEN.SAFE_CODE')
  _options.stepone = i18n.t('SOFT_TOKEN.STEP_ONE')
  _options.steptwo = i18n.t('SOFT_TOKEN.SETP_TWO')
  _options.stepthree = i18n.t('SOFT_TOKEN.STEP_THREE')
  _options.stepfour = i18n.t('SOFT_TOKEN.STEP_FOUR')
  _options.stcode = i18n.t('SOFT_TOKEN.PLEASE_ENTER_SAFE_CODE')
  const self = this;
  // 新建div
  const container = document.createElement('div');
  container.className = 'confirm-wrapper';

  return new Promise((resolve, reject) => {
    // 创建 softTokenBox
    const vm = new softTokenBox({
      el: container
    });

    let randomNum = vm.text.randomNum || ''
    let randomNums = ''
    // 挂载到元素上
    document.body.appendChild(vm.$el);
    if (typeof text === 'string') {
      vm.text.message = _options
    }

    if (_options instanceof Object) {
      vm.text = _options
    }
    timer(vm)
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    let tfaStatus = userInfo.tfaStatus
    let userType = userInfo.userType
    let radio = vm.text.radio
    //  vm.text.txId = ''
    let paramss = {}
    if (tfaStatus == '0'&&userType!=='3') {
      myConfirm({
        title: i18n.t('USER_COMMON.TIPS'),
        message: i18n.t('SOFT_TOKEN.PLEASE_OPEN'),
        btnText: {
          confirmText: i18n.t('COMMON.CONFIRM'),
        },
        isCancle: false
      }).then(() => {
        // router.replace('/home')
      })
    } else {
      // 存在已登录后核身通过，所以此处实时查询状态
      softTokenInfo({ custNo: userInfo.custNo, userCode: userInfo.userCode }).then(res => {
        let status = res.status
        paramss = {
          otpType: vm.text.otpType,
          custNo: sessionStorage.getItem('custNo'),
          otpMode: 'st',
          challenge: randomNum,
          tradeInfo: vm.text.tradeInfo,
        };
        switch (status) {
          case 'N':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              message: i18n.t('MOBILE_TOKEN.REGISTER_SOFTTOKEN'),
              btnText: {
                confirmText: i18n.t('COMMON.CONFIRM'),
              },
              isCancle: false
            }).then(() => {
              window.clearInterval(interval);
            })
            break;
          case '0':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              message: i18n.t('MOBILE_TOKEN.REGISTER_SOFTTOKEN'),
              btnText: {
                confirmText: i18n.t('COMMON.CONFIRM'),
              },
              isCancle: false
            }).then(() => {
              window.clearInterval(interval);
            })
            break;
          case '1':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              message: i18n.t('MOBILE_TOKEN.REGISTER_SOFTTOKEN'),
              btnText: {
                confirmText: i18n.t('COMMON.CONFIRM'),
              },
              isCancle: false
            }).then(() => {
              window.clearInterval(interval);
            })
            break;
          case '2':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              message: i18n.t('MOBILE_TOKEN.REGISTER_SOFTTOKEN'),
              btnText: {
                confirmText: i18n.t('COMMON.CONFIRM'),
              },
              isCancle: false
            }).then(() => {
              window.clearInterval(interval);
            })

            break;
          case '3':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              message: i18n.t('MOBILE_TOKEN.CALL_CUNSTOMER_SERVICE'),
              btnText: {
                confirmText: i18n.t('COMMON.CONFIRM'),
              },
              isCancle: false
            }).then(() => {
              window.clearInterval(interval);
            })

            break;
          case '4':
            window.clearInterval(interval);
            otpDialog({
              otpType: vm.text.otpType,
              custNo: sessionStorage.getItem('custNo'),
              otpMode: 'otp-st',
              status: vm.text.status || '',
              radio: vm.text.radio

            }).then(() => {
              vm.isShow = true
              waits = 100
              timer(vm)
              sendOtp(paramss).then(result => {
                vm.text.txId = result.body.txId
                if (result.body) {
                  myMessage({
                    type: 'success',
                    message: i18n.t('MOBILE_TOKEN.CHECK_SOFTTOKEN'),
                    delay: 3000
                  })
                }
              })
            })
            break;
          case '5':
            vm.isShow = true
            sendOtp(paramss).then(result => {
              vm.text.txId = result.body.txId
              console.log(vm.text.txId, 'txId');
              if (result.body && userInfo.entType == '2') {
                myMessage({
                  type: 'success',
                  message: i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: i18n.t('SOFT_TOKEN.SAFE_CODE')
                  }),
                  delay: 3000
                })
              } else {
                myMessage({
                  type: 'success',
                  message: i18n.t('SOFT_TOKEN.CHANLLENGE_CODE'),
                  delay: 3000
                })
              }
            })
            break;
        } // switch
      }); // softTokenInfo().then
    }
    let params = {}
    vm.onConfirm = () => {
      if (waits == 0) {
        vm.randomNum = Math.random().toFixed(6).slice(-6)
        randomNums = vm.randomNum
        console.log(randomNum, 'vm')
        paramss.challenge = randomNums
        vm.text.btnText.confirmText = i18n.t('COMMON.DETERMINE');
        window.clearInterval(interval);
        waits = 100
        timer(vm)
        sendOtp(paramss).then(result => {
          console.log(result, 'result');
          vm.text.txId = result.body.txId
          if (result.body && userInfo.entType == '2') {
            myMessage({
              type: 'success',
              message: i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: i18n.t('SOFT_TOKEN.SAFE_CODE')
              }),
              delay: 3000
            })
          } else {
            myMessage({
              type: 'success',
              message: i18n.t('SOFT_TOKEN.CHANLLENGE_CODE'),
              delay: 3000
            })
          }
        })
      } else {
        console.log(vm.text.txId, 'randomNumssssss')
        params = {
          otpType: vm.text.otpType,
          custNo: sessionStorage.getItem('custNo'),
          code: vm.text.softTokenCode,
          challenge: randomNums ? randomNums : randomNum,
          otpMode: 'st',
          tradeInfo: vm.text.tradeInfo,
          txId: vm.text.txId
        }
        validOtp(params).then(res => {
          if (res.body) {
            waits = 100
            window.clearInterval(interval);
            sessionStorage.setItem('otpToken', res.body);
            userInfo.softTokenInfo.status = res.head.softtokenStatus
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            vm.isShow = false;
            myMessage({
              type: 'success',
              message: i18n.t('COMMON.TRANSACTION_SUCCESS'),
              delay: 3000
            })
            resolve();
          }
        }).catch(err => {
          console.log(err)
        })
      }

    }
    let userCode = userInfo.userCode,
      custNo = userInfo.custNo;


    vm.onCancel = () => {
      let cancel = {
        txId: vm.text.txId,
        userCode: userCode,
        custNo: custNo
      }
      cancelTradeInfo(cancel).then(res => {
        vm.isShow = false
        waits = 100
        window.clearInterval(interval);
        reject();

      })
      waits = 100
      window.clearInterval(interval);
    }
  });

};
