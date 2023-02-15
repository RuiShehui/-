<!--
 * @Author: ZL
 * @Date: 2022-06-13 09:34:54
 * @LastEditTime: 2022-09-16 16:25:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\chooseCheck\choosesCheck.vue
-->

<template>
  <el-dialog
    :title="text.title"
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="dialogClass"
    top="0vh"
  >
    <div class="u-content">
      <p class="u-title" style="color:#f06b00;">{{text.verifyWay}}</p>
      <el-form class="u-form" ref="text" :model="text">
        <el-form-item prop="softTokenCode" >
         <el-radio-group v-model="text.checkWay" style="padding-top:10px">
          <el-radio label="1">{{text.optcerification}} </el-radio>
          <el-radio label="2">{{text.mobileToken}}</el-radio>
         </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="flexc u-btn"> 
      <v-button size="w160" @click="onCancel" class="mr16">
        {{
        text.btnText.cancleText
        }}
      </v-button>
      <v-button size="w160" type="primary" @click="onConfirm">
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
// import {sendsOtp} from './sendOTP.js'

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
        checkWay:'',
        verifyWay:'',
        optcerification:'',
        mobileToken:''
      },
     
      isdisabled: false,
      checkWay:[
        {
          value:'1',
          label:''
        },
        {
          value:'2',
          label:''
        }
      ]
    };
  },
  computed: {
    /**
     * 当前的otpType
     */
    // otpType() {
    //   const menuId = localStorage.getItem('sliderMenusAct');
    //   return getotpType(menuId);
    // }
  },
  mounted() {
    console.log('打印text', this.text);
  },
  methods: {
    onCancel() {
      console.log('cancel');
    },
    onConfirm() {
      console.log('confirm');
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .dialogClass {
  text-align: center;
  padding: 30px;
  border-radius: 4px;
  max-width: 445px;
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
    padding: 22px 16px 0px;
    .u-title {
      text-align: center;
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
  .u-steps{
    text-align: left;
    padding-left: 22px;
    line-height: 26px;
    font-size: 12px;
    color: rgba($color: #000, $alpha: 0.45);
    padding-bottom:24px; 
  }
  .u-btn {
    padding: 0px 16px 22px;
    // padding-bottom: 22px;
  }
  .otpInput {
    /deep/ .el-form-item__content {
      display: flex !important;
      justify-content: center;
      margin: 24px 0px;
    }
    // ::v-deep .el-form-item__content {
    //   display: flex !important;
    // }
  }
}
::v-deep .el-form-item__content {
      display: flex !important;
      justify-content: center;
      margin: 24px 0px;
    }
::v-deep .el-input__inner{
  border: none
}
.u-form{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
