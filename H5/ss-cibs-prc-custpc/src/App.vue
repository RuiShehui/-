<!--
 * @Author: ZhangZhen
 * @Date: 2022-01-28 11:25:29
 * @LastEditTime: 2022-11-03 17:15:05
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\App.vue
-->
<template>
  <!-- :class="['isIE']" -->
  <!-- @mousemove="moveEvent" -->
  <!-- @contextmenu.prevent 开发环境不禁用鼠标右键 -->
  <div id="app" name="layout" :class="EnglisStyle" class="normal-theme" @mousemove="moveEvent">
    <router-view />
    <el-dialog
      :visible.sync="isShow"
      center
      top="0vh"
      :show-close="false"
      :title="$t('COMMON.TIPS')"
      custom-class="u-dialogClass"
    >
      <p class="mtb24">{{$t('HOME.AUTOMATICALLY_LOGGED_OFF')}}</p>
      <div slot="footer" class="flexc">
        <v-button size="w160" @click="onCancel" class="mr16">{{$t('COMMON.CANCEL')}}</v-button>
        <v-button
          size="w160"
          type="primary"
          @click="onConfirm"
        >{{$t('HOME.LOG_OFF_NOW')}}({{ btnSeconds }}s)</v-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import e2eeUtil from '@/utils/e2ee-util';
// import {isOperateFun} from '@/utils/astrict.js'
const { mapActions, mapState } = createNamespacedHelpers('app');
import { logoOut } from '@/api/login.js';

export default {
  name: 'app',
  data() {
    return {
      timer: null,
      currentTime: new Date().getTime(),
      EnglisStyle: false,
      lastTime: new Date().getTime(),
      btnSeconds: 30,
      interval: null,
      isShow: false,
      popstateTime: 0
    };
  },
  provide() {
    return {
      handleRedirect: this.handleRedirect
    };
  },
  computed: {
    ...mapState(['lang'])
  },
  wacth: {
    lang(o) {
      console.log(o, 'old');
    }
  },
  created() {},
  mounted() {
    // window.addEventListener('beforeunload', e => this.beforeundloadHandler(e)); // 页面刷新
    // window.addEventListener('load', () => {
    //   const state = {
    //     title: document.title,
    //     url: location.href
    //   }
    //   console.log('state',state)
    //   window.history.pushState(state, document.title, location.href)
    // })
    // window.addEventListener('popstate', (e) => { this.beforeundloadHandler(e)},false ) // 监听前进 后退 
    // 初始化端对端加密工具
    e2eeUtil.init();
    this.handleRedirect();
  },
  methods: {
    ...mapActions(['SET_LANG','SET_TOKEN']),
    moveEvent() {
      if (!this.isShow) {
        let path = window.location.href.split('#')[1];
        this.lastTime = new Date().getTime();
        if (path !== '/login') {
          clearTimeout(this.timer);
          this.btnSeconds = 30;
          window.clearInterval(this.interval);
          this.isOperateFun();
        }
      }
    },
    onCancel() {
      this.isShow = false;
      this.btnSeconds = 30;
      window.clearInterval(this.interval);
      clearTimeout(this.timer);
    },
    onConfirm() {
      this.isShow = false;
      window.clearInterval(this.interval);

      this.confirmLogOut();
    },
    setTime() {
      this.isShow = true;
      this.interval = setInterval(() => {
        --this.btnSeconds;
        // console.log('this.btnSeconds', this.btnSeconds);
        if (this.btnSeconds == 0) {
          this.isShow = false;
          window.clearInterval(this.interval);
          this.confirmLogOut();
        }
        return this.btnSeconds;
      }, 1000);
    },
    isOperateFun() {
      let self = this;
      let loadingTime = self.currentTime - self.lastTime;
      self.timer = setTimeout(() => {
        let newTime = new Date().getTime();
        let loadingTime = newTime - self.lastTime;
        // console.log('进入即使', newTime - this.lastTime);
        //  12 * 60 * 1000
        // if (loadingTime > 5 * 1000) {
        if (loadingTime > 12 * 60 * 1000) {
          this.setTime();
        } else {
          this.isOperateFun();
        }
      }, 1000);
    },
    confirmLogOut() {
      // this.moveEvent()
      clearTimeout(this.timer);
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('head');
      this.$store.commit('app/setSliderMenusAct', '');
      window.sessionStorage.clear();
      this.$router.replace({
        path: '/login?toLogin=1',
        // query: {
        //   toLogin: '1'
        // }
      });
      this.btnSeconds = 30;
    },
    handleRedirect() {
      // 用户登录后的token
      const token = sessionStorage.getItem('token');
      // 不用登录就能访问的路径
      const originList = ['login', '/login', '/login/firstLogin'];
      // 当前路径
      const currentRoute = this.$route.path;

      const isLogined = token && token.length;

      if (!isLogined) {
        if (!originList.includes(currentRoute)) {
          this.$router.replace('/login');
        }
      } else {
        if (originList.includes(currentRoute)) {
          this.$router.replace('/home');
        }
      }
    },
    beforeundloadHandler(e) {
      console.log('909009909');
      this.$store.commit('app/setSliderMenusAct', '');
      this.SET_TOKEN('');
      localStorage.removeItem('entType')
      localStorage.removeItem('quickMenuId')
      localStorage.removeItem('BANK_INFOS')
      localStorage.removeItem('quickMenu')
      localStorage.removeItem('quickDomain')
      localStorage.removeItem('user')
      localStorage.removeItem('COUNTRY_INFOS_KEY')
      sessionStorage.clear();
      this.$router.replace('/login');
    }
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeundloadHandler(e));
    window.removeEventListener('beforeunload', e => this.beforeundloadHandler(e),false);
  }
};
</script>

<style lang="scss">
@import './scss/aweb.scss';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: static !important;
  background: #f5f5f5;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif
}
// 細明體,
@media (min-width: 1440px) {
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    position: static !important;
    background: #f5f5f5;
    width: 100%;
  }
}
::v-deep ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #f3f3f3;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.35);
}
.u-dialogClass {
  text-align: center;
  max-width: 400px;
}
</style>
