<template>
  <div class="aweb-container" ref="layout" name="layout">
    <div class="aweb-header">
      <el-row>
        <!-- 侧边导航 -->
        <el-col
          :span="10"
          class="aweb-logo"
          :class="collapsed ? 'logo-collapse-width' : 'logo-width'"
        >
          <div class="logo-text" v-show="collapsed">
            <img class="u-login_icon" src="../img/menu-icon/menu-title-icon.png" />
          </div>
          <div class="logo-text" v-show="!collapsed">
            <!-- <img /> -->
            <img class="u-login_icon" src="../img/menu-icon/menu-title-icon.png" />
            <!-- {{ sysName }} -->
            {{ $t(`LOGIN.TITLE`) }}
          </div>
        </el-col>
        <el-col :span="8" class="f-d-f breadcrumb-box">
          <div class="aweb-toolsaweb-tools" @click.prevent="collapsed = !collapsed">
            <i class="el-icon-menu toggle-collapse"></i>
          </div>
          <bread-crumb :crt-op-route="lastBread" />
        </el-col>

        <!-- 右上角功能栏 -->
        <el-col :span="8" class="aweb-userinfo">
          <ul class="userinfo-ul">
            <li class="li-text_select">
              <RoleSwitch></RoleSwitch>
            </li>
            <!-- <li class="line">|</li>
            <li class="li-text">
              <switch-lang></switch-lang>
            </li> -->
            <li class="line">|</li>
            <li
              class="li-text"
              style="padding: 0 15px;"
              @click="handleLogout"
            >{{ $t(`header.retreatSafely`) }}</li>
            <el-badge slot="label" :value="remindNum">
              <!-- <li :class="['el-icon-message', 'envelope-icon']" @click="remind"></li> -->
              <li :class="['el-icon-message', 'envelope-icon']" @click="remind"></li>
            </el-badge>
            <!-- v-if="remindNum > 0" -->
          </ul>
        </el-col>
      </el-row>
    </div>
    <div class="aweb-body">
      <!-- 侧边导航 -->
      <side-bar :collapsed="collapsed"></side-bar>
      <tabs-view class="aweb-ctt"></tabs-view>
    </div>

    <!-- <RemindPopup /> -->
    <el-dialog
      v-polyfill-dialog-close="{
        icon: 'close'
      }"
      :title="$t(`COMMON.REMIND`)"
      :visible.sync="deitailPopupFlag"
      width="980px"
      center
      class="mandate"
    >
      <div class="g_remind_content">
        <div class="detail_conten" v-for="(item, index) in remindList" :key="index" :value="item">
          <div class="detail_conten_list">
            <img style="width: 50px; height: 50px" src="../img/home/message-icon.png" />

            <div class="detail_conten_content">
              <div class="detail_conten_title">{{ item.messageTitle }}</div>
              <div class="detail_conten_time">{{ item.createTime }}</div>
              <div class="detail_conten_remind">{{ item.messageValue }}</div>
            </div>
          </div>
          <div class="line_div"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mixins } from '@v2-lib/vue.spa.plugin';
import sideBar from './components/sideBar';
import BreadCrumb from './components/bread-crumb';
import tabsView from './components/tabsView';
import SwitchLang from '@/components/common/LangSwitch';
import RoleSwitch from '@/components/common/RoleSwitch';
import { createNamespacedHelpers } from 'vuex';
import { getUserMessage, getUserMessageCount, updateState } from '@/api/home';
import { getHead } from '@/utils/user';
import { polyfillDialogClose } from '@/directives';

const { mapActions, mapMutations } = createNamespacedHelpers('user');

export default {
  name: 'layout',
  components: {
    sideBar,
    tabsView,
    SwitchLang,
    RoleSwitch,
    BreadCrumb
  },
  directives: {
    polyfillDialogClose
  },
  data() {
    return {
      sysName: '',
      collapsed: false,
      deitailPopupFlag: false, //提醒弹框是否显示
      remindList: [],
      userNewList: [], //保存用户查询出来的消息
      remindNum: 0,
      lastBread: ''
    };
  },
  provide() {
    return {
      remind: this.remind,
      setLastBread: this.setLastBread
    };
  },
  mixins: [mixins],
  mounted() {
    // 点击第一次登录，首页消息提示事件
    this.$eventBus.$on('remind', async data => {
      await this.remind();

      this.deitailPopupFlag = true;
      this.remindNum = 0;
    });

    this.getUserNew();
    // console.log('获取用户消息数111：', getHead());
  },
  beforeDestory() {
    this.$eventBus.$off('remind');
  },
  methods: {
    ...mapActions(['SET_TOKEN', 'logout']),
    ...mapMutations(['CLEAR_TOKEN']),
    handleLogout() {
      this.$modal({
        // content: '确认退出登录?',
        content: this.$t('HOME.CONFIRM_LOGOUT'),
        confirm: () => this.confirmLogout()
      });
    },
    //退出
    async confirmLogout() {
      // let isLogout = true; // 成功退出
      await this.logout('user/logout');
      this.CLEAR_TOKEN();
      this.$store.commit('tabs/DELETE_ALL_TABS');
      this.$showMsg({
        type: 'success',
        message: this.$t('HOME.LOGOUT_SUCCESS_TIPS')
      });
      this.$router.replace('/login');
    },
    //获取用户消息数
    getUserNew() {
      this.remindList = [];
      this.userNewList = [];

      getUserMessageCount().then(resp => {
        if (resp.body) {
          this.remindNum = resp.body;
        }
      });
    },
    newDataLng(arr) {
      this.remindList = [];
      if (getHead().lang === 'zhCN') {
        arr.forEach(item => {
          let newObj = {
            messageTitle: item.cnMessageTitle,
            createTime: item.createTime,
            messageValue: item.chMessageValue
          };
          this.remindList.push(newObj);
        });
      }
      if (getHead().lang === 'en') {
        arr.forEach(item => {
          let newObj = {
            messageTitle: item.enMessageTitle,
            createTime: item.createTime,
            messageValue: item.enMessageValue
          };
          this.remindList.push(newObj);
        });
      }
      if (getHead().lang === 'zhXG') {
        arr.forEach(item => {
          let newObj = {
            messageTitle: item.xgMessageTitle,
            createTime: item.createTime,
            messageValue: item.xgMessageValue
          };
          this.remindList.push(newObj);
        });
      }
    },
    //提醒
    remind() {
      this.deitailPopupFlag = true;
      Promise.all([getUserMessage(), updateState()]).then(resp => {
        if (resp[0].body) {
          // this.userNewList = resp.body;
          this.newDataLng(resp[0].body);
        }
      });
      this.remindNum = 0;
      this.$eventBus.$emit('tipsInfo');
    },
    // 设置最后一级的面包屑
    setLastBread(newBread = '') {
      this.lastBread = newBread;
    }
  },
  watch: {
    $route() {}
  }
};
</script>

<style lang="scss" scoped>
.aweb-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  background-color: #f5f5f5;
  .breadcrumb-box {
    align-items: center;
  }
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  .el-tabs--border-card > .el-tabs__header {
    border-bottom: none;
    background-color: #fff;
  }
  .el-tabs__item {
    border-right-color: #fff !important;
    border-width: 2px !important;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    position: relative;
    border: none;
    background: #f5f5f5;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    font-weight: 500;
    border-radius: 10px 10px 0 0;
    margin: 0 10px;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item::before,
  .el-tabs--border-card > .el-tabs__header .el-tabs__item::after {
    position: absolute;
    bottom: 0;
    content: '';
    width: 10px;
    height: 10px;
    background: #f5f5f5;
    background-image: radial-gradient(
      10px at 10px 0px,
      #fff 10px,
      #f5f5f5 10px
    );
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item::before {
    right: -10px;
    background-image: radial-gradient(
      10px at 10px 0px,
      #fff 10px,
      #f5f5f5 10px
    );
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item::after {
    left: -10px;
    background-image: radial-gradient(10px at 0px 0px, #fff 10px, #f5f5f5 10px);
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    background: #fff1ea;
    color: #f06b00;
    .el-icon-close {
      background: #f06b00;
    }
    &::before,
    &::after {
      background: #fff1ea;
    }
    &::before {
      background-image: radial-gradient(
        10px at 10px 0,
        #fff 10px,
        #fff1ea 10px
      );
    }
    &::after {
      background-image: radial-gradient(10px at 0 0, #fff 10px, #fff1ea 10px);
    }
  }
  .el-tabs--border-card
    > .el-tabs__header
    .el-tabs__item:not(.is-disabled):hover {
    color: #f06b00;
  }
  .el-tabs__item .el-icon-close {
    background: #c5c5c5;
    color: #fff;
    font-size: 10px;
    margin-left: 8px;
  }
  .el-dropdown {
    vertical-align: middle;
  }
  .aweb-toolsaweb-tools {
    padding-left: 10px;
    .toggle-collapse {
      cursor: pointer;
      padding: 0 20px;
      font-weight: 400;
      font-size: 18px;
      color: #000;
    }
  }
  .aweb-header {
    line-height: 64px;
    background: #fff;
    height: 64px;
    border-right: none;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    .aweb-userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .envelope-icon {
        font-size: 24px;
        margin-top: 20px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    /deep/ .el-badge__content.is-fixed {
      top: 20px;
    }
    .aweb-logo {
      height: 64px;
      font-size: 22px;
      padding-left: 16px;
      padding-right: 16px;
      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #fff;
        float: left;
        margin: 16px 12px 10px 0;
      }
      .logo-text {
        font-size: 18px;
        color: #ffffff;
        font-weight: 500;
      }
    }
    .logo-width,
    .logo-collapse-width {
      transition: width 0.28s;
    }
    .logo-collapse-width {
      width: 64px;
      // background: #283b46;
      background-image: linear-gradient(0deg, #4a4d70 0%, #323045 100%);
    }
    .logo-width {
      width: 268px;
      color: #fff;
      background-image: linear-gradient(0deg, #4a4d70 0%, #323045 100%);
    }
    .aweb-tools {
      padding: 0px 23px;
      width: 14px;
      height: 64px;
      line-height: 64px;
      cursor: pointer;
    }
  }
  .aweb-body {
    position: absolute;
    width: 100%;
    top: 64px;
    bottom: 0px;
    overflow: hidden;
    aside {
      width: 268px;
      transition: width 0.28s;
      height: 100%;
      background: #fff;
      .el-menu {
        height: 100%;
        border-right: 0;
      }
      .el-submenu .el-menu {
        background: transparent;
      }
      a.router-link-exact-active.router-link-active {
        text-decoration: none;
      }
      .el-submenu__title:hover,
      .el-submenu__title:focus {
        background: rgba(255, 188, 153, 0.1);
      }
      .el-menu-item {
        &:hover,
        &:focus {
          background: #334149;

          i {
            color: $--color-primary;
          }
        }
        &.is-active {
          background: $--color-primary;
          color: #fff;
        }
        &.is-active:hover {
          color: #fff !important;
        }
      }
      .el-submenu {
        [class*='fa '] {
          margin-right: 9px;
          font-size: 18px;
          margin-left: 4px;
        }
        &:hover {
          .el-submenu__title i {
            color: $--color-primary;
          }
        }
      }
    }
    .menu-collapsed {
      width: 64px;
      transition: all 0.28s;
      & + .aweb-ctt {
        margin-left: 64px;
        transition: margin-left 0.5s;
      }
    }
    .menu-expanded {
      width: 268px;
      transition: all 0.5s;
      & + .aweb-ctt {
        margin-left: 268px;
        transition: margin-left 0.28s;
      }
    }
  }
  .aweb-ctt {
    overflow: hidden;
    padding: 10px;
    margin-left: 268px;
    box-sizing: border-box;
    position: absolute;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .userinfo-ul {
    display: flex;
    justify-content: flex-end;
    li {
      list-style-type: none;
      user-select: none;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      &.line {
        color: #bdbfc7;
      }
      &.email {
        margin-left: 16px;
      }
      &.li-text,
      &.email {
        cursor: pointer;
        &:hover {
          opacity: 0.8;
          color: #f06b00;
        }
      }

      &.li-text_select {
        cursor: pointer;
      }
    }
  }
}
.aweb-container /deep/ .el-popper {
  top: 40px !important;
}
.mandate {
  /deep/ .el-dialog__header {
    padding: 0;
    margin: 0;
    height: 46px !important;
    background: rgba(254, 175, 3, 0.1);
    color: #333333;
    text-align: left;
    line-height: 46px;
    padding-left: 32px;
  }
  /deep/ .el-dialog__title {
    font-size: 14px;
    font-weight: 500;
  }
  .g_remind_content {
    height: 440px;
    overflow-y: auto;
  }
  .detail_conten_list {
    display: flex;
    padding: 20px;
  }
  .detail_conten_content {
    text-align: left;
    margin-left: 20px;
    width: calc(100% - 50px);
    .detail_conten_title {
       
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;
      font-weight: 500;
      padding-bottom: 10px;
    }
    .detail_conten_time,
    .detail_conten_remind {
      font-size: 13px;
       
      color: rgba(0, 0, 0, 0.65);
      letter-spacing: 0;
      font-weight: 400;
    }
    .detail_conten_time {
      padding-bottom: 10px;
    }
  }
  .line_div {
    width: 87%;
    border-bottom: 1px solid #f0f0f0;
    margin-left: 10%;
  }
}
/deep/ .el-dialog__footer {
  margin-top: 20px !important;
}
.popUp_span {
  margin-top: 20px;
  font-size: 18px;
}
</style>
