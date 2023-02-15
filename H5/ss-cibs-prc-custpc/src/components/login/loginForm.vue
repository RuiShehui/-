<template>
  <div v-loading="requestLoading" class="form-wrapper">
    <el-form class="login-form" ref="form" :model="form" :rules="rules">
      <h3 class="title">{{ $t('LOGON.ENTERPRISEON_ONLINE_BANKING_USERS_LOGON') }}</h3>

      <!-- 用户名 -->
      <el-form-item class="login-form-item" prop="userName" style="margin-top:24px;">
        <img src="@/images/login/userName.png" class="imgesCustNo" alt="" />
        <el-input
          class="input"
          type="input"
          prefix-icon="custNo"
          v-model="form.userName"
          autocomplete="off"
          maxlength="20"
          @blur="changeUserName"
          :placeholder="$t(`LOGON.PLEASE_INPUT_USER_NAME`)"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item class="login-form-item" prop="password">
        <img src="@/images/login/password.png" class="imgesCustNo" alt="" />
        <el-input
          class="input"
          type="password"
          prefix-icon="custNo"
          v-model="form.password"
          autocomplete="off"
          maxlength="12"
          @blur="changePassword"
          :placeholder="$t(`LOGON.PLEASE_INPUT_PASSWORD`)"
        />
      </el-form-item>
      <!-- 验证码-->
      <el-form-item class="login-form-item verify" prop="verifyCode" v-if="status">
        <img src="@/images/login/veriCode.png" class="imgesCustNo" alt="" />
        <el-input
          class="verify-code"
          prefix-icon="custNo"
          v-model="form.verifyCode"
          @blur="verifyCodeBlur"
          maxlength="4"
          :placeholder="$t(`LOGON.PLEASE_ENTER_THE_VERIFICATION_CODE`)"
        />
        <img class="verify-code-img" :src="imageStr" alt="" @click="getVerifyImg" />
      </el-form-item>
      <div class="first-login" @click="firstLogin">{{$t(`LOGON.NEW_USER_LOGIN_FOR_THE_FIRST_TIME`)}}</div>
      <el-form-item>
        <!-- 登录 -->
        <VButton size="w290" type="primary" @click="handleLogin" class="btn">{{ $t('LOGON.LOGON') }}</VButton>
      </el-form-item>
    </el-form>

    <!-- TODO: 跳转 -->
    <div class="operates">
      <!-- 忘记密码 -->
      <span @click="handlePushToRetrieveUsername">{{$t(`LOGON.FORGET_YOUR_PASSWORD`)}}</span>
      &nbsp;&nbsp;
      <span>|</span>&nbsp;&nbsp;
  
       <!-- 忘记用户名 -->
      <span
        @click="handleForgotPassword"
        class="forget-password"
      >{{$t(`LOGON.FORGET_THE_USERNAME`)}}</span>
    </div>
    <!-- 忘记密码弹窗 -->
    <el-dialog
      top="0vh"
      center
      :title="$t('COMMON.TIPS')"
      :append-to-body="true"
      :visible.sync="isShow"
      z-index="99999"
      width="380px"
    >
      <p style="margin-top:18px;font-size:14px;color:#000;font-weight:500">{{$t('LOGON.TO_RESET_PASSWODR')}}</p>
      <p style="margin-top:18px;font-size:14px;color:#000;font-weight:500">{{$t('LOGON.TO_BANK_RESETPASSWORD')}}</p>
      <div style="margin:24px auto;width:100%">
        <VButton size="w120" style="padding-left:25%" @click="isShow=false" type="primary">{{$t('COMMON.DETERMINE')}}</VButton>

       </div>
    </el-dialog>
  </div>
</template>


<script>
import { passwordValidator, userNameValidator } from '@/utils/validator';
import {
  login,
  verifyImg,
  checkUserFirstLogin,
  loginValid,
  getHsmPublicKey
} from '@/api/login.js';
import { setUser, setToken } from '@/utils/user';
import { createNamespacedHelpers } from 'vuex';
import _ from 'lodash';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import tools from '@/dataTools/tools';
const { getCurrentTimesData } = tools;
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');

export default {
  name: 'LoginForm',
  data() {
    return {
      logFlag: false,
      tipTitile: '', //
      tipTitile2: '',
      form: {
        channel: '',
        custNo: '', // 
        logonClientInfo: '',
        logonIp: '',
        logonMac: '',
        password: '', // 
        userName: '', // 
        verifyCode: '', // 
        webPin: ''
      },
      pinModulus: '',
      state: {},
      isShow: false,
      isLogin: false,
      flags: null
      // keyDown:''
      // status:false
    };
  },
  computed: {
    ...mapState(['imageStr', 'status', 'requestLoading']),
    rules() {
      return {
        userName: [
          { required: true, message: this.$t('LOGON.PLEASE_INPUT_USER_NAME') }
        ],
        password: [
          { required: true, message: this.$t('LOGON.PLEASE_INPUT_PASSWORD') }
          // { validator: passwordValidator, trigger: 'blur' }
        ],
        verifyCode: [
          {
            required: true,
            message: this.$t('LOGON.VERIFINCATION_CODE')
          }
        ]
      };
    }
  },
  created() {
    this.$store.commit('app/setSliderMenusAct', '');
    this.getVerifyImg();
  },
  mounted() {
    window.addEventListener('keydown', this.keyDown);
  },
  methods: {
    // 调用VueX 方法
    ...mapActions(['SET_IMG_TOKEN', 'USER_LOGON', 'SET_VALIDATE']),
    ...mapMutations(['SET_IMAGESTR', 'SET_VERFYIMG']),
    // 取消验证码空格
    verifyCodeBlur() {
      this.form.verifyCode = this.form.verifyCode.replace(/\s+/g, '');
    },
    // 忘记密码弹窗
    handlePushToRetrieveUsername() {
      this.isShow = true;
    },
    // 跳转至找回登录名
    handleForgotPassword() {
      this.$router.push('/login/resetUserName');
    },
    // 进入加密流程
    handleLogin() {
      let self = this;
      this.isLogin = true;
      self.form.webPin = '';
      self.$refs.form.validate(valid => {
        if (valid) {
          this.pinModulus = '';
          // 加密组件
          getHsmPublicKey({}).then(async body => {
            if (body) {
              this.pinModulus = body;
              let pinExponent = '010001';
              let triDesKeyLen = 2;
              let iv = null;
              let pin = this.form.password;
              let timestamp = await getCurrentTimesData(); // Time Element in YYYYMMDDHH24MISS format, this should
              console.log(timestamp, 'timestamp');
              self.form.webPin = E2EE.encryptAlphaPINAndGenerateMAC(
                this.pinModulus,
                pinExponent,
                triDesKeyLen,
                iv,
                pin,
                timestamp
              );
              let slef = this;
              let result = true;
              if (slef.flags) {
                result = false;
              } else {
                // 登录防抖
                slef.flags = setTimeout(() => {
                  self.handleSubmit({
                    channel: self.form.channel,
                    custNo: self.form.custNo, // 
                    logonClientInfo: self.form.logonClientInfo,
                    logonIp: self.form.logonIp,
                    logonMac: self.form.logonMac,
                    userName: self.form.userName, // 
                    verifyCode: self.form.verifyCode, // 
                    webPin: self.form.webPin
                  });
                  clearTimeout(slef.flags);
                  slef.flags = null;
                }, 500);

                result = true;
              }
              return result;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 回车键登录，加防抖
    keyDown(e, time = 1000) {
      let slef = this;
      let result = true;
      if (slef.flags) {
        result = false;
      } else {
        if (e.keyCode == 13) {
          slef.flags = setTimeout(() => {
            console.log(e, 'falg');

            slef.handleLogin();
            clearTimeout(slef.flags);
            slef.flags = null;
          }, 500);
        }
        result = true;
      }
      return result;
    },
    // 提交登录
    async handleSubmit(value) {
      await this.USER_LOGON(value);
      // this.isLogin=false
    },
    firstLogin() {
      sessionStorage.setItem('userName', this.form.userName);
      sessionStorage.getItem('resetLogin', 'LOGON_FIRST');
      this.$router.push('/login/firstLogin');
    },
    // 获取验证码，点击更改验证码
    getVerifyImg() {
      verifyImg().then(res => {
        console.log(res);
        sessionStorage.setItem('token', res.imageToken);
        this.SET_IMG_TOKEN(res.imageToken);
        this.SET_IMAGESTR(res.imageStr);
      });
    },
    // 取消密码空格
    changePassword() {
      let str = this.form.password.replace(/\s+/g, '');
      this.form.password = str;
    },
    // 取消登录名空格
    changeUserName() {
      setTimeout(() => {
        let str = this.form.userName.replace(/\s+/g, '');
        this.form.userName = str;
        let params = {
          userName: this.form.userName
        }; 
        // 判断登入名是否输入
        if(this.form.userName){
          this.SET_VALIDATE(params);
        }
      }, 200);
    }
  },
  // 销毁回车键判定
  destroyed() {
    window.removeEventListener('keydown', this.keyDown, false);
  }
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  // background-image: linear-gradient(180deg, #fefeff 2%, #fdfeff 99%);
  box-shadow: 0px 8px 16px 8px rgba(154, 173, 206, 0.12);
  padding: 32px 40px 24px 40px;
  background: url('~@/images/login/loginBG.png') no-repeat;
  background-size: 120% 120%;
  background-position-y: -50px;
  background-position-x: -30px;
  .title {
     
    font-size: 20px;
    color: #1c2453;
    font-weight: 500;
    margin-bottom: 6px;
    font-weight: 500;
  }
  .login-form {
    /deep/.el-form-item__error {
      padding-top: 15px;
      padding-left: 17px;
    }
    .login-form-item {
      position: relative;
      height: 38px;
      width: 290px;

      .el-input {
        width: 100%;
      }

      &.verify {
        .el-input {
          width: 180px !important;
          height: 100%;
          padding: 0;
          width: 290px;
          border: none;
        }
        .verify-code-img {
          width: 84px;
          height: 31px;
          position: absolute;
          right: 10px;
          top: 50%;
          cursor: pointer;
          transform: translateY(-50%);
        }
      }
      .imgesCustNo {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        // widows: 14px;
        height: 14px;
        width: 14px;
        z-index: 90;
      }
    }
    .first-login {
      cursor: pointer;
      font-size: 14px;
      color: #4181fa;
      margin: 0 0 10px 0;
      z-index: 999;
      // width: 100px;
    }
  }
  .btn {
    width: 100%;
    border-radius: 3px;
  }

  .operates {
     
    font-size: 13px;
    color: #696969;
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    display: flex;
    justify-content: center;
    span {
      cursor: pointer;
      display: inline-block;
    }
    span:hover {
      color: #f06b00;
    }

    .forget-password {
      display: inline-flex;
      align-items: center;
      // margin-left: 25px;
    }
    .forget-password-img {
      padding-left: 5px;
    }
  }
}
.popUp {
  .popUp_tip {
    font-size: 16px;
     
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
  p {
    margin-top: 15px;
     
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 400;
  }
}
::v-deep .el-input__inner {
  border: 0 !important;
  height: 38px !important;
  line-height: 38px !important;
}
::v-deep .dialogClass p {
  width: 315px;
}
</style>
