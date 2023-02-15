<template>
  <div class="bank-header">
    <search-logout class="search-logout" />
    <div
      :class="[
        getActiveMenuIndex > 0 ? 'nav-wrapper nav-hover' : 'nav-wrapper'
      ]"
      ref="nav-wrapper"
    >
      <div class="menu-box">
        <ul class="menu-parent">
          <li
            v-for="(item, index) in getUserMenus"
            :key="item.id"
            :class="
              item.id === getSliderMenusAct.substr(0, 2)
                ? 'menu-item active'
                : 'menu-item'
            "
          >
            <div
              class="menu-title"
              @click="menuClick(item)"
              @mouseenter="menuMouseenter($event, index)"
              @mouseleave="menuMouseleave($event, index)"
            >{{ item[menuName] }}</div>
            <transition name="menu-children-box">
              <div
                :class="[isLoading ? 'menu-children-box' : 'menu-children-box opacity-0']"
                v-show="!isLoading ? true :  item.children && getActiveMenuIndex === index"
                @mouseenter="menuMouseenter($event, index)"
                @mouseleave="menuMouseleave($event, index)"
              >
                <ul
                  class="menu-children"
                  :style="{
                    left:
                      menuMarginLeftNum +
                      'px'
                  }"
                >
                  <li
                    v-for="item2 in item.children"
                    :key="item2.id"
                    @click="handleSelect(item, item2)"
                    :class="[
                      $route.path === item2.path ||
                      item2.id === getSliderMenusAct
                        ? 'menu-children-item active'
                        : 'menu-children-item'
                    ]"
                  >{{ item2[menuName] }}</li>
                </ul>
              </div>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SearchLogout from './SearchLogout.vue';
import { mapMutations, mapState, mapGetters } from 'vuex';
import { getActiveClickArr } from '@/utils';

export default {
  name: 'BankHeader',
  components: {
    SearchLogout
  },
  computed: {
    ...mapGetters('home', ['getActiveMenuIndex']),
    ...mapGetters('app', [
      'getUserMenus',
      'getSliderMenus',
      'getSliderMenusAct',
      'getLang'
    ]),
    menuName() {
      return this.getLang === 'zh-CN'
        ? 'menuNameSC'
        : this.getLang === 'zh-HK'
        ? 'menuNameTC'
        : 'menuNameEN';
    }
  },
  data() {
    return {
      mentNameLeftArr: [],
      mentNameWidthArr: [],
      menuChildrenWidthArr: [],
      screenWidth: null,
      menuMarginLeftNum: 0,
      isLoading: false
    };
  },
  watch: {
    screenWidth: {
      handler: function(val) {
        this.menuDistance();
      },
      immediate: true
    },
    "$i18n.locale"(val) {
      this.menuDistance();
    }
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    this.isLoading = false;
    this.menuDistance();
  },
  methods: {
    ...mapMutations('home', ['setActiveMenuIndex']),
    ...mapMutations('app', [
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),
    menuDistance() {
      this.isLoading = false;
      this.mentNameLeftArr = [];
      this.mentNameWidthArr = [];
      this.menuChildrenWidthArr = [];
      // body距离左侧距离
      let bodyLeft = document.body.getBoundingClientRect().left;
      let menuNameDom = document.getElementsByClassName('menu-title');
      for (let i = 0; i < menuNameDom.length; i++) {
        // 一级菜单距离左侧距离
        let menuNameLeft = menuNameDom[i].getBoundingClientRect().left;
        if (menuNameLeft > 0) {
          this.mentNameLeftArr.push(Math.abs(bodyLeft) + menuNameLeft);
        } else {
          this.mentNameLeftArr.push(
            Math.abs(bodyLeft) - Math.abs(menuNameLeft)
          );
        }
        // 一级菜单宽度
        this.mentNameWidthArr.push(menuNameDom[i].offsetWidth);
      }
      let menuChildrenDom = document.getElementsByClassName('menu-children');
      for (let i = 0; i < menuChildrenDom.length; i++) {
        this.menuChildrenWidthArr.push(menuChildrenDom[i].offsetWidth);
        if (i === menuChildrenDom.length - 1) {
          this.isLoading = true;
        }
      }
    },
    menuMarginLeft(index) {
      // 距离左侧距离
      let marginLeft = this.mentNameLeftArr[index] + this.mentNameWidthArr[index] / 2 - this.menuChildrenWidthArr[index]/2;
      // 判断边界
      let leftDistance = marginLeft - this.mentNameLeftArr[0];
      let rightDistance = 1440 - (leftDistance + this.menuChildrenWidthArr[index]);
      if (leftDistance < 0) {
        this.$set(this, 'menuMarginLeftNum', this.mentNameLeftArr[0]);
      } else if (rightDistance < 0) {
        this.$set(this, 'menuMarginLeftNum', leftDistance + rightDistance);
      } else {
        this.$set(this, 'menuMarginLeftNum', marginLeft);
      }
    },
    menuClick(item) {
      if (!item.children) {
        this.setSliderMenusAct(item.id);
        this.$nextTick(() => {
          this.setBreadcrumb([item]);
        });
        this.setSliderMenus([item]);
        this.$router.push(item.path);
      } else {
        let item2 = item.children[0];
        this.$nextTick(() => {
          const breadcrumbList = getActiveClickArr(item2.id, item.children);
          this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
          this.setBreadcrumb(breadcrumbList);
          this.setSliderMenus(item.children);
          this.$router.push({
            path: breadcrumbList[breadcrumbList.length - 1].pacPath
          });
        });
      }
    },
    menuMouseenter(e, index) {
      if (this.getUserMenus[index].children) {
        this.menuMarginLeft(index);
        this.setActiveMenuIndex(index);
      }
    },
    menuMouseleave(e, index) {
      this.setActiveMenuIndex(-1);
    },
    handleSelect(item, item2) {
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr(item2.id, item.children);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenus(item.children);
        this.$router.push({
          path: breadcrumbList[breadcrumbList.length - 1].pacPath
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.opacity-0 {
  opacity: 0;
}
.bank-header {
  background: #fff;
  width: 100%;

  .search-logout {
    width: $main-width;
    margin: 0 auto;
  }

  .nav-wrapper {
    height: 36px;
    background: url('../../images/home/header_bg.png');
    min-width: 1000px;
    position: relative;
    .menu-box {
      width: $main-width;
      margin: 0 auto;
      width: 1440px;
      overflow: hidden;
      .menu-parent {
        line-height: 32px;
        // white-space: nowrap;
        .menu-item {
          display: inline-table;
          &.active {
            .menu-title {
              background-color: #fff;
              color: #f06b00;
            }
          }
          .menu-title {
            min-width: 64px;
            line-height: 32px;
            padding: 0 22px;
            text-align: center;
            border-radius: 2px 2px 0 0;
            margin-top: 4px;
            font-size: 16px;
            color: #fff;
            cursor: pointer;
          }
          .menu-children-box {
            position: absolute;
            top: 36px;
            left: 0;
            z-index: 9999;
            width: 100%;
            line-height: 32px;
            background-color: #fff;
            white-space: nowrap;
            .menu-children {
              display: inline-flex;
              position: relative;
              .menu-children-item {
                font-size: 16px;
                color: #333;
                padding: 0 10px;
                margin-right: 4px;
                cursor: pointer;
                // line-height: 36px;
                line-height: 54px;
                &:hover {
                  color: #f06b00;
                }
                &.active {
                  color: #f06b00;
                }
              }
            }
          }
        }
      }
    }
  }
}
body#en {
  .nav-wrapper {
    background-size: contain;
  }
  .menu-box {
    .menu-parent {
      line-height: 1.2em;
      .menu-item {
        .menu-title {
          width: auto;
          font-size: 12px;
          padding: 0 10px;
        }
        .menu-children-box {
          .menu-children {
            .menu-children-item {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
