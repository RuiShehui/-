import axios from 'axios';
import {
  randomStr
} from '@/utils/common';
import DateUtils from "@/utils/date-utils";

import {
  getUser,
  getBranch,
  removeToken,
  removeUser,
  removeUserInfo
} from '@/utils/user';
import _ from 'lodash';
import router from '@/router';
import {
  myConfirm,
  otpDialog,
  tiwceLoginDialog,
  choosesWay
} from '@/components/messageBox';

import e2eeUtil from '@/utils/e2ee-util'
import i18n from '@/i18n';

import cancelToken from '@/utils/cancelAxios';
import AuthUrl from './authorizationSummary'
const {
  VUE_APP_AWEB_API
} = process.env;

/**
 * @description Token失效重新登录
 */
const reLogin = _.debounce((head = {
  returnMessage: 'invalid'
}) => {

  // NewMessage(head.returnMessage);
  logoutShowOnce(() => {
    myConfirm({
      title: i18n.t('COMMON.TIPS'),
      message: head.returnMessage,
      btnText: {
        confirmText: i18n.t('COMMON.DETERMINE')
      },
      isCancle: false
    })
  })

  removeToken();
  removeUser();
  removeUserInfo();
  backLogin();

}, 1000, {
  leading: true,
  trailing: false
});

const tiwceLogin = _.debounce(head => {
  let message = head.returnMessage.split('</br>')
  logoutShowOnce(() => {
    tiwceLoginDialog({
      title: i18n.t('COMMON.TIPS'),
      time: message[0],
      dueTime: message[1],
      ip: message[2],
      tips: message[3],
      btnText: {
        cancleText: i18n.t('COMMON.CANCEL'),
        confirmText: i18n.t('FIRST_LOGIN.LOGIN_AGIN')
      },
      isCancle: false
    }).then(() => {
      removeToken();
      removeUser();
      removeUserInfo();
      backLogin();
    }).catch(() => {
      removeToken();
      removeUser();
      removeUserInfo();
      backLogin();
    })
  })
})

function logoutShowOnce(callback) {
  if (sessionStorage.getItem('state')) {
    sessionStorage.setItem('state', false);
    callback && callback();
  }
}

function backLogin() {
  if (router) {
    router.replace({
      path: '/login'
    });
  }
}


/**
 * @description 个人网银公共参数拼接
 * @param {Object} params
 * @returns {Object}
 */
function buildParams(params = {}) {
  const date = new Date()
  if (params instanceof Array) {
    params = [...params]
  }
  const body = params
  delete body.reqTranCode
  // delete body.page
  // delete body.size
  delete body.pageId

  const head = {
    tranCode: params.reqTranCode || '' || '1', // 当前交易的交易码
    userNo: getUser() || '',
    custNo: '',
    orgCode: getBranch() || '',
    globalSeqNo: '',
    serviceUrl: '',
    requestNo: `${DateUtils.format(date, 'yyyyMMddhhhmmssS')}_${randomStr(14)}`, // 请求流水号
    tranDate: DateUtils.format(date, 'yyyyMMdd'), // 请求日期
    tranTime: DateUtils.format(date, 'hhmmssS'), // 请求时间
    channel: 'WEB', // 渠道
    serviceId: 'CIBS', // 系统ID
    fileFlag: '', //
    reserved: '',
    startNum: params.page || '', // 分页
    queryNum: params.size, // 请求条目
    totalNum: params.total || 0,
    programId: params.pageId || '', // 页面ID
    orgServerId: '',
    serverId: '',
    lastConsumerId: '',
    consumerId: '',
    oprType: '',
    roleId: '',
    token: sessionStorage.getItem('token') || '',
    otpToken: sessionStorage.getItem('otpToken'),
    tranToken: sessionStorage.getItem('tranToken')
    // lang || 'zh-CN'
  };


  localStorage.setItem('head', JSON.stringify(head));
  try {
    let paramsdata = {
      head,
      body,
      authReqInfo: params.authReqInfo
    }
    delete paramsdata.body.authReqInfo
    return paramsdata
  } catch (e) {
    return {
      head,
      body,
    }
  }
}

// axios 配置
axios.defaults.timeout = 60 * 1000;
axios.defaults.withCredentials = true;


axios.defaults.baseURL = VUE_APP_AWEB_API; // VUE_APP_AWEB_API

function setRequestLoading(requestLoading = false) {
  const store = require('@/store').default;
  store.commit('app/SET_LOADING', requestLoading);
}

//这里给每个接口统一加上token，并配置对应的请求头
axios.interceptors.request.use((config) => {
  setRequestLoading(true);

  const token = sessionStorage.getItem('token');
  const lang = localStorage.getItem('lang');
  const otpToken = sessionStorage.getItem('otpToken');
  const imgToken = sessionStorage.getItem('imgToken');
  const currentRoute = location.hash.split('#')[1];


  config.headers['X-Token'] = token;
  config.headers['Accept-Language'] = lang;
  config.headers['X-OTPToken'] = otpToken;

  if (config.url === "/file/upload") {
    delete config.headers['Content-Type'];
  } else if (config.method.toLocaleUpperCase() === 'POST') {
    config.data = buildParams(config.data); // 拼接个人网银公共请求参数
  }
  if (config.url == "/login") {
    cancelToken.removePending(config)
    cancelToken.addPending(config)
  }
  return new Promise(resolve => {
    // 白名单放行
    if (e2eeUtil.isWhiteList(config.url)) {
      return resolve(config);
    }
    // e2ee准备好
    if (e2eeUtil.ready()) {
      console.log(`axios request ==> url: ${config.url}`, `data: `, config.data)
      e2eeEncryptRequest(config);
      return resolve(config);
    }
    // e2ee没有准备好则等待
    let count = 0;
    const timer = setInterval(() => {
      count++;
      if (e2eeUtil.ready()) {
        clearInterval(timer);
        console.log(`axios request ==> url: ${config.url}`, `data: `, config.data)
        e2eeEncryptRequest(config);
        return resolve(config)
      } else if (count > 15) {
        clearInterval(timer);
        myConfirm({
          title: i18n.t('COMMON.TIPS'),
          message: i18n.t('COMMON.SERVICE_ONLOAD'),
          btnText: {
            confirmText: i18n.t('COMMON.DETERMINE')
          },
          isCancle: false
        }).then(() => {
          router.go(0);
        })
      }
    }, 1000)
  })
}, error => {
  // endLoading();zh
  return Promise.reject(error);
})

// ，这里是当token过期是，页面跳转到登录页
axios.interceptors.response.use(
  response => {
    setRequestLoading(false);
    // cancelToken.removePending(response.config)
    // 服务端秘钥错误，则不会加密，以明文方式返回错误报文,
    // 此时不用解密，response.data是object对象不是string
    if (response.config.encrypt && response.data && typeof response.data === 'string') {
      response.data = e2eeUtil.decrypt(response.data);
      if (response.headers['content-type'].includes('application/json')) {
        response.data = JSON.parse(response.data)
        console.log(`axios response <== url: ${response.config.url}`, response.data)
      }
    }
    if (response.data instanceof Blob) {
      return response.data;
    }
    // response.data = {
    //   head: { 'returnCode': 'GWE99999', 'returnMessage': 'xxxxxxxxxxxx'},
    //   body: {}
    // }

    const {
      head,
      body,
      authResultInfo = {},
    } = response.data
    if (head.returnCode === '000000') {
      return {
        success: true,
        head,
        body: authResultInfo && Object.getOwnPropertyNames(authResultInfo).length ? {
          authResultInfo,
          body
        } : body
      }
    } else if (response.config.skip) {
      return {
        success: false,
        head,
        body
      }
    } else {
      switch (head.returnCode) {
        case '100010':
          removeToken();
          removeUser();
          removeUserInfo();
          reLogin(head);
          break;
        case 'COC009977':
          // NewMessage(head.returnMessage);
          myConfirm({
            title: i18n.t('COMMON.TIPS'),
            message: head.returnMessage,
            btnText: {
              confirmText: i18n.t('COMMON.DETERMINE')
            },
            isCancle: false
          })
          break;
        case '100009':
          tiwceLogin(head)
          break;
        case "TIMEOUT":
          // timeout(head)
          break;
        case 'COC009970':
          // checkRepctTrans
          break;
        case 'OTP000107':
          break;
        case "GCG0100044":
          // NewMessage(head.returnMessage);
          myConfirm({
            title: i18n.t('COMMON.TIPS'),
            message: head.returnMessage,
            btnText: {
              confirmText: i18n.t('COMMON.DETERMINE')
            },
            isCancle: false
          })
          break;
        case "TCD020204":
          myConfirm({
            title: i18n.t('COMMON.TIPS'),
            message: head.returnMessage,
            btnText: {
              confirmText: i18n.t('COMMON.DETERMINE')
            },
            isCancle: false
          })
          break;
        case "GWE99999":
          myConfirm({
            title: i18n.t('COMMON.TIPS'),
            message: i18n.t('COMMON.SYSTEM_EXCEPTION'),
            btnText: {
              confirmText: i18n.t('COMMON.DETERMINE')
            },
            isCancle: false
          })
          break;
        default:
          // NewMessage(head.returnMessage);
          myConfirm({
            title: i18n.t('COMMON.TIPS'),
            message: head.returnMessage,
            btnText: {
              confirmText: i18n.t('COMMON.DETERMINE')
            },
            isCancle: false
          })
          break;
      }
      return {
        success: false,
        head,
        body
      }

    }

  },
  error => {
    setRequestLoading(false);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          removeToken()
          window.location.href = './'
          break
        default:
          if (error.response && error.response.data && error.response.data.head) {
            // NewMessage(error.response.data.head.returnMessage)
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              message: error.response.data.head.returnMessage,
              btnText: {
                confirmText: i18n.t('COMMON.DETERMINE')
              },
              isCancle: false
            })
          }
      }
    }
    // endLoading();
    return Promise.reject(error.response && error.response.data)
  }
);

function e2eeEncryptRequest(config) {
  if (e2eeUtil.enable()) {
    config.encrypt = true;
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    config.headers['E-EXCHANGE-ID'] = e2eeUtil.exchangeId();
    try {
      config.data = e2eeUtil.encrypt(JSON.stringify(config.data));
    } catch (e) {
      console.log(e)
      myConfirm({
        title: i18n.t('COMMON.TIPS'),
        message: i18n.t('COMMON.INITIALIZAITON'),
        btnText: {
          confirmText: i18n.t('COMMON.DETERMINE')
        },
        isCancle: false
      }).then(() => {
        window.location.reload()
      })
      throw e
    }
  }
}
window.axios = axios;

export default axios;
