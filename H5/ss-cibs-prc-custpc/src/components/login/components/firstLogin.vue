<template>
  <div class="g-firstLogin">
    <login-header class="u-header"></login-header>
    <div class="g-contant" style="margin-top: 12px;">
      <el-tabs class="u-tabs" v-model="activeTabName">
        <el-tab-pane :label="$t('FIRST_LOGIN.WELCOME_BANK')" name="first">
          <div class="m-userType" v-if="['LOGON_FIRST'].includes(steps)">
            <steps :stepsList="stepsList" :activeIndex="activeIndex" class="u-step"></steps>
            <!-- 验证用户名 -->
            <div v-if="activeIndex===0">
              <changeUserName @next="toNext" :steps="steps" :formData="formData" />
            </div>
            <!-- 验证用户编号 -->
            <div v-if="activeIndex===1">
              <checkEmail @next="toNext" @back="backTo" :formData="formData" />
            </div>
            <!-- 验证OTP -->
            <div v-if="activeIndex===2">
              <checkPhone @next="toNext" @back="backTo" :formData="formData"></checkPhone>
            </div>
            <!-- 设置私密问题 -->
            <div v-if="activeIndex===3">
              <safeProblem @next="toNext" @back="backTo" :formData="formData" />
            </div>
            <!-- 修改密码 -->
            <div v-if="activeIndex===4">
              <changePassword @next="toNext" :message="message" @back="backTo" :formData="formData" />
            </div>
            <div v-if="activeIndex===5">
              <result :message="message" />
            </div>
          </div>
          <div class="m-userType" v-if="['RESET_PWD'].includes(steps)">
            <steps :stepsList="stepsLists" :activeIndex="activeIndex" class="u-steps" />
            <!--  重置用户首次登录--校验用户名-->
            <div v-if="activeIndex===0">
              <checkUserName @next="next" :formData="formData"></checkUserName>
            </div>
             <!--  重置用户首次登录--检查OTP-->
            <div v-if="activeIndex===1">
              <problem @next="next" @back="back" :formData="formData"></problem>
            </div>
            <div v-if="activeIndex===2">
              <SYSchangePassword @next="next" @back="back" :message="message" :formData="formData" />
            </div>
            <div v-if="activeIndex===3">
              <result :message="message" />
            </div>
          </div> 
        </el-tab-pane>
      </el-tabs>
    </div>

    <login-footer class="u-footer"></login-footer>
  </div>
</template>

<script>
// 新用户首次登录
import loginHeader from '@/components/login/loginHeader';
import loginFooter from '../../home/Footer.vue';
import changeUserName from './enterprise/changeUserName';
import checkEmail from './enterprise/checkEmail';
import checkPhone from './enterprise/checkPhone';
import changePassword from './enterprise/changePassword';
import safeProblem from './enterprise/safeproblem.vue';
// 重置用户---首次登录
import SYSchangePassword from './sysadmis/changePassword';
// import comfirm from './enterprise/comfirm';
import result from './enterprise/result';
import checkUserName from './sysadmis/checkUserName';
import problem from './sysadmis/safetyProblem';
export default {
  components: {
    loginHeader,
    loginFooter,
    changeUserName,
    checkEmail,
    checkPhone,
    changePassword,
    SYSchangePassword,
    // comfirm,
    result,
    checkUserName,
    problem,
    safeProblem
  },
  data() {
    const self = this;
    return {
      activeTabName: 'first',
      activeIndex: 0,
      steps: 'LOGON_FIRST',
      formData: {
        userName:''
      },
      message: {},
      user: {
        type: 'administrator' // 用户类型
      },
      resetLogin:''
    };
  },

  computed: {
    // 首次登陆 步骤条
    stepsList() {
      const self = this;
      return [
        {
          title: self.$t('FIRST_LOGIN.VERIFY_INFORMATION'),
          description: ''
        },
        {
          title:self.$t('FIRST_LOGIN.CHECK_PASSWORD'),
          description: ''
        },
        {
          title: self.$t('FIRST_LOGIN.VERIFY_MOBILE_PHONE'),
          description: ''
        },
        {
          title: self.$t('FIRST_LOGIN.SETUP_PRIVATE_QUESTIONS'),
          description: ''
        },
        {
          title: self.$t('FIRST_LOGIN.CAHNGE_PASSWORD'),
          description: ''
        },
        // {
        //   title: self.$t('FIRST_LOGIN.COMFIRM_INFORMATION'),
        //   description: ''
        // },
        {
          title: self.$t('FIRST_LOGIN.SUBMIT_RESULTS'),
          description: '',
          status: ''
        }
      ];
    },
    // 重置密码步骤条
    stepsLists() {
      const self = this;
      return [
        {
          title: self.$t('FIRST_LOGIN.VERIFY_INFORMATION'),
          description: ''
        },
        {
          title: self.$t('FIRST_LOGIN.VERIFY_MOBILE_PHONE'),
          description: ''
        },
        {
          title: self.$t('FIRST_LOGIN.CAHNGE_PASSWORD'),
          description: ''
        },
        {
          title: self.$t('FIRST_LOGIN.SUBMIT_RESULTS'),
          description: '',
           status: ''
        }
      ];
    }
  },
  created() {
    // 判断 首次登录还是重置密码流程
    let firstLogin = sessionStorage.getItem('resetLogin');
    this.formData.userName =sessionStorage.getItem('userName');
    console.log(firstLogin, 'firstlogin');
    if (firstLogin=='RESET_PWD') {
      this.steps = 'RESET_PWD';
    } else {
      this.steps ='LOGON_FIRST';
    }
  },
  watch: {},
  methods: {
    toLogin() {
      this.$router.push('/login');
    },
    // 首次登录返回
    back(val) {
      if (this.activeIndex === 5) {
        return this.$router.go(-1);
      }
      this.formData.firstPassword = '';
      this.formData.newUserName = '';
      this.activeIndex--;
    },
    // 重置密码反回
    backTo(val) {
      if (this.activeIndex === 6) {
        return this.$router.go(-1);
      }
      this.formData.otp = '';
      this.formData.firstPassword = '';
      this.formData.newUserName = '';
      this.activeIndex--;
    },
    // 首次登录下一步
    next(val) {
      if (this.activeIndex === 4) {
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 2) {
        // 调用接口
        // 接口状态返回正常
      
        this.message = val;
        if(this.message.status=='success'){
          this.stepsLists[3].status ='success'
        }else{
            this.stepsLists[3].status ='error'
        }
        return this.activeIndex++;
      } else {
        this.formData = val;
        return this.activeIndex++;
      }
    },
    // 重置密码下一步
    toNext(val) {
      if (this.activeIndex === 5) {
        console.log(1);
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 4) {
        // 调用接口
        // 接口状态返回正常
        console.log(val);
        this.message = val;
        console.log(this.message, '2222');
        return this.activeIndex++;
      } else {
        this.formData = val;
        console.log(3);
        return this.activeIndex++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-firstLogin {
  .u-steps {
    margin-top: 36px;
    margin-bottom: 36px;
    margin-left: 25%;
  }
  .u-step {
    margin-top: 36px;
    margin-bottom: 36px;
    margin-left: 6%;
  }
  .u-header {
    background: #fff;
  }
  .g-contant {
    // margin-top: 20px;
    width: 1340px;
    height: 85vh;
    background: #fff;
    margin: 0 auto;
    .u-tabs {
      /deep/ .el-tabs__item.is-active {
        color: #f06b00;
      }
      ::v-deep .el-tabs__header {
        padding-top: 24px;
        padding-left: 24px;
        padding-right: 24px;
      }
    }
    /deep/ .el-tabs__active-bar {
      height: 3px;
      background-color: #f06b00 !important;
      border-radius: 3px;
    }
    .u-inline-block {
      margin-top: 36px;
      margin-left: 24%;
      ::v-deep .el-step__title.is-process {
        color: #f06b00;
      }
    }
    .u-userName {
      ::v-deep .el-input__inner {
        width: 320px;
      }
    }
    .u-userInfo {
      margin-left: 35%;
      margin-top: 36px;
    }
    .u-email ::v-deep .el-input__inner {
      width: 180px;
      height: 36px;
    }
    .u-tips {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      padding-left: 55px;
    }
    .f-btn {
      position: absolute;
      left: 305px;
      height: 36px;
      background: #fff !important;
      color: #f06b00;
      border: 1px solid #f06b00;
      border-radius: 4px;
    }
    .f-code {
      position: absolute;
      left: 250px;
      height: 36px;
      width: 128px;
      background: #fff !important;
      color: #f06b00;
      border: 1px solid #f06b00;
      border-radius: 4px;
    }
    .m-code {
      position: absolute;
      left: 230px;
      height: 36px;
      width: 128px;
      background: #fff !important;
      color: #f06b00;
      border: 1px solid #f06b00;
      border-radius: 4px;
    }
    .m-btns {
      margin-left: 45px;
      .f-reset,
      .f-next {
        width: 160px;
        height: 36px;
      }
    }
    .f-login {
      width: 210px;
      height: 36px;
    }
  }
  .u-footer {
    margin-top: 12px;
    background: #fff;
  }
}
// .m-userType{
//   width:100%;
//   margin: 0 auto;
// }
/deep/.el-form-item__error {
  left: 15px;
}
</style>
