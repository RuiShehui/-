<template>
  <el-dialog
    :title="text.title"
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="dialogClass"
    @open="handleOpen"
    top="0vh"
  >
    <!--   @open="handleOpen"-->
    <div slot="title" class="otp-title">{{text.otpVerfiy}}</div>
    <div class="u-content">
      <p class="mtb24" style="font-size:18px;color:#000;">{{text.tocheck}}</p>
      <p class="mtb24">
     {{text.tosms}}
      </p>
      <p
        class="mtb24"
        v-if="status=='0'"
      >{{text.fa}}</p>
    </div>
    <div class="u-input">
      <el-form ref="text">
        <el-form-item :label="text.smsCode" class="otpInput" label-width="180px">
          <el-input :value="text.randomNum" :disabled="true" maxlength="6" minlength="6"></el-input>
        </el-form-item>
        <el-form-item :label="text.otpCode" prop="otp" class="otpInput" label-width="180px">
          <el-input v-model="text.otp" @blur="checkOtp" maxlength="6" minlength="6"></el-input>
          <v-button
            style="margin-left:8px"
            :disabled="text.isdisabled"
            :style="{ overflow: 'hidden' }" size="wMin160"
            @click="submit"
          >{{ text.btnValue }}</v-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="flexc u-btn">
      <v-button size="w160" @click="onCancel" class="mr16">
        {{
        text.btnText.cancleText
        }}
      </v-button>
      <v-button
       :style="{ overflow: 'hidden' }" size="wMin160"
      
        :disabled="text.isSubmit"
        @click="onConfirm"
      >
        {{
        text.btnText.confirmText
        }}
      </v-button>
    </div>
  </el-dialog>
</template>
<script>
import { validOtp } from '@/api/sendOTP';
import { getotpType } from '../libs/utils';
import messageBoxMixin from '../libs/messageBox.mixin';
// function getRandomNum() {
//   let randomStr = Math.random()
//     .toFixed(3)
//     .slice(-3);
//   console.log(randomStr, 'randomStr');
//   return randomStr;
// }
export default {
  name: 'OtpDialog',
  mixins: [messageBoxMixin],
  data() {
    return {
      text: {
        title: '',
        isIcon: true,
        type: 'warn',
        message: '',
        btnText: {
          cancleText: '',
          confirmText: ''
        },
        btnValue: '',
        isCancle: false,
        overLoad: false,
        isdisabled: false,
        otp: '',
        isSubmit: true,
        randomNum: '',
        otpVerfiy:'',
        otpCode:"",
        tocheck:'',
        tosms:'',
        fa:'',
        smsCode:''
      },
    
      isdisabled: false,
      randomNum: '',
      status: ''
    };
  },
  watch: {
    'text.otp': function(newValue, oldValue) {
      console.log(newValue, 'va;ue');
      if (newValue) {
        this.text.isSubmit = false;
      } else {
        this.text.isSubmit = true;
      }
    }

  },
  computed: {
    
  },
  created() {
    this.randomNum = this.text.randomNum;
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.status = userInfo.status;
  },
  mounted() {},
  methods: {
    handleOpen() {
      // this.randomNum = getRandomNum();
      // console.log(this.randomNum, 'randdsddssdsdsdsds');
      this.$set(this.text, 'randomNum', '');
    },
    onCancel() {
      // this.btnValue = '获取验证码';
      // console.log('cancel');
    },
    getOTP(params) {
      console.log(params, 'prams');
    },
    onConfirm() {
      console.log('confirm');
    },
    checkOtp() {
      if (this.text.otp) {
        this.text.isSubmit = false;
      } else {
        this.text.isSubmit = true;
      }
    },
    submit(options) {
      console.log(111);
      console.log('options', options);
      this.handleOpen();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .dialogClass {
  text-align: center;
  // padding: 24px;
  border-radius: 4px;
  width: 980px;
  // display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header,
  .el-dialog__body,
  .el-dialog__footer {
    padding: 0 !important;
  }
  .otp-title {
    background: rgba($color: #feaf03, $alpha: 0.1);
    height: 46px;
    text-align: left;
    font-size: 14px;
    padding-left: 22px;
    line-height: 46px;
  }
  .u-content {
    text-align: left;
    padding: 16px 22px;
  }
  .u-input {
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .u-btn {
    padding-bottom: 22px;
  }
 
}
 ::v-deep .el-form-item .el-form-item__content {
    width: 570px;
    min-width: 500px;
    display: flex !important;
  }
.u-orginBtn {
  color: #fff;
  // width: 160px;
  background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
  border: none;
}
</style>
