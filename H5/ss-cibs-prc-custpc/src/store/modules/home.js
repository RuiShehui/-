/*
 * @Author: ZhangZhen
 * @Date: 2022-01-28 11:25:31
 * @LastEditTime: 2022-02-09 14:54:36
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\store\modules\home.js
 */
export default {
  namespaced: true,
  state: {
    showShortcutMenu: false, 
    menu: [],
    activeMenuIndex: -1,
    dataurl: ''
  },
  actions: {
    // TODO 获取菜单列表
    fetchMenu(context) {
      const menu = [];
      context.commit("setMenu", menu);
    }
  },
  mutations: {
    addSelectedFunc(state, index) {},
    deleteSelectedFunc(state, index) {},
    setShowShortcutMenu(state, flag) {
      state.showShortcutMenu = flag;
    },
    setMenu(state, menu) {
      state.menu = menu;
    },
    setActiveMenuIndex(state, index) {
      state.activeMenuIndex = index;
    },
    setFileToDataURL(state, dataurl) {
      state.dataurl = dataurl;
    },
  },
  getters: {
    selectedFuncs(_state, _getters, rootState) {
      let res = findSelected(rootState.app.quickMenu, []);
      return res;
    },
    getActiveMenuIndex(state) {
      return state.activeMenuIndex;
    },
  }
};

/**
 * 返回被选为快捷菜单的数组 item.pitchStatus === "1" 代表被选中
 * @param {Array} list 菜单列表
 * @param {Array} res 用于存储选中菜单的初始化列表
 * @returns 选中的菜单
 */
function findSelected(list, res) {
  list && list.reduce((_prev, cur) => {
    if (cur.pitchStatus === "1") {
      res.push(cur);
    }

    if (cur.children && cur.children.length > 0) {
      findSelected(cur.children, res); // 递归查找
    }
  }, []);

  return res;
}
