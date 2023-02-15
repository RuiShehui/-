<!--
 * @Autor: 朱涛
 * @Date: 2021-11-11 09:49:36
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-24 11:01:13
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\common\RoleSwitch.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <el-dropdown class="dropdown" trigger="click" @command="handleCommand">
    <span class="main-text">
      {{ roleName }}
      <i :class="iconClassList"></i>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in roleList"
        :command="item.roleName"
        :key="item.roleCode"
        @click.native="handleSwitchRole(item)"
      >{{ item.roleName }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getRoleDetail, setRoleDetail, getRoleCode } from '@/utils/user';
import { isType } from '@/utils/tools';
import { createNamespacedHelpers } from 'vuex';
import { getMenusByRole } from '@/api/menu-management';

const { mapState, mapMutations } = createNamespacedHelpers('user');

export default {
  name: 'RoleSwitch',
  data() {
    return {
      roleName: '系统管理员', //角色名称
      roleCode: '',
      roleList: [],
      iconClassList: ['right-icon', 'el-icon-arrow-down']
    };
  },
  computed: {
    ...mapState(['roleMaps'])
    // roleList() {
    //   const roleList = Object.keys(this.roleMaps || {}).map(k => ({
    //     id: k,
    //     roleName: this.roleMaps[k]
    //   }));
    //   return roleList;
    // }
  },
  watch: {
    roleMaps() {
      this.setRoleList();
    },
    roleCode(newVal) {
      // 关闭所有已经打开的顶部菜单
      this.$store.commit('tabs/DELETE_ALL_TABS');
      // 发请求获取菜单
      this.setMenus(newVal);
    }
  },
  mounted() {
    this.roleName = getRoleDetail().roleName;
    this.setRoleCode();
    this.initRoleMaps();
    this.setRoleList();
  },
  methods: {
    ...mapMutations(['SET_ROLE_MAPS']),
    handleCommand(command) {
      // console.log('打印command', command);
      this.roleName = command;
    },
    setRoleCode() {
      // roleCode
      const roleCode = arguments[0] || getRoleCode();
      if (roleCode) {
        this.roleCode = roleCode;
      }
    },
    initRoleMaps() {
      const roleMaps = JSON.parse(sessionStorage.getItem('roleMaps') || '{}');
      if (Object.keys(roleMaps).length) {
        this.SET_ROLE_MAPS(roleMaps);
      }
    },
    setRoleList() {
      this.roleList = Object.keys(this.roleMaps || {}).map(k => {
        return {
          id: k,
          roleName: this.roleMaps[k]
        };
      });
    },
    async setMenus(roleCode) {
      const result = await getMenusByRole({ roleCode }),
        { body } = result;
      if (isType(body, 'Array') && body.length) {
        this.$store.commit('permission/SET_ROUTES', body);
      } else {
        this.$store.commit('permission/SET_ROUTES', []);
      }
      this.updateRole(roleCode);
    },
    // update role
    updateRole(roleCode) {
      this.$eventBus.$emit('changeRole', this.roleName);
      sessionStorage.setItem('roleCode', roleCode);
    },

    //切换角色
    handleSwitchRole(item) {
      // 切回到首页

      if (this.roleCode !== item.id) {
        this.$router.push('/homePage');
      }

      this.roleCode = item.id;

      // set roleObj to sessionStorage
      let roleObj = getRoleDetail();
      // console.log(roleObj);
      roleObj.roleCode = item.id;
      roleObj.roleName = item.roleName;
      setRoleDetail(roleObj);
    }
  },
  beforeDestroy() {
    this.$eventBus.$off('changeRole');
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  .main-text {
    outline: none;
    border-radius: 15px;
    font-size: 13px;
    padding: 0.5em 1em;
    &:hover {
      color: #f06b00;
    }
  }

  .right-icon {
    display: inline-block;
    margin: 0 5px;
    width: 8px;
    height: 8px;
  }
}
.el-dropdown-menu {
  top: 42px !important;
}
</style>
