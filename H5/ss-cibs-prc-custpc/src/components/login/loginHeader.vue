<!--
 * @Author: your name
 * @Date: 2021-11-29 09:22:04
<<<<<<< HEAD
 * @LastEditTime: 2022-11-09 14:43:42
=======
 * @LastEditTime: 2022-11-07 11:40:25
>>>>>>> b3851da199852d1f3ee3a88664bd0c286b97f776
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\login\loginHeader.vue
-->
<template>
  <div class="g-loginHeader">
    <div class="g-header-wrapper">
      <header class="u-header">
        <div class="logo-wrapper">
          <img src="../../images/logo/LOGOS.png" :alt="$t('PAYMENT.CHUANGXING_BANK')" />
        </div>
        <div class="m-nav">
          <div class="m-nav-item"></div>
          <div class="m-nav-item">
            <span class="u-nav-item_span" @click="operationGuid">{{ $t('LOGON.OPERATION_GUIDELINES') }}</span>
          </div>
          <div class="m-nav-item">
            <lang-switch />
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<script>
import langSwitch from '../common/LangSwitch';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');
export default {
  components:{
     langSwitch
  },
   created() {
    this.SET_LANG();
  },
  computed: {
    ...mapState(['lang'])
  },
  methods:{
    ...mapActions(['SET_LANG']),
    operationGuid(){
       let lang = '';
      if (this.lang == 'zh-CN') {
        lang = 'CHI';
      } else if (this.lang == 'zh-HK') {
        lang = 'SCH';
      } else {
        lang = 'ENG';
      }
      let url = `./html/EC_CUS_User_Manual_${lang}_v1.pdf`
      window.open(url)
    }
  }
 
};
</script>

<style lang="scss" scoped>
.g-loginHeader {
  height: 60px;
  background: #fff;
}
.logo-wrapper {
  display: flex;
  img {
    // padding: 16px;
    width: 145px;
    // height: 100%;
  }
}
.g-header-wrapper {
  line-height: 66px;
  height: 60px;
  padding: 0;
  width: 100%;
}

.u-header {
  margin: 0 auto;
  padding: 10px 0;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // border-bottom: 1px solid black;
  .m-header_img {
    width: 233px;
    margin-left: 120px;
    // height: 30px;
  }

  .m-nav {
    display: flex;
    align-items: center;
    padding-right: 120px;
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
}
</style>
