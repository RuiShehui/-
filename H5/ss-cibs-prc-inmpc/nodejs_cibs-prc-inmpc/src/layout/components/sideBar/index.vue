<!--
 * @Author: your name
 * @Date: 2021-11-02 19:11:40
 * @LastEditTime: 2021-12-20 11:49:01
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \workplace\src\layout\components\sideBar\index.vue
-->
<template>
  <aside
    :class="[
      collapsed ? 'menu-collapsed' : 'menu-expanded',
      'side-bar-wrapper'
    ]"
  >
    <!-- v-loading="loading" -->
    <el-menu
      class="el-menu-vertical-demo"
      text-color="#fff"
      :collapse="collapsed"
      @select="handleSelectMenu"
    >
      <side-bar-item v-for="item in menus" :key="item.path" :item="item" />
    </el-menu>
  </aside>
</template>
<script>
import { mixins } from '@v2-lib/vue.spa.plugin';

import sideBarItem from './sideBarItem';
export default {
  name: 'sideBar',
  mixins: [mixins],
  components: {
    sideBarItem
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //  collapse:this.collapsed
      loading: false,
    };
  },
  mounted() {
  },
  computed: {
    menus() {
      // return this.$store.state.user.menus;
      return this.$router.options.routes;
    },
    routes() {
      return this.$store.state.permission.routes;
    }
  },
  watch: {
    routes: {
      deep: true,
      handler() {
        this.handleLoading();
      }
    }
  },
  methods: {
    handleSelectMenu(index) {
      if (index) {
        let info = JSON.parse(index);
        this.open({ path: info.path });
      }
    },
    handleLoading(delay = 1000) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, delay);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu--collapse
  > .aside-wrap
  > .el-submenu
  > .el-submenu__title
  .el-submenu__icon-arrow {
  display: none;
}
.el-menu {
  li.el-submenu {
    .el-submenu__title:hover {
      background: rgba(255, 188, 153, 0.1) !important;
    }
  }
  li.el-menu-item:not(.is-active) {
    &:hover {
      background-color: rgba(255, 188, 153, 0.1) !important;
    }
  }
  li.el-menu-item.is-active {
    position: relative;
    background-color: rgba(255, 188, 153, 0.1) !important;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 3px;
      height: 100%;
      background: #f06b00;
    }
    i,
    span {
      color: #f06b00 !important;
    }
  }
}
.side-bar-wrapper {
  height: 100%;
  overflow: auto;
}
</style>
