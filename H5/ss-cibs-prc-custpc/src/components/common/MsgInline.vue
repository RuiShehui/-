<!--
 * @Author: zhangcheng
 * @Date: 2022-01-27 16:11:31
 * @LastEditTime: 2022-09-16 16:08:34
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\common\MsgInline.vue
-->
<template>
  <div class="msgLnline">
    <el-button @click="sendCode" :disabled="disabled">{{btnText}}</el-button>
  </div>
</template>
<script>
import { sendOtp, validOtp } from '@/api/sendOTP.js';
export default {
  props: {
    countDown: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      time: 0,
      btnText: this.$t('COMMON.GET_VR_CODE'),
      disabled: false
    };
  },
  computed: {},

  methods: {
    //请求成功才发起倒计时
    async sendCode() {
      console.log('验证点击获取');
      let custNo = sessionStorage.getItem('custNo')
      let params = {
        otpType: 'FUND_SMS',
        target: '',
        custNo:custNo
      };
      const result = await sendOtp(params);
      console.log(result,'result')
      if (result.head.returnCode === '000000') {
        sessionStorage.setItem('otpToken',result)
           this.$emit('send');
      }
   
    },
    // 倒计时函数
    countDownClock() {
      this.disabled = true;
      this.btnText =this.$t('FIRST_LOGIN.GET_ANAIN',{
        time:this.time
      });
      let timer = setInterval(() => {
        this.time--;
        this.btnText =this.$t('FIRST_LOGIN.GET_ANAIN',{
        time:this.time
      });
        if (this.time === 0) {
          this.disabled = false;
          this.btnText = this.$t('FIRST_LOGIN.GET_VERIFICATION_CODE');
          this.time = this.countDown;
          clearInterval(timer);
        }
      }, 1000);
    }
  },
  mounted() {
    this.time = this.countDown;
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-button {
  padding: 0;
}
</style>