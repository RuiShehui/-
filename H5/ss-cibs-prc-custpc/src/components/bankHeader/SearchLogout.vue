<template>
  <header class="header">
    <section class="logo-header">
      <div class="logo-wrapper">
        <img src="../../images/logo/LOGOS.png" :alt="$t('PAYMENT.CHUANGXING_BANK')" />
      </div>

      <div class="operatesWrapper">
        <div class="m-nav-item">
          <LangSwitch class="u-langSwitch" />
        </div>
        <el-link
          class="logout link-box"
          :underline="false"
          @click="handleLogout"
        >
          <i class="icon-box"></i>
          <span class="f-loginOut">{{$t('HOME.SAFE_LOGONOUT')}}</span>
        </el-link>
      </div>
    </section>
  </header>
</template>

<script>
// import PopUp from '../common/PopUp.vue';
import { createNamespacedHelpers } from 'vuex';
import LangSwitch from '../common/LangSwitch.vue';
import { logoOut } from '@/api/login.js';
import {
  getUser,
  getBranch,
  removeToken,
  removeUser,
  removeUserInfo,
  removeNeedUpdatePassword,
  setNeedUpdatePassword
} from '@/utils/user';
const { mapActions } = createNamespacedHelpers('app');

export default {
  name: 'SearchLogout',
  components: {
    // PopUp,
    LangSwitch
  },
  computed: {
    retreatSafely() {
      return this.$t('home.retreatSafely');
    }
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['SET_TOKEN']),
    handleLogout() {
      this.$confirm({
        title: '',
        isIcon: true,
        type: 'loginOut',
        message: this.$t('HOME.PERSONAL_INTERNET_BANKING'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('HOME.LOG_OFF_NOW')
        },
        isCancle: true
      }).then(() => {
        logoOut().then(({ head = {} }) => {
          const { returnCode } = head;
          if (returnCode === '000000') {
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
            return;
          }
        }).catch(err=>{
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
            return;
        });

      });
    },
   

    gotoManagement() {
      this.$router.push('/securityCenter/index');
    }
  }
};
</script>

<style lang="scss" scoped>
.logo-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px 0 12px 0;
  background: #fff;
  .logo-wrapper {
    display: flex;
    img {
      // padding: 16px;
      width: 145px;
      // height: 100%;
    }
  }
  .operatesWrapper {
    display: flex;
    align-items: center;
    .select {
      border-radius: 15px;
    }
    .m-nav-item {
      font-size: 16px;
      margin-left: 40px;

      .u-nav-item_span {
        font-size: 16px;
         
        color: rgba(0, 0, 0, 0.85);
        letter-spacing: 0;
        text-align: center;
        font-weight: 400;
      }
      .u-nav-item_span:hover {
        color: #f06b00;
        cursor: pointer;
      }
    }
    .operatesWrapper:hover {
      color: #f06b00;
      cursor: pointer;
    }
    .service-center {
      .icon-box {
        background-image: url('../../images/home/serviceCenter.svg');
      }
    }
    .logout {
      .icon-box {
        background-image: url('../../images/home/exitSafely.svg');
      }
    }
    .service-center:hover {
      .icon-box {
        background-image: url('../../images/home/serviceCenter-cur.svg');
      }
    }
    .logout:hover {
      text-decoration: none !important;
      color: #f06b00;
      .icon-box {
        background-image: url('../../images/home/exitSafely-cur.svg');
      }
    }
    .service-center,
    .logout {
      margin-left: 30px;
      .icon-box {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
    }
  }
}
:v-deep .el-link--inner:hover {
  text-decoration: none !important;
}
.popUp {
  img {
    // margin-top: 50px;
    width: 60px;
    height: 60px;
  }
  p {
    margin-top: 25px;
     
    font-size: 16px;
    color: #1b1b1b;
    letter-spacing: 0;
    font-weight: 400;
  }
}
</style>

<style lang="scss">
// .operatesWrapper {
//   .link-box {
//     .el-link--inner {
//       display: flex;
//       align-items: center;
//       img {
//         width: 16px;
//         display: block;
//         margin-right: 4px;
//       }
//     }
//   }
// }
</style>
