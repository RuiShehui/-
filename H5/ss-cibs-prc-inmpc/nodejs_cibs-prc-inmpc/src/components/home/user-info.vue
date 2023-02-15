<!--
 * @Autor: 朱涛
 * @Date: 2021-11-11 09:49:36
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-21 15:44:30
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\home\user-info.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <!-- <div> -->
  <div class="header">
    <div class="header-main">
      <img class="head-portrait" src="@/img/indexPage/avatar3.png" />
      <div class="header-info">
        <div class="text-top">
          <span class="top-name">{{ welcomeConent }}</span>
          <span class="top-role">
            <img src="@/img/indexPage/role-icon1.png" class="role-icon" />
            <span class="role-name">{{ roleName }}</span>
          </span>
          <span
            class="role-message"
            v-if="isRemind"
            @click="onClickRemind"
          >{{ `${$t('HOME.YOU_HAVE')} ${remindTips} ${$t('HOME.INFORMATION_UNREAD')}` }}</span>
        </div>
        <footer class="text-bottom">{{$t('HOME.LOGIN_LAST_TIME')}}{{ loginTime }}</footer>
      </div>
    </div>
    <img src="@/img/indexPage/home-bg-right1.png" class="right-img" />
  </div>
  <!-- <div class="g-conent_top">
      <div class="m-user-avatar">
        <img class="u-img_left" :src="avaterImg" />
      </div>
      <div class="m-main-content">
        <div>
          <span class="m-greet-top">{{ welcomeConent }}</span>
          <span
            class="m-remind"
            v-if="isRemind"
            @click="onClickRemind"
          >{{ `${$t('HOME.YOU_HAVE')} ${remindTips} ${$t('HOME.INFORMATION_UNREAD')}` }}</span>
        </div>
        <div class="m-role-info">
          <span class="m-role">{{ roleName }}</span>
        </div>
        <div class="m-logintime-info">
          <span class="m-login_time">{{ $t('HOME.LOGIN_LAST_TIME') }}</span>
          <span class="m-login_time">{{ loginTime }}</span>
        </div>
      </div>
  </div>-->
  <!-- </div> -->
</template>

<script>
import { getUserInfo, getUserMessage, getUserMessageCount } from '@/api/home';
import { getRoleDetail } from '@/utils/user';
export default {
  name: 'UserInfo',
  inject: ['remind'],
  data() {
    return {
      avaterImg: require('@/img/home/head-portrait.png'), // 头像
      welcomeConent: '', // 欢迎登录用户
      remindTips: '',
      roleName: '', // 登录角色名称
      loginTime: '', // 上次登录时间
      userBaseInfo: {} // 保存用户基本信息
    };
  },
  computed: {
    isRemind() {
      if (this.remindTips && this.remindTips > 0) {
        return true;
      }
      return false;
    }
  },
  watch: {},
  mounted() {
    this.init();
  },
  beforeDestory() {
    this.$eventBus.$off('tipsInfo');
    this.$eventBus.$off('langSwitch');
    this.$eventBus.$off('changeRole');
  },
  methods: {
    init() {
      this.getUserInfo();
      this.getUserNew();

      this.$eventBus.$on('tipsInfo', () => {
        this.getUserNew();
      });

      this.$eventBus.$on('langSwitch', () => {
        let timeHello = this.getCount();
        this.welcomeConent = this.userBaseInfo.userRealName + timeHello;
      });

      this.$eventBus.$on('changeRole', data => {
        this.roleName = data;
      });
    },
    //获取用户信息
    getUserInfo() {
      let self = this;
      let userInfo = getRoleDetail();
      // console.log('getRoleDetail', getRoleDetail());
      self.roleName = userInfo.roleName;
      getUserInfo().then(resp => {
        // console.log('用户信息', resp, JSON.parse(userInfo).roleName);
        if (resp.body) {
          self.userBaseInfo = resp.body;
          self.loginTime = resp.body.lastLoginSuccTime;
          let timeHello = self.getCount();
          self.welcomeConent = resp.body.userRealName + timeHello;
        }
      });
    },

    //获取当前时间，判断上午/下午/晚上
    getCount() {
      const self = this;
      let timeTips = '';
      let date = new Date();
      if (date.getHours() > 0 && date.getHours() < 12) {
        timeTips = self.$t('LOGIN.GOOD_MORNING');
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        timeTips = self.$t('LOGIN.GOOD_AFTERNOON');
      } else {
        timeTips = self.$t('LOGIN.GOOD_EVENING');
      }
      return timeTips;
    },

    // 获取用户消息数
    async getUserNew() {
      const result = await getUserMessageCount(),
        { body } = result;

      console.log(body);

      this.remindTips = body;
    },
    // 点击消息提示
    onClickRemind() {
      this.remind();
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 140px;
  position: relative;
  background: #fff;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-image: url('~@/img/indexPage/home-bg1.png');
  background-repeat: no-repeat;
  .header-main {
    height: 68px;
    display: flex;
    align-items: center;
    .head-portrait {
      width: 100px;
      height: 100px;
      margin-left: 40px;
      margin-top: 28px;
      margin-bottom: 12px;
      margin-right: 24px;
    }
    .header-info {
      display: flex;
      height: 60px;
      flex-direction: column;
      justify-content: space-between;
      .text-top {
        display: flex;
        align-items: center;
        height: 30px;
        line-height: 30px;
        .top-name {
          font-weight: 5500;
          color: rgba(0, 0, 0, 0.85);
          font-size: 22px;
        }
        .top-role {
          display: flex;
          align-items: center;
          height: 24px;
          padding: 0px 8px;
          box-sizing: border-box;
          color: white;
          font-size: 12px;
          background-image: linear-gradient(to right, #e47f36, #f7550a);
          border-radius: 3px;
          margin-left: 14px;
          .role-icon {
            width: 11px;
            height: 12px;
            margin-right: 6px;
          }
          .role-name {
            line-height: 14px;
          }
        }
        .role-message {
          color: #e01f1f;
          font-size: 16px;
          font-weight: 600;
          text-decoration: underline;
          margin-left: 24px;
          cursor: pointer;
        }
      }
      .text-bottom {
        height: 20px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
  .right-img {
    position: absolute;
    right: 44px;
    bottom: 0px;
  }
}
.g-conent_top {
  display: flex;
  margin: 0;
  // width: 1124px;
  height: 164px;
  background-image: linear-gradient(90deg, #ffffff 1%, #fff6ef 96%);
  border-radius: 4px;
  .m-user-avatar {
    margin-top: 32px;
    margin-left: 64px;
    width: 100px;
    height: 100px;
    .u-img_left {
      width: 100px;
      height: 100px;
    }
  }
  .m-main-content {
    margin-left: 24px;
    margin-top: 39px;
    .m-greet-top {
      height: 30px;
       
      font-size: 22px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;
      font-weight: 500;
    }
    .m-remind {
      color: red;
      padding-left: 30px;
      cursor: pointer;
    }
  }
  .m-role-info {
    margin-top: 11px;
    width: 150px;
    height: 22px;
    background: rgba(240, 107, 0, 0.1);
    text-align: center;
    .m-role {
      line-height: 22px;
      text-align: center;
      height: 17px;
       
      font-size: 12px;
      color: #f06b00;
      letter-spacing: 0;
      font-weight: 400;
    }
  }
  .m-logintime-info {
    margin-top: 9px;
    .m-login_time {
      height: 17px;
       
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      letter-spacing: 0;
      font-weight: 400;
    }
  }
}
</style>
