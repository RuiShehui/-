<!--
 * @Author: your name
 * @Date: 2021-12-09 09:38:15
 * @LastEditTime: 2022-05-31 17:37:10
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \webbank-pc\src\views\seriveQuery\download.vue
-->
<template>
  <div >
    <div class="u-head">
        <div style="padding-left: 16px;">{{$t('INTERESTRATEQUERY.APP_DOWNLOAD')}}</div>
        <div class="u-headBottom"></div>
      </div>
    <div class="g-download-wrapper">
      <div class="m-qrcode-wrapper">
        <img class="u-qrcode" v-if="!url" src alt />
        <div id="qrcode" ref="qrcode"></div>
        <img v-if="url" class="u-logo" src="@/images/seriveQuery/chuangxing.png" alt />
      </div>
      <p>{{$t('INTERESTRATEQUERY.SCAN')}}</p>
    <p class="m-iphone">iphone & Android</p>
    </div>

    
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import { downLoadApp } from '@/api/serveQuery';

export default {
  data() {
    return {
      url: ''
    };
  },
  mounted() {
    this.getUrl();
  },
  methods: {
    getUrl() {
      //TODO 不调用接口，前端写死url
      this.url = 'https://www.baidu.com'
      this.createCode();
    },
    createCode() {
      this.$refs.qrcode.innerHTML = '';
      var qrcode = new QRCode(this.$refs.qrcode, {
        text: this.url,
        width: 80,
        height: 80,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    }
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
    width: 80px;
    height: 80px;
    position: relative;
    .u-logo {
      position: absolute;
      width: 24px;
      height: 24px;
      top: calc(50% - 12px);
      left: calc(50% - 12px);
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
  box-shadow: inset 0px -1px 0px 0px rgba(240,240,240,1);
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
</style>