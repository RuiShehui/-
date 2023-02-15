<template>
  <div class="u-checkEmail">
    <el-form ref="formData" :model="formData" :rules="rules"  label-width="245px" class="u-formData">
      <!-- 手机号码 -->
      <el-form-item :label="$t('RESET_USERNAME.MOBILE_PHONE_NUMBER')" prop="mobPhones">
        <el-row class="rowStyle flexsb">
          <el-input class="input3" v-model="formData.area" :placeholder="$t('USER_MANAGEMENT.USER_COUNTRY')"></el-input>
          <div class="line">-</div>
          <el-input class="input2" v-model="formData.mobPhones" :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{input:$t('RESET_USERNAME.MOBILE_PHONE_NUMBER')})"></el-input>
        </el-row>
      </el-form-item>
      <!-- OTP -->
      <el-form-item :label="$t('SOFT_TOKEN.OTP_VALUE')" class="u-emailCode" prop="otp">
        <el-input
          v-model="formData.otp"
          max-length="6"
          :disabled="checkOTP"
          @blur="changOtp"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{input:$t('FIRST_LOGIN.PHONE_VERIFICATION_CODE')})"
        ></el-input>
        <VButton
           :style="{ overflow: 'hidden' }"
          size="wMin160"
          style="margin-left:20px;"
          :disabled="isdisabled"
          @click="getOTP"
        >{{btnValue}}</VButton>
      </el-form-item>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('FIRST_LOGIN.PREVIOUS')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:20px;"
        :disabled="nextDisabled"
        @click="next"
      >{{$t('COMMON.SUBMIT')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('FIRST_LOGIN.TIPS')}}</p>
      <ul class="u-content">
        <li>{{$t('RESET_USERNAME.MOBLIE_CHECKED')}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getNewUserName, getRetrieveOTPVerifyCode } from '@/api/login.js';
import { sendOtp, validOtp } from '@/api/sendOTP.js';
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          userName: '',
          otp: '',
          firstVerifyToken: '',
          area: ''
        };
      }
    }
  },
  data() {
    return {
      btnValue: this.$t('FIRST_LOGIN.GET_VERIFICATION_CODE'),
      isdisabled: false,
      sendCode: false,
      defailt: false,
      nextDisabled: true,
      checkOTP: true,
      message: {
        status: 'success',
        title:this.$t('FIRST_LOGIN.RESET_USERNAME'),
        // this.$t('RESET_USERNAME.RESET_SUCCESS'),
        desc: this.$t('FIRST_LOGIN.RESET_USERNAME'),
        comfirm: ''
      },
      wait:100,
      interval:''
    };
  },
  computed:{
      rules() {
      var checkPassword = (rules, value, callback) => {
        console.log(value, 'value');
        if (this.formData.userPassword !== this.formData.userPasswordConfirm) {
          callback(new Error(this.$t('FIRST_LOGIN.PLEASE_TRY_AGAIN')));
        }
        callback();
      };
      return {
        mobPhones: [
          {
            required: true,
            message: this.$t('RESET_USERNAME.INPUT_PHONE_NUMBER'),
            trigger: 'blur'
          },
       
        ],
        otp: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.PLEASE_INPUT_VERIFICATION_CODE'),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  created() {},
  methods: {
    back() {
      this.$emit('back');
    },
    next() {
      console.log(this.formData, 'formdata');
      let params = {
        otpType: 'FOUND_USERNAME',
        target: this.formData.area + '-' + this.formData.mobPhones,
        custNo: this.formData.ebankCstmNo,
        code: this.formData.otp,
        otpMode: 'otp',
        userCode: this.formData.userCode
      };
      validOtp(params).then(res => {
        if (res.success) {
          let param = {
            ebankCstmNo: this.formData.ebankCstmNo,
            userCode: this.formData.userCode,
            certNo: this.formData.certNo,
            mobilePhone: this.formData.mobilePhone
          };
          getNewUserName(param).then(res => {
            if (res) {
              window.clearInterval(this.interval);
              this.$emit('next', this.message);
            } else {
              this.message = {
                status: 'fail',
                title: this.$t('COMMON.SUBMIT_FAIL'),
                desc: this.$t('FIRST_LOGIN.TO_FINISH_FAIL')
              };
              this.$emit('next', this.message);
            }
          });
        }
      });
    },
    // 获取OTP验证码
    getOTP() {
      let params = {
        otpType: 'FOUND_USERNAME',
        target: this.formData.area + '-' + this.formData.mobPhones,
        custNo: this.formData.ebankCstmNo,
        otpMode: 'otp',
        userCode: this.formData.userCode
      };
      this.$refs['formData'].validateField('mobPhones', valid => {
        if (!valid) {
          sendOtp(params).then(res => {
            console.log(res, 'yanzheng');
            if(res.head.returnCode=="000000"){
              this.checkOTP = false;
              this.time();
            }else{
              this.isdisabled = false;
              this.sendCode = false;
              this.defailt = true;
              this.btnValue= this.$t('FIRST_LOGIN.SEND_AGNIN');
            }
            
          });
        }
      });
    },
    // 按钮计时器
    time(o) {
      this.isdisabled = true;
      this.sendCode = true;
      this.defailt = false;
      this.interval = window.setInterval(() => {
        this.btnValue = `${this.$t('FIRST_LOGIN.GET_ANAIN',{time:this.wait})}`;
        --this.wait;
        if (this.wait == 0) {
          this.btnValue = this.$t('FIRST_LOGIN.SEND_AGNIN');
          this.wait = 100;
          this.isdisabled = false;
          this.sendCode = false;
          this.defailt = true;
          window.clearInterval(this.interval);
        }
      }, 1000);
    },
    changOtp() {
      this.$refs['formData'].validateField('otp', valid => {
        if (!valid) {
          this.nextDisabled = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.u-checkEmail {
  .u-formData {
    margin-left: 23%;
    // ::v-deep .el-input__inner {
    //   width: 320px;
    // }
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
  position: absolute;
  left: 540px;
  top: 185px;
}
/deep/ .rowStyle {
  width: 320px;
  .input1 {
    width: 80px !important;
  }
  .input2 {
    flex: 1;
  }
  .input3 {
    width: 120px !important;
  }
  .line {
    margin: 10px 6px;
  }
}
</style>