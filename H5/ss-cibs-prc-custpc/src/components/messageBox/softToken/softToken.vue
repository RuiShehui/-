<template>
  <el-dialog
    :title="text.title"
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="dialogClass"
    top="0vh"
  >
    <div slot="title" class="otp-title">{{text.verify}}</div>
    <div class="u-content">
      <div class="u-randNum" v-if="!(userInfo.entType == '2')">
        <div>
          <p class="u-title">{{text.needSoftToken}}</p>
          <p class="u-tips">{{text.changeCode}}</p>
          <p class="u-softToken">{{randomNum}}</p>
        </div>
      </div>
    
      <p class="u-tips">{{text.safeCode}}</p>
      <el-form ref="text" :model="text">
        <el-form-item prop="softTokenCode">
          <el-input
            maxlength="6"
            minlength="6"
            class="u-input"
            v-model="text.softTokenCode"
            :placeholder="text.stcode"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-steps" > 
      <ul>
        <li>{{text.stepone}}</li>
        <li>{{text.steptwo}}</li>
        <li>{{text.stepthree}}</li>
        <li>{{text.stepfour}}</li>
      </ul>
    </div>
    <div slot="footer" class="flexc u-btn">
      <v-button size="w160" @click="onCancel" class="mr16">
        {{
        text.btnText.cancleText
        }}
      </v-button>
      <v-button :style="{ overflow: 'hidden' }" size="wMin160" type="primary" @click="onConfirm">
        {{
        text.btnText.confirmText
        }}
      </v-button>
    </div>
  </el-dialog>
</template>
<script>
import { validOtp, sendOtp } from '@/api/sendOTP';
import { getotpType } from '../libs/utils';
import messageBoxMixin from '../libs/messageBox.mixin';

function getRandomNum() {
  let randomStr = Math.random().toFixed(6).slice(-6)
    console.log(randomStr,'randomStr')
    return randomStr
}
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
        softTokenCode: '',
        randomNum:getRandomNum(),
        verify:'',
        needSoftToken:':',
        changeCode:'',
        safeCode:'',
        stepone:'',
        steptwo:'',
        stepthree:'',
        stepfour:'',
        stcode:''
      },
      isdisabled: false,
      randomNum:'',
      userInfo:{},
      breadcrumb:[],
      menuCode:'',
      adminEmpower:''
    };
  },
  created(){
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.breadcrumb = JSON.parse(localStorage.getItem('breadcrumb'))
    this.menuCode = this.breadcrumb[0].menuCode
    this.adminEmpower = this.userInfo.adminEmpower
    console.log(this.userInfo,'22')
    this.randomNum =this.text.randomNum
  },
  mounted() {
    console.log(this.text,'text')
    console.log('打印text', this.text);
  },
  methods: {
    onCancel() {
      console.log('cancel');
    },
    onConfirm() {
      console.log('confirm');
    }, 
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
    .u-title {
      font-size: 16px;
      color: #000;
      font-weight: 500;
    }
    .u-tips {
      margin-top: 18px;
    }
    .u-softToken {
      font-size: 24px;
      color: #f06b00;
      letter-spacing: 4px;
      margin-top: 13px;
      margin-bottom: 18px;
    }
  }
  .u-input {
    border-bottom: 1px solid rgba($color: #000, $alpha: 0.25);
    border-radius: 0px;
   
  }
  .u-steps {
    text-align: left;
    padding-left: 22px;
    line-height: 26px;
    font-size: 12px;
    color: rgba($color: #000, $alpha: 0.45);
    padding-bottom: 24px;
  }
  .u-btn {
    padding-bottom: 22px;
  }
  .otpInput {
    /deep/ .el-form-item__content {
      display: flex !important;
    }
    // ::v-deep .el-form-item__content {
    //   display: flex !important;
    // }
  }
}
.u-randNum{
  display: flex;
 
}
::v-deep .el-input__inner {
  border: none;
  width: 280px !important;
}
</style>
