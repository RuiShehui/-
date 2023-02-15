<template>
  <div class="m-login">
    <loginLangSwitch />

    <div class="u-bgImg">
      <div>
        <img class="u-login_icon" src="@/img/home/logo.jpg" />
      </div>
      <!-- <div class="g-login-title-small">
        <span>ENTERPRISE ONLNE BANKING</span>
      </div>-->
      <div class="content-img"></div>
      <div class="u-main-wrapper">
        <div class="g-login-title-large" :style="{fontSize:(languageFlag?'24px':'30px')}">
          <span>{{ $t(`LOGIN.TITLE`) }}</span>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-position="left"
          label-width="0px"
          class="m-login-form"
        >
          <el-form-item class="u-form-item" prop="userName">
            <img class="u-icon" src="@/img/home/login-username.png" />
            <el-input
              class="u-input"
              v-model="ruleForm.userName"
              :placeholder="$t(`LOGIN.PLEASE_USERNAME`)"
              auto-complete="off"
            />
            <el-divider class="u-divider" />
          </el-form-item>
          <el-form-item class="u-form-item" prop="password">
            <img class="u-icon" src="../img/home/login-password.png" />
            <el-input
              class="u-input"
              v-model="ruleForm.password"
              :placeholder="$t(`LOGIN.PLEASE_PASSWORD`)"
              type="password"
              auto-complete="off"
            />
            <el-divider class="u-divider" />
          </el-form-item>
          <el-form-item class="u-form-item" style="width:100%;">
            <el-button
              class="f-submit-btn"
              native-type="submit"
              :disabled="!ableSubmit"
              @click.native.prevent="handleSubmit"
              :loading="logining"
            >{{ $t(`LOGIN.LOGIN`) }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="360" :append-to-body="true">
      <!-- <span>{{ errLog }}</span> -->

      <el-result icon="info" :title="$t(`COMMON.TISHI`)" :subTitle="errLog">
        <template slot="extra">
          <el-button class="button_determine" @click="determine">
            {{
            $t(`COMMON.DETERMINE`)
            }}
          </el-button>
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script>
import { setToken, getToken, getHead } from '@/utils/user';
import loginLangSwitch from '@/components/common/loginLangSwitch';
import { mapActions } from 'vuex';

const rsaPrivateKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6RIag0IEinpYrfd/d0MNU7V+8ffOodByPswFUwNuowRlZWkzUkAFPw7BBZwaTQbMsFL+gAHTDb/7UR8rMimAd6gdS7ij2gzsXEGnB4Pigkik7+LjARKBtChO/Y+ENNLYoj4UL4oQNTzZvMUE8V/cz7m2ig/J02oUYZxHlNwMz0kjVD+1ZFnb9EQqeSk+lk1e9FkQliRhVXowaqheWW2w+J27C5hEmVlxssuSRZWAjhX8k9WCQ9ekXk+nI6ZUOCFouI4lao/9RzTAiN687i9Dafry2G9L8rYaCFE66JnRH+eIaKZqv7HArvmUKB/Jz8Fm6zlE3Avl6Aomrco30fIaLwIDAQAB'
export default {
  components: {
    loginLangSwitch
  },
  computed: {
    rules() {
      return {
        userName: [
          {
            required: true,
            message: this.$t('LOGIN.PLEASE_USERNAME'),
            trigger: 'change'
          }
          //{ validator: validaePass }
        ],
        password: [
          {
            required: true,
            message: this.$t('LOGIN.PLEASE_PASSWORD'),
            trigger: 'change'
          }
          //{ validator: validaePass2 }
        ]
      };
    },
    ableSubmit() {
      if (this.ruleForm.userName.length && this.ruleForm.password.length) {
        return true;
      }
      return false;
    }
  },
  data() {
    return {
      logining: false,
      ruleForm: {
        userName: '', // NDCS_BRANCH1
        password: '' // Abcd1234
      },
      languageFlag: true, //判断语言， false：中文、繁体， true：英语
      dialogVisible: false, //控制错误弹框是否打开
      errLog: '' //错误提示
    };
  },
  watch: {},
  mounted() {
    this.changeLanguage();

    this.$eventBus.$on('changeLanguage', () => {
      this.changeLanguage();
    });
    this.$nextTick(() => {
      this.$refs['ruleForm'].clearValidate();
    });
  },
  methods: {
    ...mapActions('user', ['login']),
    async handleLogin(params) {
      this.logining = true;
      // const flag =
      await this.login(params);

      // !flag && this.$showBox({
      //   content: this.$t('LOGIN.ERRLOG')
      // });

      this.logining = false;
    },

    changeLanguage() {
      console.log('打印getHead().lang', getHead().lang);
      if (getHead().lang === 'en') {
        this.languageFlag = true;
      } else {
        this.languageFlag = false;
      }
    },
    // handleReset() {
    //   this.$refs.ruleForm.resetFields();
    // },
    //确定提交
    handleSubmit(ev) {
      let self = this;

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const reqParams = {...self.ruleForm}
          // rsa 2048
          // rsa/ecb/pkcs1padding
          const rsa = new JSEncrypt()
          rsa.setPublicKey(rsaPrivateKey)
          reqParams.password = rsa.encrypt(reqParams.password)
          self.handleLogin(reqParams);
        } else {
          console.log('error submit!!');
          this.errLog = this.$t('LOGIN.ERRLOG');
          this.dialogVisible = true;
          return false;
        }
      });
    },

    //提示信息
    determine() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-login {
  min-width: 1200px;
  position: fixed;
  background-image: url(../img/home/login-bg.jpg);
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position-y: 0;
  z-index: -1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  .u-bgImg {
    position: relative;
    border-radius: 20px;
    margin: 0 auto;
    box-sizing: border-box;
    margin-top: 60px;
    background: #fff;
    width: 1150px;
    height: 640px;
    box-shadow: -16px 16px 8px rgba($color: #ffcba5, $alpha: 0.2);
    .u-login_icon {
      width: 166px;
      height: 34px;
      position: relative;
      top: 29px;
      left: 29px;
    }
    .content-img {
      position: absolute;
      left: 550px;
      top: -25px;
      width: 620px;
      height: 710px;
      background-image: url(~@/img/home/center-right.png);
      background-size: 620px 710px;
      background-repeat: no-repeat;
    }
  }
  .u-main-wrapper {
    margin-top: 50px;
    position: relative;
    top: 96px;
    left: 100px;
    .g-login-title-large {
      margin-bottom: 56px;
    }
    .m-login-form {
      padding: 20px 0;
      width: 360px;
      position: relative;
      .u-form-item {
        width: 100%;
        .u-icon {
          width: 20px;
          height: 20px;
          position: relative;
          top: 2.5px;
        }
        .u-input {
          // margin-left: 10px;
          width: 340px;
          font-size: 18px;
          /deep/ .el-input__inner {
            border: none;
          }
        }
        .u-divider {
          width: 360px;
          position: absolute;
          top: 20px;
        }
        .f-submit-btn {
          font-size: 14px;
          color: #fff;
          width: 360px;
          height: 40px;
          background-image: linear-gradient(53deg, #f1ab40 0%, #f55e2d 100%);
          border-radius: 20px;
          margin-top: 15px;
        }
        /deep/ .el-form-item__error {
          position: absolute;
          left: 36px !important;
        }
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .m-login {
    .u-bgImg {
      margin-top: 30px;
      width: 920px;
      height: 510px;
      .content-img {
        left: 440px;
        top: -30px;
        width: 500px;
        height: 570px;
        background-size: 500px 570px;
      }
    }
    .u-main-wrapper {
      margin-top: 20px;
      top: 78px;
      left: 50px;
      .g-login-title-large {
        font-size: 24px !important;
      }
    }
  }
}
</style>
