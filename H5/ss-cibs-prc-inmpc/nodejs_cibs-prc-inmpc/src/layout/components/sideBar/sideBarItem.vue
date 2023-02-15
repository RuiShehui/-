<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2021-12-24 10:55:37
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\nodejs_cibs-prc-inmpc\src\layout\components\sideBar\sideBarItem.vue
-->
<template>
  <div class="aside-wrap" v-if="!item.hidden && isRenderItem(item)">
    <template v-if="!item.children">
      <el-menu-item
        :index="
        JSON.stringify({ path: `${tPath}/${item.path}`, name: item.name })
      "
        :key="item.path"
      >
        <!-- <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i> -->
        <img
          class="slider-item-icon"
          v-if="item.meta && item.meta.icon"
          :src="isShowCurrent ? item.meta.icon : item.meta.backIcon"
          alt
        />
        <span
          v-if="item.meta && item.meta.title"
          :class="['admin-menu-title', isShowCurrent ? 'active' : '']"
        >{{ translatedTitle(item.meta.title) }}</span>
      </el-menu-item>
    </template>

    <el-submenu v-else :index="item.path">
      <template slot="title">
        <!-- <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i> -->
        <img
          class="slider-item-icon"
          v-if="item.meta && item.meta.icon"
          :src="isShowCurrent ? item.meta.icon : item.meta.backIcon"
          alt
        />
        <span
          v-if="item.meta && item.meta.title"
          :class="['admin-menu-title', isShowCurrent ? 'active' : '']"
        >{{ translatedTitle(item.meta.title) }}</span>
      </template>
      <side-bar-item
        v-for="sub in item.children"
        :key="sub.path"
        :item="sub"
        :tPath="'/' + item.path"
      ></side-bar-item>
    </el-submenu>
  </div>
</template>

<style lang="scss">
.admin-menu-title {
  color: rgba(0, 0, 0, 0.85);
  &.active {
    color: #f06b00;
  }
}
.menu-expanded .aside-wrap {
  background: transparent;
}
.aside-wrap {
  // background: #283b46;
  background: transparent;
  .el-menu-item {
    &:hover,
    &:focus {
      background: rgba(255, 118, 53, 0.1);
      .admin-menu-title {
        color: #333;
      }
      // i {
      //   color: #fff;
      // }
    }
    &.is-active {
      // background: $--color-primary;
      color: #fff;
      background: #fef0e6;
      border: 2px solid transparent;
      border-right-color: #f06b00;
    }
    &.is-active:hover {
      color: #fff !important;
    }
  }
}
.el-menu--collapse {
  .admin-menu-title {
    opacity: 0;
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
}
.slider-item-icon {
  width: 18px;
  height: 18px;
  padding: 5px;
}
</style>

<script>
import { transToHighCamel } from '@/utils/tools';

export default {
  name: 'sideBarItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    tPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    whiteList() {
      return this.$store.getters['permission/whiteList'];
    },
    currentPath() {
      return this.$route.path;
    },
    currentIconPath() {
      const [currentIconPath] = this.currentPath
        .split('/')
        .filter((item, index) => index > 0);
      return `/${currentIconPath}`;
    },
    isShowCurrent() {
      if ((this.item.path === this.currentIconPath) || (this.item.path + 'homePage' === this.currentIconPath)) {
        return true;
      }
      return false;
    }
  },
  methods: {
    transToHighCamel,
    translatedTitle(title) {
      const result = this.$t(`MENU_PAGE_ITEMS.${transToHighCamel(title)}`);

      return result;
    },
    isRenderItem(currentItem) {
      if (!this.whiteList.some(item => item.includes(currentItem.path))) {
        return false;
      }
      return true;
    }
  }
};
</script>
