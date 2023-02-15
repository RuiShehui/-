<!--
 * @Author: your name
 * @Date: 2021-12-09 09:38:15
 * @LastEditTime: 2022-08-24 11:50:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webbank-pc\src\views\seriveQuery\download.vue
-->
<template>
  <div>
    <div class="u-head">
      <div style="padding-left: 16px;">{{$t('MOBILE_TOKEN.MOBILE_TOKEN_REGISTRATION')}}</div>
      <div class="u-headBottom"></div>
    </div>
    <div class="g-download-wrapper">
      <div class="m-qrcode-wrapper">
        <img class="u-qrcode" v-if="!url" src alt />
        <div id="qrcode" ref="qrcode"></div>
        <!-- <img v-if="url" class="u-logo" src="@/images/seriveQuery/chuangxing.png" alt /> -->
      </div>
      <!-- <p>{{$t('DOWNLOAD.SCAN_CODE')}}</p> -->
      <p>{{$t('MOBILE_TOKEN.GENERATE_NEW')}}</p>
      <!-- <p class="m-iphone">iphone & Android</p> -->
    </div>
    <div class="u-btns">
      <V-Button size="w160"  @click="back">{{$t('COMMON.CANCEL')}}</V-Button>
      <V-Button  size="w160"  style="margin-left:12px;"  :disabled="isDisabled" @click="changeErweima">{{btnValue}}</V-Button>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
// import { downLoadApp } from '@/api/serveQuery';
import {registerQRCode} from '@/api/public'
export default {
  data() {
    return {
      url: '',
      tfaStatus: {},
      isShow: false,
      isTrue: false,
      activName: 'first',
      btnValue:this.$t('MOBILE_TOKEN.Refresh_QR_Code'),
      isDisabled:false,
      interval:null
    };
  },
  
  mounted() {
    //  this.getUrl();
    this.getregisterQRCode()
  },
  
  methods: {
    changeErweima(){
      this.getregisterQRCode()
      this.isDisabled=true
      this.time()
    },
    getregisterQRCode(){
      registerQRCode().then(res=>{
        console.log(res,'res')
        this.url = res
        this.createCode();
      })
    },
    // async getUrl() {
    //   const body = await downLoadApp()
    //   if(body) {
    //     this.url = body.appUrl
    //     this.createCode();
    //   }
    // },
    getUrl() {
      //TODO 不调用接口，前端写死url
      // this.url = 'ynet_moblie_security/moblie_security/step_st.html';
      this.url = 'ynet_mobile_security/index/index.html';
      this.createCode();
    },
    createCode() {
      this.$refs.qrcode.innerHTML = '';
      var qrcode = new QRCode(this.$refs.qrcode, {
        text: this.url,
        width: 160,
        height: 160,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    back() {
      this.$router.replace('/home');
    },
     time(o) {
      let wait = 60;
      this.interval=window.setInterval(() => {
        this.btnValue = this.$t('FIRST_LOGIN.GET_ANAIN', {
          time: this.wait
        });
        --wait;
        if (wait == 0) {
           this.isDisabled=false
          this.btnValue =this.$t('FIRST_LOGIN.SEND_AGNIN');
          wait = 60;
          window.clearInterval( this.interval);
        }
      }, 1000);
    },
  },
  destroyed(){
     window.clearInterval( this.interval);
  }
};
</script>

<style lang="scss" scoped>
.g-download-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  background-color: #fffcf5;
  .m-qrcode-wrapper {
    // width: 80px;
    // height: 80px;
    position: relative;
    .u-logo {
      position: absolute;
      width: 24px;
      height: 24px;
          top: calc(50% - -25px);
    left: calc(50% - -30px);
    }
  }

  p {
    margin-top: 8px;
    font-size: 14px;
    color: #333333;
  }
  .m-iphone {
    margin-top: 6px;
  }
}
.u-qrcode {
  position: absolute;
  height: 80px;
  width: 80px;
}
.u-head {
  position: relative;
  margin-bottom: 20px;
  font-size: 18px;
  color: #f06b00;
  letter-spacing: 0;
  line-height: 26px;
  font-weight: 500;
  padding: 2px 0 9px;
  box-shadow: inset 0px -1px 0px 0px rgba(240, 240, 240, 1);
}

.u-headBottom:before {
  content: '';
  width: 140px;
  height: 3px;
  background: #f06b00;
  position: absolute;
  bottom: 0;
  left: 0;
}
.u-btns {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.u-erweima{
    color: #fff !important;
    // width: 70px;
    // height: 36px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
}
</style>