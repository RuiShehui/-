import {
  safeGetLocalStorage,
  safeSetLocalStorage
} from '@/utils';
import cloneDeep from 'clone-deep';
import {
  myConfirm,
  myAlert,
  myMessage
} from '@/components/messageBox';
import {
  setUser,
  setToken,
  getImgToken,
  setImgToken,
  setNeedUpdatePassword
} from '@/utils/user';
import {
  login,
  verifyImg,
  loginValid
} from '@/api/login';
import router from '@/router';
import {
  queryMenuList,
  findShortcutMenuDetail,
  findBankNoticeInfoList
} from '@/api/home.js';
import i18n from '@/i18n';

// 登录状态 TODO 登录反回信息后台配置（报错信息）统一处理
const LOGON_STATE_ENUMS = {
  NORMAL_FIRST_LOGON_STATES: ['LOGON_FIRST', 'RESET_PWD'], // 普通用户首次登录
  ADMIN_FIRST_LOGON_STATES: ['LOGON_FIRST', 'RESET_PWD'], // 管理员用户首次登录
  NEED_CERT: ['NEED_CERT'], //需要验证HKDID
  OVER_30_DAYS_BANNED: ['ADMIN_FIRST_PAUSE'], // 超过30天停用
  ERROR_PAUSE: ['ADMIN_FIRST_PWD_ERROVER_30_DAYS_BANNEDOR_PAUSE'], // 输入错误，停用
  SUCCESS: ['SUCCESS'],
  RESET_PWD:['RESET_PWD']  //重置密码首次登录
};

// 设置token
function SET_TOKEN(state, token = '') {
  // safeSetLocalStorage('token', token);
  state.token = token;

  setToken(token);
}
// 获取TOKEN
function GET_TOKEN(state, token = '') {
  state.token = token
  console.log(state, '11111')
}
// 设置用户菜单数据
function setUserMenus(state, menus = []) {

  safeSetLocalStorage('userMenus', menus); // 顶部导航可以从storage取数据
  // 菜单排序
  // menus 被冻结, home.getters selectedFuncs 监听不到
  state.userMenus = cloneDeep(menus); // 设置快捷菜单时更改vuex中的menu
}
// 设置用户菜单选中
function setUserMenusAct(state, userMenusAct = '') {
  safeSetLocalStorage('userMenusAct', userMenusAct);
  state.userMenusAct = userMenusAct;
}
// 设置用户侧边菜单栏
function setSliderMenus(state, menus = []) {
  safeSetLocalStorage('sliderMenus', menus);
  state.sliderMenus = menus;
}
// 设置侧边菜单栏选中
function setSliderMenusAct(state, sliderMenusAct = '') {
  safeSetLocalStorage('sliderMenusAct', sliderMenusAct);
  state.sliderMenusAct = sliderMenusAct;
}
// 设置面包屑列表
function setBreadcrumb(state, breadcrumb = []) {
  safeSetLocalStorage('breadcrumb', breadcrumb);
  state.breadcrumb = breadcrumb;
}
//设置用户登录信息
function setUserInfo(state, userInfo = []) {
  safeSetLocalStorage('userInfo', userInfo);
  state.userInfo = userInfo;
}

//设置语言信息
function setLang(state, obj={lang:'zh-CN', cover:false}) {
  let lang = obj.lang
  if (!navigator.language) {
    lang = navigator.language
  }
  if (!obj.cover && localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang')
  }
  safeSetLocalStorage('lang', lang);
  state.lang = lang;
}

/**
 * 获取菜单列表
 * @return {{ id: number; name: string; path: string; path: string; pitchStatus: 0, children: [] }[]} targetMenus
 */
async function getMenus() {
  try {
    // 查询菜单
    const result = await queryMenuList();
    // 获取快捷菜单
    const details = await findShortcutMenuDetail();
    // "账户概览", "本地跨行转账", "货币兑换", "开立定期存款", "批量转账交易录入"
    const menuCodeList = details ? JSON.parse(details.menuCode || '[]') : ['0201', '030102', '050102', '0402', '030104'];
    //先行前端修改查询服务菜单的问题
    // 全部菜单
    let userMenusAll = []
    result.sort((a, b) => {
      return Number(a.seq) - Number(b.seq)
    });
    result.forEach((item, index) => {
      userMenusAll.push({
        ...item,
        id: item.menuCode || `aa${index}`,
        name: item.menuName || `bb${index}`,
        path: item.pacPath || 'path',
        pitchStatus: menuCodeList.includes(item.menuCode) ? '1' : '0',
        pmenuCode: item.pmenuCode ? item.pmenuCode : item.menuCode.length === 2 ? '' : item.menuCode.substr(0, item.menuCode.length - 2),
      })
    });
    await safeSetLocalStorage('userMenusAll', userMenusAll);

    const menuList = [];
    result.reduce((list, item1, index1) => {

      if (item1.menuClazz !== '9') {
        if (list.every(item2 => item1.menuCode !== item2.menuCode)) {
          let icon = '';
          try {
            icon = require(`@/images/menu/${item1.menuCode}.png`);
          } catch (e) {
            icon = '';
          }
          list.push({
            ...item1,
            id: item1.menuCode || `aa${index1}`,
            name: item1.menuName || `bb${index1}`,
            path: item1.pacPath || 'path',
            pitchStatus: menuCodeList.includes(item1.menuCode) ? '1' : '0',
            pmenuCode: item1.pmenuCode ? item1.pmenuCode : item1.menuCode.length === 2 ? '' : item1.menuCode.substr(0, item1.menuCode.length - 2),
            icon
          });
        }
      }

      return list;
    }, menuList);
    let quickMenu = {
      ...details,
      menuCode: menuList.filter(x => x.pitchStatus === '1')
    }
    const tarList = formatTreeData(menuList, 'menuCode', 'pmenuCode');
    return {
      tarList,
      quickMenu: quickMenu || []
    };
  } catch (err) {
    console.error('获取菜单报错了', err);
  }

  function formatTreeData(list, id = 'id', pid = 'pid') {
    // delete before children
    list.forEach((item) => {
      delete item.children;
    });

    const map = {};

    list.forEach(item => {
      map[item[id]] = item;
    });

    const targetList = [];

    list.forEach(item => {
      const parent = map[item[pid]];

      if (parent) {
        if (parent.children) {
          parent.children.push(item);
        } else {
          parent.children = [item];
        }
      } else {
        targetList.push(item);
      }
    });
    return targetList;
  }

}

/**
 * 更改userMenus中对应菜单的pitchStatus值
 */
function setPitchStatus(state, id) {
  function change(menu) {
    let flag = menu.id === id;

    // 匹配到对应的menu时，切换值
    if (flag) {
      menu.pitchStatus = menu.pitchStatus === '0' ? '1' : '0';
    } else {
      // console.log("menu :>> ", menu);
      menu.children && menu.children.length && menu.children.forEach(change);
    }
  }

  state.quickMenu.forEach(change);
}

export default {
  namespaced: true, // 模块化局部命名
  state: {
    lang: safeGetLocalStorage('lang'), // 系统语言
    requestLoading: false, //是否需要loading
    loginTimeOutVisible: false, // 登录超时提示modal显示
    token: '', // token
    userMenus: safeGetLocalStorage('userMenus', []),
    // 菜单列表
    userMenusAct: safeGetLocalStorage('userMenusAct', ''), // 菜单选中
    sliderMenus: safeGetLocalStorage('sliderMenus', [{}]), // 侧边栏菜单
    sliderMenusAct: safeGetLocalStorage('sliderMenusAct', '01'), // 侧边栏选中
    quickDomain: safeGetLocalStorage('quickDomain', [{}]), // 快捷功能
    quickMenu: safeGetLocalStorage('quickMenu', ''), // 快捷菜单
    quickMenuId: safeGetLocalStorage('quickMenuId', ''), // 快捷菜单id
    breadcrumb: safeGetLocalStorage('breadcrumb', ''), // 面包屑列表
    userInfo: safeGetLocalStorage('userInfo', ''), // 用户登录信息
    imageStr: '',
    imgToken: getImgToken(),
    status: false,
    noticeList: []
  },

  mutations: {
    SET_LANG: setLang,
    SET_LOADING(state, requestLoading) {
      state.requestLoading = requestLoading;
    },
    setLoginTimeOutVisible(state, boolean) {
      state.loginTimeOutVisible = boolean;
    },
    SET_IMAGESTR(state, imageStr) {
      state.imageStr = imageStr
    },
    SET_VERFYIMG(state, boolean) {
      state.status = boolean
    },
    SET_NOTICE(state, records) {
      state.noticeList = records
    },
    SET_TOKEN,
    GET_TOKEN,
    setUserMenus,
    setUserMenusAct,
    setSliderMenus,
    setSliderMenusAct,
    setBreadcrumb,
    setUserInfo,
    setPitchStatus,
    setQuickMenu(state, menu = []) {
      safeSetLocalStorage('quickMenu', menu)
      state.quickMenu = menu
    },
    setQuickMenuId(state, id = '') {
      safeSetLocalStorage('quickMenuId', id)
      state.quickMenuId = id
    },
    setQuickDomain(state, menu = []) {
      console.log("state.quickDomain", menu);
      safeSetLocalStorage('quickDomain', menu)
      state.quickDomain = menu
    },

    /** 设置二维码图片的TOKEN */
    SET_IMG_TOKEN(state, imgToken) {
      state.imgToken = imgToken;
      setImgToken(imgToken); 
    }
  },

  actions: {
    SET_LANG(ctx, lang) {
      ctx.commit('SET_LANG', lang);
    },
    ['SET_TOKEN'](ctx, token) {
      ctx.commit('SET_TOKEN', token);
    },
    async getUserMenus(ctx, Vue) {
      let getMenusObj = await getMenus();
      console.log("getMenusObj", getMenusObj);
      ctx.commit('setUserMenus', getMenusObj.tarList);
      ctx.commit('setQuickDomain', getMenusObj.quickMenu.menuCode); // 快捷菜单
      ctx.commit('setQuickMenu', getMenusObj.tarList); // 快捷菜单
      ctx.commit('setQuickMenuId', getMenusObj.quickMenu.smId); // 快捷菜单id
      router.replace('/home');
    },
    /** 用户登录的action */
    async USER_LOGON({
      commit,
      dispatch
    }, loginParams) {
      try {
        const logonResult = await login(loginParams),

          result = logonResult ? logonResult : {
            logonState: ''
          },
          {
            logonState
          } = result;

        const composeParams = Object.assign({}, loginParams, logonResult);
        // 判断用户登录是否需要验证码
        if (!logonResult) {
          commit('SET_VERFYIMG', true)
          getVerifyImg()
          return
        }
        // 判断普通用户是否是首次登录
        if (LOGON_STATE_ENUMS.NORMAL_FIRST_LOGON_STATES.includes(logonState)) {
          handleNormalFirstLogon(commit, composeParams);
          return;
        }
        // 判断管理员用户是否是首次登录
        if (LOGON_STATE_ENUMS.ADMIN_FIRST_LOGON_STATES.includes(logonState)) {
          handleAdminFirstLogin(commit, composeParams);
        }
        // 是否需要校验HKID
        if (LOGON_STATE_ENUMS.NEED_CERT.includes(logonState)) {
          handleNeedCret(commit, composeParams)
        }
        // 是否30天未登录
        if (LOGON_STATE_ENUMS.OVER_30_DAYS_BANNED.includes(logonState)) {
          handleOver30DaysBanned();
        }
        // 是否用户停用
        if (LOGON_STATE_ENUMS.ERROR_PAUSE.includes(logonState)) {
          handleAdminErrorPause();
        }
        // 用户登录成功 
        if (LOGON_STATE_ENUMS.SUCCESS.includes(logonState)) {
          handleLogonSuccess.apply(this, [commit, composeParams, dispatch]);
        }
      } catch (err) {
        console.error(err);
      }
      /**
       * 普通用户首次登录
       */
      async function handleNormalFirstLogon(commit, {
        userName,
        logonState
      }) {
        console.log(logonState, 'state')
        switch (logonState) {
          // 首次登录
          case 'LOGON_FIRST':
            await myConfirm({
              title: i18n.t('COMMON.TIPS'),
              isIcon: false,
              type: '',
              message: i18n.t('FIRST_LOGIN.REMINDER_CONTENT'),
              btnText: {
                cancleText: i18n.t('COMMON.CANCEL'),
                confirmText: i18n.t('COMMON.CONFIRM')
              },
              isCancle: false
            }).then(() => {
              sessionStorage.setItem('userName', userName);
            })
            router.push('/login/firstLogin');
            break;
            // 重置密码首次登录
          case 'RESET_PWD':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              isIcon: false,
              type: '',
              message: i18n.t('FIRST_LOGIN.ASSWORD_HAS_BEEN_RESET'),
              btnText: {
                cancleText: i18n.t('COMMON.CANCEL'),
                confirmText: i18n.t('COMMON.CONFIRM')
              },
              isCancle: true
            }).then(() => {
              sessionStorage.setItem('userName', userName);
              sessionStorage.setItem('resetLogin','RESET_PWD')
              router.push('/login/firstLogin')
            })
            break;
        }
      }
      /**
       * 管理员用户首次登录
       */
      async function handleAdminFirstLogin(commit, {
        userName,
        logonState
      }) {
        switch (logonState) {
          // 普通首次登录
          case 'LOGON_FIRST':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              isIcon: false,
              type: '',
              message: i18n.t('FIRST_LOGIN.REMINDER_CONTENT'),
              btnText: {
                cancleText: i18n.t('COMMON.CANCEL'),
                confirmText: i18n.t('COMMON.CONFIRM')
              },
              isCancle: false
            }).then(() => {
              sessionStorage.setItem('userName', userName);
              sessionStorage.setItem('firstLogin', 'LOGON_FIRST');
              router.push('/login/firstLogin')
            })
            break;
            // 重置密码首次登录
          case 'RESET_PWD':
            myConfirm({
              title: i18n.t('COMMON.TIPS'),
              isIcon: false,
              type: '',
              message: i18n.t('FIRST_LOGIN.PASSWORD_HAS_BEEN_RESET'),
              btnText: {
                cancleText: i18n.t('COMMON.CANCEL'),
                message: i18n.t('FIRST_LOGIN.TO_VERIFY'),
              },
              isCancle: true
            }).then(() => {
              sessionStorage.setItem('userName', userName);
              sessionStorage.setItem('resetLogin', 'RESET_PWD');
              router.push('/login/firstLogin');
            })

            break;
        }
        // setUser(params.userName);

      }
      /**
       * 超过30天未登录, 账号被停用
       */
      async function handleOver30DaysBanned() {
        await myConfirm({
          title: i18n.t('COMMON.TIPS'),
          isIcon: false,
          // type: '',
          message: i18n.t('FIRST_LOGIN.SYS_ADMIN_THIRTY'),
          btnText: {
            cancleText: i18n.t('COMMON.CANCEL'),
            message: i18n.t('FIRST_LOGIN.CONFIRM'),
          },
          isCancle: false
        });
      }
      /**
       * 输入密码错误次数超过限定错误次数
       */
      async function handleAdminErrorPause() {
        myConfirm({
          title: i18n.t('COMMON.TIPS'),
          isIcon: false,
          type: '',
          message: i18n.t('FIRST_LOGIN.OUT_OF_SERVICE'),
          btnText: {
            cancleText: i18n.t('COMMON.CANCEL'),
            message: i18n.t('FIRST_LOGIN.CONFIRM'),
          },
          isCancle: false
        });
      }
      /**
       * 登录成功
       */
      function handleLogonSuccess(commit, params, dispatch) {
        console.log(params.userInfo.custNo, 'params.userInfo.custNo');

        setUser(params.userName);
        sessionStorage.setItem('token', params.token)
        sessionStorage.setItem('time', params.logonTime)
        sessionStorage.setItem('logonState', params.logonState)
        sessionStorage.setItem('adminEmpower', params.userInfo.adminEmpower)
        sessionStorage.setItem('custNo', params.userInfo.custNo)
        sessionStorage.setItem('userInfo', JSON.stringify(params.userInfo))
        sessionStorage.setItem('needPwdModify', params.needPwdModify)
        // setNeedUpdatePassword('Y')
        sessionStorage.setItem('state', true)

        // debugger
        // 获取菜单
        dispatch('getUserMenus');

      }
      // 验证HKDID
      function handleNeedCret(commit, params, dispatch) {
        console.log(params.needPwdModify,'params.needPwdModify')
        setUser(params.userName);
        sessionStorage.setItem('custNo', params.userInfo.custNo)
        sessionStorage.setItem('userInfo', JSON.stringify(params.userInfo))
        sessionStorage.setItem('hkidflow', params.hkidInfo.hkidflow)
        sessionStorage.setItem('maskedID', params.hkidInfo.maskedIndex)
        sessionStorage.setItem('needPwdModify', params.needPwdModify)

        router.push('/login/checkHKDID');
      }
      //验证码
      function getVerifyImg() {
        verifyImg().then(res => {
          commit('SET_IMAGESTR', res.imageStr);
          commit('SET_IMG_TOKEN', res.imageToken);
        });
      }
    },
    // 用户验证码校验是否正确
    async SET_IMG_TOKEN({
      commit
    }, imgToken) {
      commit('SET_IMG_TOKEN', imgToken);
    },
    async SET_VALIDATE({
      commit
    }, userName) {
      try {

        const state = await loginValid(userName)
        console.log(state, 'state')
        if (state.state) {
          commit('SET_VERFYIMG', true)
          verifyImg().then(res => {
            commit('SET_IMAGESTR', res.imageStr);
            commit('SET_IMG_TOKEN', res.imageToken);
          });
        } else {
          commit('SET_VERFYIMG', false)
        }
      } catch (err) {
        console.error(err);
      }
    },
    async SET_LOADING({
      commit
    }, requestLoading = false) {
      commit('SET_LOADING', requestLoading);
    },

    // // 银行公告
    async NOTICEINFOLIST({
      commit,
      dispatch
    }, noticeParams) {
      try {
        const notice = await findBankNoticeInfoList(noticeParams)
        commit('SET_NOTICE', notice.records)
      } catch (err) {
        console.error(err);
      }
    }
  },

  getters: {
    getLang(state) {
      return state.lang;
    },
    getLoginTimeOutVisible(state) {
      return state.loginTimeOutVisible;
    },
    getToken(state) {
      return state.token;
    },
    getUserMenus(state) {
      return state.userMenus;
    },
    getUserMenusAct(state) {
      return state.userMenusAct;
    },
    getSliderMenus(state) {
      return state.sliderMenus;
    },
    getSliderMenusAct(state) {
      return state.sliderMenusAct;
    },
    getBreadcrumb(state) {
      return state.breadcrumb;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getQuickDomain(state) {
      console.log("state.quickDomain", state.quickDomain);
      return state.quickDomain;
    }
  }
};