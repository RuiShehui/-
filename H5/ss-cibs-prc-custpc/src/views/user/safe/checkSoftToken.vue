<!--
 * @Author: your name
 * @Date: 2022-06-18 18:03:30
 * @LastEditTime: 2022-08-24 11:54:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\user\safe\checkSoftToken.vue
-->
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('MOBILE_TOKEN.MOBILE_TOKEN_REGISTRATION')" name="first">
        <div class="u-content">
          <p class="u-title">{{$t('MOBILE_TOKEN.REGISTRATION_PROCESS')}}</p>
          <ul class="u-conten">
            <li>{{$t('MOBILE_TOKEN.COLLECT_YOUR_FACE')}}</li>
            <li>{{$t('MOBILE_TOKEN.MOBILE_DEVICE_READY')}}</li>
            <li>{{$t('MOBILE_TOKEN.DOWNLOAD_OR_UPDATE')}}</li>
          </ul>
          <p class="tips">{{$t('MOBILE_TOKEN.SCAN_THE_QR_CODE')}}</p>
        </div>
        <div class="u-btn">
          <!-- <VButton>取消</VButton> -->
          <VButton size="w210" type="primary" @click="submit()">{{$t('COMMON.CONFIRM')}}</VButton>
        </div>
        <div class="u-tips">
          <p class="u-title">{{$t('COMMON.TIPS')}}</p>
          <ul class="u-conten">
            <li>{{$t('MOBILE_TOKEN.COLLECT_YOUR_FACE')}}</li>
            <li>{{$t('MOBILE_TOKEN.ACTIVATED_ONLINE_HIGH_RISK')}}</li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    };
  },
  methods:{
    submit(){
      console.log(111,'2')
      this.$router.push('/user/safe/erweima')
    }
  }
};
</script>

<style lang="scss" scoped>
.u-title {
  font-size: 14px;
  color: #000;
  font-weight: 400;
}
.u-content {
  margin: 0 auto;
  margin-top: 36px;

  .tips {
    font-size: 12px;
    color: rgba($color: #000000, $alpha: 0.45);
    line-height: 20px;
  }
}
.u-btn {
  margin-top: 36px;
  margin-left: 38%;
}
.u-tips {
  margin-top: 180px;
}
.u-conten {
  margin-top: 18px;
  margin-bottom: 14px;
  font-size: 12px;
  color: rgba($color: #000000, $alpha: 0.45);
  line-height: 20px;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00 !important;
}
/deep/ .el-tabs__active-bar{
  background-color: #f06b00 !important;
}
</style>