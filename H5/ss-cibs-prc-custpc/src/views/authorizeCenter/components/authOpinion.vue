<!--
 * @Author: ZhangZhen
 * @Date: 2022-03-28 09:51:25
 * @LastEditTime: 2022-09-28 19:55:32
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\authOpinion.vue
-->
<template>
  <div>
    <el-form v-if="hasAuthorization === '0'">
      <el-form-item :label="$t('AUTHORIZE.MY_AUTHOR')" class="u-mr12" label-width="390px">
        <el-radio-group v-model="form.radio" style="margin-top: 12px;">
          <!-- 同意 -->
          <el-radio label="1">{{$t('AUTHORIZE.MY_AGRESS')}}</el-radio>
          <!-- 拒绝 -->
          <el-radio label="2">{{$t('AUTHORIZE.MY_REFUSE')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <!-- 请输入授权意见 -->
        <el-input
          class="opinion"
          type="textarea"
          resize="none"
          v-model="form.opinion"
          maxlength="60"
          show-word-limit
          :placeholder="$t('AUTHORIZE.INPUT_AUTHOR_IDEA')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="u-tips"></div>
    <div class="u-tips" v-if="this.creditType =='3'">
      <!-- v-if="this.otpType =='030101'||this.otpType =='03010201'||this.otpType =='03010202' ||this.otpType =='030103' ||this.otpType =='03010401'||this.otpType =='03010501'||this.otpType=='060101'||this.otpType=='060102' && this.creditTypes=='3'" -->
      <!-- -->
      <p class="u-title" style="display:flex;">
        <img style="width:14px; padding-right:8px" src="@/images/logo/lingdang.png" />
        <!-- 此交易必须使用双重认证，请选择双重认证的方式 -->
        <span>{{$t('AUTHORIZE.DOUBLE_WAY')}}</span>
      </p>
      <el-form ref="forms" :rules="rule" :model="form" style="margin-left:25%">
        <!-- 双重认证方式 -->
        <el-form-item :label="$t('AUTHORIZE.DOUBLE_WAYS')" prop="checkWay" label-width="200px">
          <el-radio-group v-model="form.checkWay" style="padding-top:10px">
            <!-- 流动保安认证 -->
            <el-radio label="2">{{$t('AUTHORIZE.PLICE_WAY')}}</el-radio>
            <!-- SMS OTP认证 -->
            <el-radio label="1">{{$t('AUTHORIZE.OTP_WAY')}}</el-radio>
            <!-- <el-radio v-for="item in checkWay" :key="item.value" :value="item.value" :label="item.label"></el-radio> -->
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="g-btns">
      <v-button size="w160" @click="goList">{{ $t('COMMON.BACK') }}</v-button>
      <v-button
        class="f-reset"
        size="w160"
        type="primary"
        v-if="hasAuthorization === '0'"
        @click="submit"
      >{{ $t('COMMON.SUBMIT') }}</v-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      top="0vh"
      center
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="dialogClass"
    >
      <div class="g-withDrawDialog">
        <img src="@/images/common/warning.png" />
        <!-- 确定授权 -->
        <p>{{$t('AUTHORIZE.SURE_AUTHOR') + ' '}}{{ form.radio === '1' ? `${$t('AUTHORIZE.MY_AGRESS')}`:`${$t('AUTHORIZE.MY_REFUSE')}` }}{{' '+ `${$t('AUTHORIZE.THIS_WORD')}`}}</p>
        <div class="g-withDrawBtn">
          <!-- 取消 -->
          <v-button
            size="w120"
            @click="dialogVisible = false"
            style="margin-right: 16px"
          >{{$t('AUTHORIZE.CANCLE')}}</v-button>
          <!-- 确定 -->
          <v-button
            size="w120"
            type="primary"
            :disabled="disabled"
            @click="confirm"
          >{{$t('AUTHORIZE.SURE')}}</v-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { otpDialog, softToken } from '@/components/messageBox';
export default {
  name: 'authOpinion',
  props: {
    transactionType: {
      type: String,
      default: ''
    },
    creditType: {
      type: String,
      default: ''
    },
    flag: {
      type: String,
      flag: ''
    },
    dataItem: {
      type: Object,
      flag: {}
    },
    detailData:{
      // type:Array,
      // default:()=>{
      //   return []
      // }
    }
  },
  data() {
    return {
      hasAuthorization: '0',
      form: {
        radio: '1',
        opinion: '',
        checkWay: ''
      },
      dialogVisible: false,
      disabled: false,
      // checkWay:'',
      rule: {
        checkWay: [
          // 请选择认证方式
          {
            required: true,
            message: this.$t('AUTHORIZE.SELECT_WAY'),
            tigger: 'change'
          }
        ]
      },
      otpType: '',
      creditTypes: ''
    };
  },
  created() {
    
    this.otpType = this.transactionType;
    console.log(this.otpType, 'this.otpType');
    this.creditTypes = this.creditType;
    // console.log(this.creditTypes, 'this.transactionType');
  },
  methods: {
    goList() {
      this.$router.go(-1);
    },
    submit() {
      if (this.creditTypes == '3') {
        this.$refs['forms'].validate(valid => {
          if (valid) {
            if (this.form.radio === '2') {
              if (!this.form.opinion.length) {
                // '请输入授权意见'
                this.$message({
                  type: 'fail',
                  message: this.$t('AUTHORIZE.INPUT_AUTHOR_IDEA'),
                  delay: 3000
                });
                return;
              }
            }
            this.dialogVisible = true;
          }
        });
      } else {
        if (this.form.radio === '2') {
          if (!this.form.opinion.length) {
            // '请输入授权意见'
            this.$message({
              type: 'fail',
              message: this.$t('AUTHORIZE.INPUT_AUTHOR_IDEA'),
              delay: 3000
            });
            return;
          }
        }
        this.dialogVisible = true;
      }
    },
    confirm() {
      this.dialogVisible = false;
      if (this.creditTypes == '3') {
        if (this.form.checkWay == '1') {
          otpDialog({
            otpType: this.otpType,
            otpMode: 'otp',
            flag: this.flag
          }).then(() => {
            this.$emit('confirm', this.form);
          });
        } else {
          const tradeInfo = JSON.stringify({...this.detailData, type:this.dataItem ? this.dataItem.operationType:''});
          console.log(tradeInfo,'info')
          softToken({
            softTokenCode: '',
            otpType: this.otpType,
            tradeInfo: tradeInfo,
            flag:this.flag,
            radio:this.form.checkWay
            // randomNum:''
          }).then(() => {
            this.$emit('confirm', this.form);
          });
        }
      } else {
        this.$emit('confirm', this.form);
      }

      // this.$emit('confirm', this.form);
      // this.disabled = false;
      // setTimeout(() => {
      //   this.dialogVisible = false;
      // }, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-btns {
  display: flex;
  margin-left: 390px;
  margin-top: 36px;
}
.f-reset {
  margin-left: 16px;
}
.opinion {
  height: 36px;
  width: 336px;
  margin-left: 390px;
  box-sizing: border-box;
}

.g-withDrawDialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    height: 44px;
    width: 44px;
  }
  p {
    margin: 24px 0;
  }
  .g-withDrawBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
  }
}
.u-title {
  font-size: 14px;
  color: #f06b00;
  display: flex;
  margin-left: 46px;
  margin-top: 45px;
  justify-content: center;
  align-items: center;
  // flex-direction: column;
}
// .el-form{
//   flex-direction: column;
//   justify-content: center;
//   align-content: center'
// }
</style>
