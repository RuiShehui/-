<!-- 校验初始密码-->
<template>
  <div class="u-checkEmail">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="245px" class="u-formData">
      <!-- 登录名 -->
      <el-form-item :label="$t('FIRST_LOGIN.LOGIN_CUSTNO')" prop="userName">
        <el-input
          v-model="formData.userName"
          maxlength="34"
          :disabled="true"
          :placeholder="$t('FIRST_LOGIN.PLEASE_ENTER_LONGIN_CUSTNO')"
        ></el-input>
      </el-form-item>
      <!-- 初始密码 -->
      <el-form-item :label="$t('FIRST_LOGIN.START_CODE')" class="u-emailCode" prop="webPin">
        <el-input
          v-model="formData.webPin"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:$t('FIRST_LOGIN.START_CODE')
          })"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:20px;"
        @click="e2eeFun"
      >{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <ul class="u-content">
        <li>{{$t('FIRST_LOGIN.TIPS_CONTENT')}}</li>
      </ul>
    </div>
    <el-dialog
      class="m-message-know"
      :visible.sync="isShowPotrol"
      :destroy-on-close="true"
      :center="true"
      :lock-scroll="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title
      top="0vh"
      width="980px"
      height="100%"
     
    >
    <Portrol>
      <section v-html="$t('FIRST_LOGIN.LOGIN_POLICIES')"></section>
      <p class="m-delay-tip">
         <el-checkbox v-model="checked">{{$t('FIRST_LOGIN.CHECKED_BOX')}}</el-checkbox>
      </p>
      <footer
        class="btn-group"
        :style="{
          textAlign: 'center',
          width: '100%',
          padding: '10px 0',
          marginTop: '10px'
        }"
      >
        <el-button :style="{ width: '120px' }" @click="onReject">{{ $t('COMMON.DISAGREE') }}</el-button>
        <el-button
          :style="{ width: '120px' }"
          type="primary"
          @click="handleAgree"
          :disabled="agree"
        >{{ $t('COMMON.AGREE') }}</el-button>
      </footer>
    </Portrol>
   
    </el-dialog>
  </div>
</template>

<script>
import {
  getEmailPassword,
  checkEmailPassword,
  getHsmPublicKey,
  checkFirstPwd
} from '@/api/login.js';
import tools from '@/dataTools/tools';
import { checkEmail } from '@/utils/validator.js';
import Portrol from '../portrol';
const { getCurrentTimesData } = tools;
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          userName: '',
          firstPassword: '',
          checkEmail: '',
          token: ''
        };
      }
    }
  },
  components: {
    Portrol
  },
  data() {
    return {
      rules: {
        webPin: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('FIRST_LOGIN.START_CODE')
            }),
            trigger: 'blur'
          }
        ]
      },
      result: '',
      btnValue: this.$t('FIRST_LOGIN.GET_VERIFICATION_CODE'),
      timer: null,
      isdisabled: true,
      nextDisabled: true,
      sendEmail: false,
      checkedEmail: true,
      wait: 90,
      isShowPotrol: false,
      agree:true,
      checked:false
    };
  },
  watch:{
    checked(newValue,oldValue){
      console.log(oldValue,'old')
      if(newValue){
        this.agree = false
      }
      console.log(newValue,'newValue')
    }
  },
  created() {},
  mounted() {},
  methods: {
    e2eeFun() {
      console.log(23213123);
      this.enc = '';
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.pinModulus = '';
          // 加密组件
          getHsmPublicKey({}).then(async body => {
            console.log(body, 'body');
            if (body) {
              this.pinModulus = body;
              let pinExponent = '010001'; //TODO生产环境是否需要改变
              let triDesKeyLen = 2;//TODO生产环境是否需要改变
              let iv = null;
              let pin = this.formData.webPin;
              let timestamp = await getCurrentTimesData(); // Time Element in YYYYMMDDHH24MISS format, this should
              this.enc = E2EE.encryptAlphaPINAndGenerateMAC(
                this.pinModulus,
                pinExponent,
                triDesKeyLen,
                iv,
                pin,
                timestamp
              );
              console.log(this.enc, 'this.enc');
               this.isShowPotrol = true;
            }
          });
        }
      });
    },
    back() {
      this.$emit('back', this.formData);
    },
    onReject(){
      this.$router.replace('/login')
    },
    handleAgree(){
     this.isShowPotrol = false;
     this.next()
    },
    next() {
     
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let params = {
            userName: this.formData.userName,
            webPin: this.enc
            // password:this.enc
          };
          // 校验密码
          checkFirstPwd(params).then(res => {
            console.log(res, 'checkemail');
            if (res.result) {
              this.$emit('next', this.formData);
            }
          });
          //
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
    ::v-deep .el-input__inner {
      width: 320px;
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
  margin-left: 235px;
  // position: absolute;
  // left: 540px;
  // top: 239px;
}
</style>