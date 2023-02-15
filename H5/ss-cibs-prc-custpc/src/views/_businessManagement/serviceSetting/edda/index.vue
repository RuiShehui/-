<template>
  <div class="edda">
    <router-view></router-view>
  </div>
</template>
<script>
import { sendOtp, validOtp } from '@/api/sendOTP';
import { isAddZero } from '@/utils/tools';
// import validOTP from '@/components/common/otpComponents/index.vue';a
// import OperateResult from '@/components/common/operateResult';
export default {
  components: {
    // OperateResult
  },
  data() {
    return {
      isdisabled: false,
      btnValue: this.$t('COMMON.GET_VR_CODE'),
      formData: {
        messageNo: '100085',
        detail: this.$t('USER_MANAGERMENT.ELE_DIR_DED_AUTH'),
        verificationCode: '' //验证码
      },
      rules: {
        verificationCode: [
          {
            required: true,
            message: this.$t('USER_MANAGERMENT.INPUT_MESSAGE'),
            trigger: 'blur'
          },
          {
            min: 6,
            max: 6,
            message: this.$t('USER_MANAGERMENT.LENGTH_LIMIT'),
            trigger: 'blur'
          }
        ]
      },
      refid: '', // 请求发送短信接口返回数据
     
      isResult: false,
      isEdda: true,
      wait: 100
    };
  },
  created() {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    confirm() {
      let custNo = sessionStorage.getItem('custNo');
      this.$refs['formData'].validate(async valid => {
        if (valid) {
          let params = {
            target: '',
            custNo: custNo,
            code: this.formData.verificationCode,
            otpType: '090404',
            otpMode: 'otp'
          };
          validOtp(params).then(res => {
            console.log(res, 'otp');
            if (res.body) {
              sessionStorage.setItem('otpToken', res);
              this.$router.push(
                '/_businessManagement/serviceSetting/edda/elePayment'
              );
            }
            if (res.head.returnCode == 'OTP000113') {
              this.isEdda = false;
              this.isResult = true;
            }
          });
        } else {
          console.log('error submit!');
          return false;
        }
      });
    },
    send() {},
    backTo() {
      this.isEdda = true;
      this.isResult = false;
      // this.formData.verificationCode = ''
      this.$set(this.formData, 'verificationCode', '');
      window.clearInterval(this.interval);
      this.btnValue = this.$t('COMMON.GET_VR_CODE');
      this.isdisabled = false;
      this.sendEmail = false;
      // this.wait = 100
    },
    getEmailCode() {
      let custNo = sessionStorage.getItem('custNo');
      let params = {
        target: '',
        custNo: custNo,
        otpType: '090404',
        otpMode: 'otp'
      };
      this.time();
      sendOtp(params).then(res => {
        console.log(res, 'result');
        if (res.body) {
          this.$message({
            type: 'success',
            message: this.$t('USER_MANAGERMENT.SEND_SCUSS'),
            delay: 3000
          });
        }
      });
    },
    time(o) {
      // let wait = 100;
      this.isdisabled = true;
      this.sendEmail = true;
      this.interval = window.setInterval(() => {
        this.btnValue = this.$t('FIRST_LOGIN.GET_ANAIN', {
          time: this.wait
        });
        --this.wait;
        if (this.wait < 0) {
          this.btnValue = this.$t('COMMON.GET_VR_CODE');
          this.wait = 100;
          this.isdisabled = false;
          this.sendEmail = false;
          window.clearInterval(this.interval);
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>