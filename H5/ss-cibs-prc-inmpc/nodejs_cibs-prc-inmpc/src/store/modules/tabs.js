/*
 * @Author: zhangzhen
 * @Date: 2021-11-02 19:11:40
 * @LastEditTime: 2022-01-26 11:12:15
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\store\modules\tabs.js
 */
// import { setStorageTabs } from '@/utils/tools';
// import _ from 'lodash';

let defaultTabs = [{
  name: "HomePage",
  path: "/homePage",
  meta: {
    "fixed": true,
    title: "HomePage"
  }
}]; //默认打开的窗口
const state = {
  openedTabs: [
    ...defaultTabs
  ], //所有打开的路由
  activeTab: '', //激活状态
  /** 当前操作的路由 */
  currentOpRoute: '',
}
const mutations = {
  ADD_TABS(state, tab) {
    if (!tab || !tab.path) {
      return;
    }

    if (state.openedTabs && state.openedTabs.length > 0) {
      const repeatIndex = state.openedTabs.findIndex(openedTab => {
        const {
          title
        } = tab.meta;
        if (openedTab.meta.title === title) {
          return true;
        }
        return false;
      });
      if (repeatIndex > 0) {
        state.openedTabs.splice(repeatIndex, 1);
      }
    }

    state.openedTabs.push(tab);
    state.activeTab = tab.path;

    // setStorageTabs(state.openedTabs);
  },
  ADD_SELF_TABS(state, tab) {
    for (const [i, v] of state.openedTabs.entries()) {
      if (v.path === state.activeTab) {
        state.openedTabs.splice(i, 1, tab);
        state.activeTab = tab.path;
        break;
      }
    }

    // setStorageTabs(deepClone(state.openedTabs));
  },
  DELETE_TABS(state, route) {
    for (const [i, v] of state.openedTabs.entries()) {
      if (v.path === route) {
        state.openedTabs.splice(i, 1);
        if (v.path === state.activeTab && i) {
          state.activeTab = state.openedTabs[i - 1].path || '';
        }

        break;
      }
    }

    // setStorageTabs(deepClone(state.openedTabs));
  },
  DELETE_LEFT_TABS(state, tab) {
    let cIdx = state.openedTabs.findIndex(item => item.path === tab); //查找选中的index
    let leftTabs = state.openedTabs.filter((item, i) => i < cIdx); //左边打开的tabs
    let leftFixedTabs = leftTabs.filter(item => item.meta && item.meta.fixed); //帅选左边打开的固定tabs
    let inLeftTabs = leftTabs.some(item => item.path === state.activeTab); //关闭左边的窗口是否在激活的状态下
    state.openedTabs.splice(0, cIdx);
    state.openedTabs = [...leftFixedTabs, ...state.openedTabs]; //把固定的窗口恢复回来
    if (inLeftTabs) state.activeTab = tab; //是在激活的状态下，关闭后激活选中的状态

    // setStorageTabs(deepClone(state.openedTabs));
  },

  DELETE_RIGHT_TABS(state, tab) {
    let cIdx = state.openedTabs.findIndex(item => item.path === tab); //查找选中的index
    let rightTabs = state.openedTabs.filter((item, i) => i > cIdx); //右边打开的tabs
    let rightFixedTabs = rightTabs.filter(item => item.meta && item.meta.fixed); //帅选右边打开的固定tabs
    let inRightTabs = rightTabs.some(item => item.path === state.activeTab); //关闭右边的窗口是否在激活的状态下
    let num = state.openedTabs.length - cIdx
    state.openedTabs.splice(cIdx + 1, num);
    state.openedTabs = [...state.openedTabs, ...rightFixedTabs, ]; //把固定的窗口恢复回来
    if (inRightTabs) state.activeTab = tab; //是在激活的状态下，关闭后激活选中的状态

    // setStorageTabs(deepClone(state.openedTabs));
  },
  DELETE_ALL_TABS(state) {
    state.openedTabs = state.openedTabs.filter(item => item.meta && item.meta.fixed);
    let openedTabs = state.openedTabs[state.openedTabs.length - 1];
    state.activeTab = (openedTabs && openedTabs.path) || '';

    // setStorageTabs(deepClone(state.openedTabs));
  },
  SET_ACTIVE_TAB(state, tab) {
    state.activeTab = tab;

    // setStorageTabs(deepClone(state.openedTabs));
  },
  SET_CURRENT_OP_ROUTE(state, currentOpRoute) {
    if (typeof currentOpRoute === 'string') {
      state.currentOpRoute = currentOpRoute;
    }
  }
}
const actions = {

}

const getters = {
  // breadCrumbList: (state) => {
  //   const pathList = location.hash.split('/').filter((item, index) => index > 0);

  //   return [...pathList, state.currentOpRoute];
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}