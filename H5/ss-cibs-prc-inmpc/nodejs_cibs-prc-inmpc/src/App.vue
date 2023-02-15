<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-08 10:18:22
 * @LastEditTime: 2022-11-08 10:15:21
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\App.vue
-->
<template>
  <div id="app" :class="classList" name="layout" @mousemove="moveEvent" @click="moveEvent">
    <router-view />
  </div>
</template>

<script>
import { removeToken, removeRoleDetail } from '@/utils/user';
import { isIE, isIE11 } from '@/utils/tools';

export default {
  name: 'App',
  data() {
    return {
      timer: null,
      currentTime: new Date().getTime(),
      lastTime: new Date().getTime()
    };
  },
  computed: {
    /** 当前是否需要兼容IE */
    isPolyIE() {
      if (isIE() || isIE11()) {
        return true;
      }
      return false;
    },
    classList() {
      const classList = [];
      if (this.isPolyIE) {
        classList.push('isIE');
      }

      return classList;
    }
  },
  created() {
    if (this.isPolyIE) {
      document.querySelector('body').setAttribute('class', 'isIE');
    }
  
    if(window.location.hash.split('?')[1].split('=')[0]){
      let flowNo = window.location.hash.split('?')[1].split('=')
      console.log(flowNo,'flowNo')
      sessionStorage.setItem('specialInstruction', flowNo[1])
    }else{
      sessionStorage.setItem('specialInstruction','')
    }
   
    // window.addEventListener(
    //   'click',
    //   () => {
    //     sessionStorage.setItem('lastClickTime', new Date().getTime().toString());
    //   },
    //   true
    // );
  },
  async mounted() {
    // console.log('1----------------------------1')
    this.init();
  },
  methods: {
    init() {
      let newTime = new Date().getTime();
      // console.log('进入计时', newTime - this.lastTime);
      this.timer = setTimeout(() => {
        // 7 * 60 * 1000
        const isTip = newTime - this.lastTime > 7 * 60 * 1000;
        // console.log(isTip)
        if (isTip) {
          //提示弹框
          this.$showBox({
            content: '您的会话即将超时',
            // content: this.$t('COMMON.OVERTIME_TIPS'),
            confirm: () => this.confirmUse(),
            cancel: () => this.confirmLogOut(),
            removeDelay: 3 * 60 * 1000 + 1000
          });
          this.handleLogout();
        } else {
          this.init();
        }
      }, 1000);
    },
    moveEvent() {
      let path = window.location.href.split('#')[1];
      // console.log('path', path);
      this.lastTime = new Date().getTime();
      if (['/login', 'login'].includes(path)) {
        clearTimeout(this.timer);
        this.init();
      }
    },

    confirmUse() {
      // this.moveEvent();
      // this.init();
      // console.log(this.timer,'timer')
      // let newTime =this.lastTime - this.currentTime
      // console.log(newTime,'newTime')
      // clearInterval(this.timer);
    },

    handleLogout() {
      let newTime = new Date().getTime();
      // console.log('打印newTime,lastTime', newTime, this.lastTime);0 * 60 * 1000
      this.timer = setTimeout(() => {
        if (newTime - this.lastTime > 10 * 60 * 1000) {
          this.confirmLogOut();
        } else {
          this.handleLogout();
        }
      }, 1000);
    },

    //取消关闭弹框，跳转到登录页
    confirmLogOut() {
      // clearStorage
      removeToken();
      removeRoleDetail();
      this.$store.commit('tabs/DELETE_ALL_TABS');
      this.$router.replace('/login');

      //清除定时器，结束任务
      clearInterval(this.timer);
    }
  }

  //销毁任务
  // destroyed() {
  //   clearInterval(this.timer);
  //   window.removeEventListener('click', () => {}, true);
  // }
};
</script>

<style lang="scss">
@import './scss/aweb.scss';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
}
.g-op-btn {
  margin: 0 5px !important;
  padding: 0 !important;
  width: 66px !important;
  height: 10px !important;
}
::-webkit-scrollbar {
  width: 0.5em;
  height: 0.5em;
  background-color: transparent;
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.35);
}
.el-tabs--border-card {
  background: none !important;
  border-color: transparent;
  box-shadow: none;
}
.aweb-ctt {
  padding: 0 !important;
}
</style>
