<template>
  <div class="u-checkEmail">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="245px" class="u-formData">
      <!-- 短信編碼 -->
      <el-form-item :label="$t('SOFT_TOKEN.SMS_CODE')">
        <el-input :disabled="true" v-model="smsCode"></el-input>
      </el-form-item>
      <!-- otp驗證碼 -->
      <el-form-item
        :label="$t('FIRST_LOGIN.MOBIE_VERIFICATION_CODE')"
        class="u-emailCode"
        prop="otp"
      >
        <el-input
          v-model="formData.otp"
          :disabled="checkOTP"
          @blur="changOtp"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:this.$t('FIRST_LOGIN.MOBIE_VERIFICATION_CODE')
        })"
        ></el-input>
        <v-button
          :style="{ overflow: 'hidden' }"
          size="wMin160"
          :disabled="isdisabled"
          @click="getOTP"
          style="margin-left:12px"
        >
          <template slot v-if="verifyCode===false">{{$t('FIRST_LOGIN.GET_VERIFICATION_CODE')}}</template>
          <template slot else>{{btnValue}}</template>
        </v-button>
      </el-form-item>
      <div class="u-sendEmail">
        <span class="u-sendEmail" v-if="sendCode">{{$t('FIRST_LOGIN.CHECK_AND_ENTER')}}</span>
        <span
          class="u-sendEmail"
          v-if="defailt"
          style="color:#f23f47"
        >{{$t('RESET_USERNAME.OTP_SERVICE_OUT')}}</span>
      </div>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:20px;"
        :disabled="nextDisabled"
        @click="next"
      >{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <ul class="u-content">
        <li>{{$t('FIRST_LOGIN.REGISTERED_MOBILE')}}</li>
        <li>{{$t('FIRST_LOGIN.VERIFICATION_CODES')}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getOTPCode, checkOTPCode, checkResetPwdOTPCode } from '@/api/login.js';
import { sendOtp, validOtp } from '@/api/sendOTP';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('app');
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          userName: '',
          otp: '',
          firstVerifyToken: ''
        };
      }
    }
  },
  data() {
    return {
     
      btnValue: '',
      isdisabled: false,
      sendCode: false,
      defailt: false,
      nextDisabled: true,
      checkOTP: true,
      verifyCode:false,
      smsCode:""
    };
  },
   computed: {
    ...mapState(['lang']),
    rules(){
      return{
          otp: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:this.$t('FIRST_LOGIN.VERIFICATION_CODE')
          })
          }
        ]
      }

    }
  },
  created() {
     this.SET_LANG();
    //  this.getRandomNum()
  },
  methods: {
    ...mapActions(['SET_LANG']),
    back() {
      this.$emit('back');
    },
    // 下一步
    next() {
      let paramss = {
        otpType: '01000002',
        otpMode: 'otp',
        code: this.formData.otp,
        custNo: this.formData.userName,
        userCode: this.formData.userName
      };
      this.$refs['formData'].validate(valid => {
        if (valid) {
          validOtp(paramss).then(res => {
            if (res) {
              sessionStorage.setItem('otpToken', res.body);
              let params = {
                // firstVerifyToken:'2323',
                code: this.formData.otp,
                userName: this.formData.userName
              };
              checkResetPwdOTPCode(params).then(result => {
                console.log(result);
                if (result.body.result) {
                  this.$emit('next', this.formData);
                }
              });
            }
          });

          //
        }
      });
    },
    // 获取OTP
    getOTP() {
      this.checkOTP = false;
      // this.nextDisabled=false
      let params = {
        otpType: '01000002',
        otpMode: 'otp',
        custNo: this.formData.userName,
        userCode: this.formData.userName
      };
      console.log(params);
      this.time();
      sendOtp(params).then(res => {
        if (res.body) {
          this.smsCode = res.body.refNum
          this.formData.firstVerifyToken = res.firstVerifyToken;
          this.nextDisabled = false;
        }
      });
    },
    time(o) {
      let wait = 100;
      this.isdisabled = true;
      this.sendCode = true;
      this.defailt = false;
       this.verifyCode=true;
      let interval = window.setInterval(() => {
        this.btnValue = this.$t('FIRST_LOGIN.GET_ANAIN', {
          time: wait
        });
        --wait;
        if (wait == 0) {
          this.btnValue = this.$t('FIRST_LOGIN.SEND_AGNIN');
          wait = 100;
          this.isdisabled = false;
          this.sendCode = false;
          this.defailt = true;
          //  this.getRandomNum()
          window.clearInterval(interval);
        }
      }, 1000);
    },
    changOtp() {
      this.$refs['formData'].validateField('otp', valid => {
        if (!valid) {
          this.nextDisabled = false;
        }
      });
    },
    // 短讯编号
    getRandomNum() {
      let randomStr = Math.random()
        .toFixed(3)
        .slice(-3);
      console.log(randomStr, 'randomStr');
      return this.smsCode = randomStr;
    }
  }
};
</script>

<style lang="scss" scoped>
.u-checkEmail {
  .u-formData {
    margin-left: 23%;
    ::v-deep .el-input__inner {
      width: 320px;
    }
  }
  .u-emailCode {
    .el-input {
      width: 180px;
    }
    ::v-deep .el-input__inner {
      width: 180px;
    }
    ::v-deep .el-form-item__content {
      display: flex;
    }
  }
}
.u-btn {
  display: flex;
  margin-left: 39%;
  margin-top: 36px;
}
.u-tips {
  margin-top: 40px;
  margin-left: 24px;
  // position: absolute;
  // bottom: 0px;
  .u-title {
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 400;
  }
  .u-content {
    margin-top: 16px;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.45);
    font-weight: 400;
  }
}
.u-sendEmail {
  font-size: 12px;
  color: rgba($color: #000000, $alpha: 0.45);
  font-weight: 400;
  margin-left: 11%;
}
.en-btns{
   box-sizing: border-box;
    font-size: 16px;
    color: #f06b00;
    // width: 275px;
    height: 36px;
    background-image: #fff;
    border-radius: 4px;
    box-shadow: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #f06b00;
    > span {
      display: inline-block;
      width: auto;
      height: 19px;
      line-height: 19px;
      letter-spacing: 1.5px;
    }
}
.u-btns{
   box-sizing: border-box;
    font-size: 16px;
    color: #f06b00;
    width: 128px;
    height: 36px;
    background-image: #fff;
    border-radius: 4px;
    box-shadow: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #f06b00;
    > span {
      display: inline-block;
      width: auto;
      height: 19px;
      line-height: 19px;
      letter-spacing: 1.5px;
    }
}
</style>