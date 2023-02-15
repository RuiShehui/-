import axios from 'axios';
import router from '@/router';
import i18nIns from '@/i18n/instance';
import {
  ShowMessage,
  ShowModal
} from '@/plugins';
import {
  getHead,
  getToken
} from '@/utils/user';
import {
  BASE_REQUEST_URL
} from '@/configs/urls';
import store from '@/store';
import _ from 'lodash';

// function httpEvent(target, targetName, descriptor) {}

function showReturnErrorMessage(res) {
  const { head } = res.data;

  if (head) {
    const { returnCode = '000000', returnMessage = '' } = head;
    if (returnCode !== '000000') {
      /* async show */
      setTimeout(() => {
        ShowMessage({
          type: 'error',
          message: returnMessage ? returnMessage : 'Error'
        });
      }, 0);
    }
  }
}

/**
 * network-request-constructor
 */
class HttpModel {
  /** @type {import('axios').AxiosInstance} 当前请求实例 */
  _instance;
  // 判断loading的状态
  _loadingInstance = null;

  /**\
   * constructor request-init
   * @param { import('axios').AxiosRequestConfig } config
   */
  constructor(config) {
    const {
      baseURL = BASE_REQUEST_URL,
      timeout = 5000,
    } = config;
    // 动态请求head
    const head = getHead(),
      {
        lang = 'zhXG'
      } = head;
    this._instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json;',
        'lang': this._getLang(lang)
      },
      method: 'POST'
    });
  }
  /**
   * interuptors
   */
  _interuptor() {
    // this._loadingInstance = Loading.service({
    //   lock: true,
    //   background: 'rgba(255, 255, 255, 0.2)'
    // });
    this._instance.interceptors.request.use((config) => {
      if (config.showLoading !== false) {
        // 打开loading
        store.commit("loading/SET_LOADING", true);
      }
      // 每次获取实时更新的token
      config.headers.token = getToken();
      // 动态请求head
      const head = getHead(),
        {
          lang = 'zhXG'
        } = head;
      // 动态获取实时的语言
      config.params = {
        lang: this._getLang(lang),
      };

      // 判断是否携带token
      this.isTakeToken.call(this, config);
      // 动态赋值head
      // config.data.head = head;

      return config;
    }, err => Promise.reject(err));
    this._instance.interceptors.response.use((res) => {
      // 关闭loading
      store.commit("loading/SET_LOADING", false);
      const {
        head = {
          returnCode: '000000'
        }
      } = res.data, {
        returnCode,
        returnMessage,
      } = head;
      // 是否请求超时
      this.isOverTime(returnCode);
      // 是否请求失败
      if (returnCode !== '000000') {
        ShowMessage({
          message: `${returnMessage || 'Error'}`,
          type: 'error'
        });
        return {
          data: {
            head,
            body: false
          }
        };
      }
      // return result
      return res;
    }, err => Promise.reject(err));
    // this._loadingInstance.close();
  }

  /**
   * 是否携带token进行权限请求
   * @description 如果不是登录的接口, 都需要携带登录请求 | 如果没有token, 则直接返回登录页
   * @param {import('axios').AxiosRequestConfig} config
   * @return {void} _.debounce()
   */
  isTakeToken = (config) => {
    // config.url config.headers
    const { url, headers } = config;
    /** 请求url是否为空 */
    const urlIsEmpty = ['', '/'].includes(url);
    /** 是否为需要校验权限的请求url */
    const isPermissionUrl = !url.includes('login');

    const token = headers.token;
    const isLogin = (token && token.length) ? true : false;

    if (urlIsEmpty) {
      return;
    } else {
      if (isPermissionUrl && !isLogin) {
        ShowMessage({
          message: i18nIns.t('LOGIN.LACK_TOEKN_TIP'),
          type: 'error',
        });
        router.push({
          name: 'Login',
          query: {}
        });
      }
    }
  }
  /**
   * 请求是否超时
   * @description 如果请求超时(登录过期): 1.删除缓存 2.跳转回到登录页
   * @param {string} returnCode 返回码
   * @return {boolean} true -> 登录超时
   */
  isOverTime = _.debounce(function (returnCode) {
    if (['INMA050014', 'INMA050005'].includes(returnCode)) {
      ShowModal({
        content: i18nIns.t('LOGIN.LOGIN_OVERTIME_TIP'),
        removeDelay: 2000
      });
      _setLogout();
      return true;
    }
    return false;

    function _setLogout() {
      sessionStorage.clear();
      router.push({
        name: 'Login',
        query: {}
      });
    }
  }, 500)

  /**
   * 获取后端语言 getLang
   * @param {string} lang 前端语言
   * @return {string} newLang-后端语言
   */
  _getLang(lang) {
    switch (lang) {
      case 'zhCN':
        return 'zh_CN';
      case 'zhXG':
        return 'zh_HK'
      default:
        return 'en';
    }
  }

  /**
   * instance.request(config: AxiosRequestConfig)
   * @param { import('axios').AxiosRequestConfig } config
   */
  request(config) {
    this._interuptor();

    return new Promise((resolve, reject) => {
      this._instance({
          ...config,
          // data: qs.stringify(config.data || {})
        })
        .then(res => {
          showReturnErrorMessage(res);

          resolve(res.data);
        })
        .catch(err => {
          ShowMessage({
            type: 'error',
            message: `error: ${err}`
          });
          reject(err);
        });
    });
  }
}

const http = new HttpModel({
  /*
    baseURL: '/menu-manage',
    baseURL: '/liukewei',
    baseURL: '/cibs',
    baseURL: '/UAT',
  */
  baseURL: process.env.VUE_APP_AWEB_API,
  timeout: 60 * 1000,
});

export default http;
