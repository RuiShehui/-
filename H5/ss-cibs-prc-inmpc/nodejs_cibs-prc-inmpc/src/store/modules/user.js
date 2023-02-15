import router, {
  resetRouter
} from '@/router'
import {
  getToken,
  setToken,
  removeToken,
  getUser,
  removeUser,
  getRoleDetail,
  setRoleDetail,
  setRoleMaps,
  setHead,
  setRoleCode
} from '@/utils/user'
import {
  ShowMessage,
  ShowModal
} from '@/plugins'
import {
  userLogin,
  userLogout
} from '@/api/menu-management'
import {
  HEAD,
  TOKEN
} from '@/configs/keys'

const hideMsg = () => {
  // 隐藏信息框
  const msg = document.getElementsByClassName('el-message')[0]
  msg && (msg.style.display = 'none')
}

let transformMenu = list => {
  let menuObj = {},
    result = list || []

  if (result.length) {
    result
      .sort((a, b) => {
        return parseInt(a.seq, 10) - parseInt(b.seq, 10)
      })
      .map(i => {
        !i.pid && (i.pid = '')
        let p = menuObj[i.pid]
        if (!p) {
          p = menuObj[i.pid] = {
            id: i.pid,
            children: []
          }
        } else {
          !p.children && (p.children = [])
        }
        let item = menuObj[i.id] || {
          id: i.id
          //children:[]
        }
        item.pid = i.pid || ''
        item.name = i.id
        item.path = i.id
        item.component = i.value
        item.meta = {
          title: i.name,
          icon: i.icon
        }
        menuObj[i.id] = item
        p.children.push(item)
      })

    Object.keys(menuObj)
      .filter(e => !menuObj[e].children)
      .map(e => delete menuObj[e])

    menuObj[''].children[0].meta.icon = 'el-icon-user-solid'
    return menuObj[''].children
  }
}
const state = {
  hasMenu: false,
  token: getToken(),
  userName: getUser(),
  avatar: './img/user.png',
  menus: [],
  roleDetail: JSON.stringify(getRoleDetail()),
  roleMaps: {},
  roleCode: ''
}

const mutations = {
  SET_TOKEN: (state, token = '') => {
    // 设置section的token
    sessionStorage.setItem(TOKEN, token)
    // 设置store的token
    state.token = token
  },
  CLEAR_TOKEN(state) {
    sessionStorage.setItem(TOKEN, '')
    sessionStorage.setItem(HEAD, '')
    state.token = ''
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_MENUS: (state, menus) => {
    state.hasMenu = true
    state.menus = menus
  },
  SET_MENUS_STATE(state, status) {
    state.hasMenu = status
  },
  SET_ROLE_DETAIL(state, roleDetail) {
    state.roleDetail = roleDetail
  },
  SET_ROLE_MAPS(state, roleMaps) {
    state.roleMaps = roleMaps
  },
  SET_ROLE_CODE(state, roleCode) {
    state.roleCode = roleCode;
    setRoleCode(roleCode);
  },
}

const actions = {
  async logout({
    dispatch,
    commit
  }, params = {}) {
    try {
      const result = await userLogout(params);
      if (result.status) {
        ShowMessage({
          message: '登出成功',
          type: 'success'
        })
        // dispatch(' ')
        dispatch('RESET_USER')
        commit('SET_MENUS_STATE', false)
        commit('CLEAR_TOKEN')
        commit('tabs/DELETE_ALL_TABS', [], {
          root: true
        })
        resetRouter()
      } else {
        ShowMessage({
          message: `登出失败 !`,
          type: 'error'
        })
      }
    } catch (err) {
      ShowMessage({
        message: `异常: ${err}`,
        type: 'error'
      })
    }
    // return new Promise((resolve, reject) => {
    //   try {
    //   } catch(err) {
    //     ShowMessage({
    //       message: `异常: ${err}`,
    //       type: 'error'
    //     })
    //   }
    //   logout(params).then(response => {
    //     if (response.status) {
    //       ShowMessage({
    //         message: '登录成功',
    //         type: 'success'
    //       })
    //       // dispatch(' ')
    //       dispatch('RESET_USER')
    //       commit('SET_MENUS_STATE', false)
    //       commit('CLEAR_TOKEN')
    //       commit('tabs/DELETE_ALL_TABS', [], {
    //         root: true
    //       })
    //       resetRouter()
    //       resolve()
    //     }
    //   }).catch(error => {
    //     ShowMessage({
    //       message: `登录失败: ${error}`,
    //       type: 'error'
    //     })
    //   })

    // })
  },

  async login({
    commit,
  }, params) {
    try {
      const result = await userLogin(params)
      const {
        body,
        head
      } = result
      const { returnCode } = head
      if (returnCode === '000000') {
        ShowMessage({
          message: `登录成功`,
          type: 'success',
          isShowMask: false,
          duration: 1500
        })
        const {
          token,
          userLoginDetails,
        } = body

        const { roleMaps, roleCode = '' } = userLoginDetails

        commit('SET_TOKEN', token)
        commit('SET_ROLE_DETAIL', userLoginDetails)
        commit('SET_ROLE_MAPS', roleMaps)
        commit('SET_ROLE_CODE', roleCode)
        setToken(token)
        setRoleDetail(userLoginDetails)
        setRoleMaps(roleMaps || {})
        // 设置权限菜单 // todo

        setHead({
          ...head,
          channel: 'IN'
        })

        router.push('/homePage')
        return true
        // window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token
      } else {
        const { head } = result,
          { returnMessage = 'error' } = head
        hideMsg();
        // 显示模态框
        ShowModal({
          content: `${returnMessage}`,
          showCancelButton: false
        });
        return false
      }
    } catch (err) {
      ShowMessage({
        message: `异常: ${err}`,
        type: 'error'
      })
      return false
    }
  },
  getMenus({ commit }, params) {
    // TODO get-menus
  },
  resetToken({
    commit
  }) {
    commit('SET_TOKEN', null)
    removeToken()

  },
  RESET_USER({
    commit
  }) {
    commit('SET_USER_NAME', '')
    removeUser()
  }
}
const getters = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};