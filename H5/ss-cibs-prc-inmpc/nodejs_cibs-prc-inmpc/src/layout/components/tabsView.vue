<template>
  <div>
    <el-tabs
      v-polyfill-tab-close="{ icon: 'close' }"
      v-model="activeTab"
      ref="awebWrap"
      type="border-card"
      v-if="openedTabs.length"
      @tab-click="tabClick"
      @tab-remove="tabRemove"
      @contextmenu.native="openRightMenu(openedTabs,$event)"
      class="aweb-tabs"
      @click="onBackTop"
    >
      <el-tab-pane
        v-for="(item) in openedTabs.filter(tab => tab.meta && tab.meta.title)"
        :key="item.name"
        :label="item.meta && ((item.meta.top) ? $t(`MENU_PAGE_ITEMS.${transToHighCamel(item.meta.top)}`) : $t(`MENU_PAGE_ITEMS.${transToHighCamel(item.meta.title)}`))"
        :name="item.path"
        :route="item.path"
        :closable="!(item.meta && item.meta.fixed)"
        class="aweb-tab-pane"
      >
        <div class="aweb-ctt-wrap">
          <transition name="fade" mode="out-in">
            <keep-alive v-if="isRouterAlive" :exclude="excludeList">
              <router-view v-show="activeTab===item.path" />
            </keep-alive>
            <template v-else>
              <keep-alive v-if="item.meta && item.meta.keepAlive" :exclude="excludeList">
                <router-view v-if="activeTab===item.path" />
              </keep-alive>
              <keep-alive :exclude="excludeList">
                <router-view v-if="activeTab===item.path && !(item.meta && item.meta.keepAlive)" />
              </keep-alive>
            </template>
          </transition>
        </div>
        <div v-if="isLoading" class="aweb-ctt-wrap" v-loading="true" element-loading-background="rgba(0, 0, 0, .3)" />
      </el-tab-pane>
    </el-tabs>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="aweb-contextmenu">
      <template v-for="(item2, index2) in rightMenuData">
        <li
          :key="index2 + item2"
          v-if="!(currentMenu && currentMenu.meta && currentMenu.meta.fixed && item2.key==='close')"
          @click="rightMenuClick(item2.key)"
        >{{ item2.name }}</li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mixins } from '@v2-lib/vue.spa.plugin';
import { createNamespacedHelpers } from 'vuex';
import { transToHighCamel } from '@/utils/tools';
import excludeList from '@/configs/exclude-list';
import { polyfillTabClose } from '@/directives';

const { mapState } = createNamespacedHelpers('tabs');

export default {
  mixins: [mixins],
  directives: {
    polyfillTabClose
  },
  data() {

    return {
      visible: false,
      left: 0,
      top: 25,
      isRouterAlive: false,
      currentMenu: null,

      excludeList
    };
  },
  provide() {
    return {
      onBackTop: this.onBackTop
    };
  },
  computed: {
    ...mapState(['openedTabs']),
    activeTab: {
      get() {
        return this.$store.state.tabs.activeTab;
      },
      set(newValue) {
        this.$store.commit('tabs/SET_ACTIVE_TAB', newValue);
      }
    },
    isLoading() {
      return this.$store.state.loading.loading;
    },
    rightMenuData() {
      return [
        {
          name: this.$t('COMMON.REFRESH_CURRENT_TAB'), // 刷新此窗口
          key: 'refresh'
        },
        {
          name: this.$t('COMMON.CLOSE_CURRENT_TAB'), // 关闭此窗口
          key: 'close'
        },
        {
          name: this.$t('COMMON.CLOSE_LEFT_TABS'), // 关闭左侧窗口
          key: 'closeLeft'
        },
        {
          name: this.$t('COMMON.CLOSE_RIGHT_TABS'), // 关闭右侧窗口
          key: 'closeRight'
        },
        {
          name: this.$t('COMMON.CLOSE_ALL_TABS'), // 关闭全部窗口
          key: 'closeAll'
        }
      ];
    },
    // openedTabs() {
    //   return this.$store.state.tabs.openedTabs;
    // }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        if (/^\/redirect/.test(to.path)) {
          return;
        }
        this.$store.commit('loading/SET_LOADING', false);
        const inTabs = this.openedTabs.some(item => item.path === to.path);
        if (inTabs) {
          this.$store.commit('tabs/SET_ACTIVE_TAB', to.path);
          return;
        }
        if (to.meta.type === 'SELF') {
          this.$store.commit('tabs/ADD_SELF_TABS', to);
        } else {
          this.$store.commit('tabs/ADD_TABS', to);
          this.$store.commit('loading/SET_LOADING', false);
          // const reg = /^CustomerQuery/;
          // if (reg.test(from.name) && reg.test(to.name)) {
          //   this.$store.commit('tabs/DELETE_TABS', from.path);
          // }
        }
      }
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeRightMenu);
      } else {
        document.body.removeEventListener('click', this.closeRightMenu);
      }
    },
    activeTab: {
      immediate: true,
      handler(nV, v) {
        if (nV !== v && nV !== this.$route.path) {
          let info = this.openedTabs.filter(item => item.path === nV);
          if (info.length) {
            info = info[0];
            this.open({
              path: info.path,
              params: info.query || {}
            });
          }
        }
      }
    }
  },
  methods: {
    transToHighCamel,
    rightMenuClick(key) {
      switch (key) {
        case 'refresh':
          this.$router.replace({
            path: '/redirect' + this.currentMenu.path,
            query: this.currentMenu.query
          });
          break;

        case 'close':
          this.$store.commit('tabs/DELETE_TABS', this.currentMenu.path);

          break;
        case 'closeLeft':
          this.$store.commit('tabs/DELETE_LEFT_TABS', this.currentMenu.path);

          break;
        case 'closeRight':
          this.$store.commit('tabs/DELETE_RIGHT_TABS', this.currentMenu.path);

          break;

        case 'closeAll':
          this.$store.commit('tabs/DELETE_ALL_TABS');
          break;
        case 'closeOther':
          // this.handleCloseOtherTabs();
          break;
        default:
          break;
      }
    },
    tabClick(tab) {
      // debugger;
      let info = this.openedTabs.filter(item => item.path === tab.$attrs.route);
      if (info && info.length) {
        info = info[0];
        this.$router.replace({
          path: info.path,
          query: info.query || {}
        });
      }
    },
    tabRemove(path) {
      this.$store.commit('tabs/DELETE_TABS', path);
      // let openedTabs = this.openedTabs;

      // if (openedTabs && openedTabs.length && path === this.activeTab) {
      //   let info = openedTabs[openedTabs.length - 1];
      //   this.$router.push({
      //     path: info.path,
      //     query: info.query || {}
      //   });
      // }
      // else{
      //    this.$router.push('/');
      // }
    },
    openRightMenu(tag, e) {
      let target = e.target.closest('.el-tabs__item');
      if (target) {
        let idAttr = target.getAttribute('id');
        let paneAttr = idAttr.replace('tab-', 'pane-');
        let route = document.getElementById(paneAttr).getAttribute('route');
        if (route) {
          e.stopPropagation();
          e.preventDefault();
          const menuMinWidth = 105;
          const offsetLeft = this.$el.getBoundingClientRect().left;
          const offsetWidth = this.$el.offsetWidth;
          const maxLeft = offsetWidth - menuMinWidth;
          const left = e.clientX - offsetLeft;

          if (left > maxLeft) {
            this.left = maxLeft;
          } else {
            this.left = left;
          }

          tag.forEach(element => {
            if (element.path === route) {
              this.currentMenu = element;
            }
          });
          this.visible = true;
        }
      }
    },
    closeRightMenu() {
      this.visible = false;
    },
    handleGetIdx(e) {
      // console.log(e);
    },
    onBackTop() {
      const awebWrap = this.$refs.awebWrap;
      if (awebWrap) {
        const children = [].slice
          .call(awebWrap.$children)
          .map(item => item.$el.getElementsByClassName('aweb-ctt-wrap')[0])
          .filter(el => el);
        children.forEach(el => {
          el.scrollTop = 0;
        });
      }
    }
    /**
     * 2021-11-15新增: 关闭其他窗口
     * @param {MouseEvent} e
     */
    // handleCloseOtherTabs() {
    //   // set delete-list
    //   // delete other routes by map delete-list
    // }
  }
};
</script>

<style lang="scss">
.aweb-tabs {
  height: 100%;

  .el-tabs__content {
    height: calc(100% - 40px);
    overflow: hidden;
    box-sizing: border-box;
  }
  .aweb-ctt-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    height: 100%;
    overflow: auto;
    padding: 20px;
    box-sizing: border-box;
  }
}
.aweb-contextmenu {
  margin: 0;
  background: rgb(84, 92, 100);

  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  border-radius: 4px;
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: rgb(67, 74, 80);
    }
  }
}
</style>