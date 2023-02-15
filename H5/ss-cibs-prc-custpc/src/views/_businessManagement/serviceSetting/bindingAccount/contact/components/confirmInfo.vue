<template>
  <div class="confirmInfo" v-loading="disabled">
    <div class="confirmContent mt36">
      <detail-item :title="$t('AUTHORIZE.AUTH_CUSTOMER')" :content="confirmInfo.customerNameDesen" />
      <detail-item
        v-show="confirmInfo.bindingType === '1'"
        :title="$t('USER_MANAGEMENT.USER_EMAIL')"
        :content="confirmInfo.numberDesen"
      />
      <detail-item
        v-show="confirmInfo.bindingType === '2'"
        :title=" $t('AUTHORIZE.AUTH_MOBILE')"
        :content="confirmInfo.numberDesen"
      />
      <detail-item :title="$t('AUTHORIZE.AUTH_BINDHKD')" :content="confirmInfo.bindAccount" />
      <detail-item :title="$t('AUTHORIZE.AUTH_BINDCNY')" :content="confirmInfo.raccountNo" />
      <detail-item
        :title="$t('PAYMENT.PRESET_PAYEE_ACCOUNT')"
        :content="confirmInfo.presetAcct === '0' ? this.$t('AUTHORIZE.YES') : this.$t('AUTHORIZE.NO')"
      />
      <detail-item
        v-show="confirmInfo.bindingType === '1'"
        :title="$t('AUTHORIZE.AUTH_CHANNELMOILBLE')"
        :content="confirmInfo.otherChannelsDesen"
      />
      <detail-item
        v-show="confirmInfo.bindingType === '2'"
        :title="$t('AUTHORIZE.AUTH_CHANNELEMAIL')"
        :content="confirmInfo.otherChannelsDesen"
      />
    </div>
    <el-form class="u-w400" :model="confirmInfo" ref="confirmInfo" :rules="rules">
      <div style="display:flex">
        <el-form-item :label="$t('SOFT_TOKEN.OTP')" prop="code" class="msgInline">
          <el-input
            maxlength="6"
            minlength="6"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D\g,'')"
            v-model="confirmInfo.code"
            :placeholder="$t('FUND.PLEASE_INPUT_MESSAGENO')"
            class="mr16"
          ></el-input>
        </el-form-item>
        <VButton
          :style="{ overflow: 'hidden' }"
          size="wMin160"
          style="margin-left:20px;margin-top:16px"
          :disabled="isdisabled"
          @click="getEmailCode"
        >{{btnValue}}</VButton>
      </div>
    </el-form>
    <el-row class="flexc mt36">
      <v-button class="mr16" @click="$emit('back')">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
      <v-button type="primary" :disabled="disabled" @click="confirm">{{ $t('COMMON.CONFIRM') }}</v-button>
    </el-row>
  </div>
</template>
<script>
import { sendOtp, validOtp } from '@/api/sendOTP';
export default {
  props: {
    confirmInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isdisabled: false,
      disabled: false,
      btnValue: this.$t('COMMON.GET_VR_CODE'),
      rules: {
        code: [
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
      smsCode: ''
    };
  },
  created() {
    // this.getRandomNum()
  },
  mounted() {},
  methods: {
    async confirm() {
      let custNo = sessionStorage.getItem('custNo');
      let params = {
        otpType: '09040203',
        custNo: custNo,
        code: this.confirmInfo.code,
        otpMode: 'otp',
        refNum: this.smsCode
      };
      this.disabled = true;

      const res = await validOtp(params);
      console.log(res,'res')
      const returnCode =res.head.returnCode
      if(returnCode ==='OTP000113'){
        this.$emit('back')
      }else{
        this.$refs['confirmInfo'].validate(valid => {
        if (valid) {
          this.disabled = false;
            if (res.body) {
              sessionStorage.setItem('otpToken', res.body);
              this.$emit('confirm', this.confirmInfo);
            }
        } else {
          console.log('error submit');
          return false;
        }
      });
      }
      // this.$emit('confirm', this.confirmInfo);
      
    },

    //发送短信
    getEmailCode() {
      let custNo = sessionStorage.getItem('custNo');
      let params = {
        otpType: '09040203',
        custNo: custNo,
        otpMode: 'otp',
        refNum: this.smsCode
      };
      sendOtp(params).then(res => {
        if (res.body) {
          this.smsCode = res.body.refNum;
          this.time();
          this.$message({
            type: 'success',
            message: this.$t('USER_MANAGERMENT.SEND_SCUSS'),
            delay: 3000
          });
        } else {
          this.$message({
            type: 'fail',
            message: this.$t('USER_MANAGERMENT.SEND_FAIL'),
            delay: 3000
          });
        }
      });
    },
    time(o) {
      let wait = 100;
      this.isdisabled = true;
      this.sendEmail = true;
      let interval = window.setInterval(() => {
        this.btnValue = this.$t('FIRST_LOGIN.GET_ANAIN', {
          time: wait
        });
        --wait;
        if (wait < 0) {
          this.btnValue = this.$t('USER_MANAGERMENT.SEND');
          wait = 100;
          this.isdisabled = false;
          this.sendEmail = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
    // 短讯编号
    getRandomNum() {
      let randomStr = Math.random()
        .toFixed(3)
        .slice(-3);
      return (this.smsCode = randomStr);
    }
  }
};
</script>
<style lang="scss" scoped>
.confirmContent {
  width: 940px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 82px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
.msgInline {
  display: flex;
  margin-top: 16px;
  margin-left: 82px;
  // align-content: center;
  // justify-content: center;
  .otp {
    width: 140px;
    text-align: right;
    margin-right: 14px;
    height: 22px;

    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    line-height: 32px;
    font-weight: 400;
  }
  /deep/ .el-input__inner {
    width: 180px;
    height: 36px;
  }
  /deep/ .el-button {
    border: 1px solid #f06b00;
    border-radius: 4px;
    color: #f06b00;
  }
  .mr16 {
    width: 175px;
  }
}
// /deep/ .el-form-item .el-form-item__label {
//   position: relative;
//   left: 80px;
// }
// /deep/ .itemContent .itemRight {
//   position: relative;
//   left: 10px;
// }
</style>