<template>
  <div class="g-firstLogin" >
    <login-header class="u-header"></login-header>
    <div class="g-contant" style="margin-top: 12px;">
      <el-tabs class="u-tabs" v-model="activeTabName">
        <el-tab-pane :label="$t('FIRST_LOGIN.WELCOME_BANK')" name="first">
          <div class="u-content" v-show="tips">
            <p>{{$t('RESET_USERNAME.MATERIALS_IN_ADVANCE')}}</p>
           
            <ul>
              <li>{{$t('RESET_USERNAME.BANK_DURING_ACCOUNT_OPENING')}}</li>
              <li>{{$t('RESET_USERNAME.OPENED_AT_THE_BANK')}}</li>
              <!-- <li>{{$t('RESET_USERNAME.CORPORATE_INTERNET_BANKING')}}</li> -->
              <li>{{$t('RESET_USERNAME.REGISTERED_WITH_THE_BANK')}}</li>
            </ul>
            
            <div class="u-btn">
              <VButton size="w160" @click="toLogin">{{$t('COMMON.CANCEL')}}</VButton>
              <VButton size="w160" type="primary" style="margin-left:11px;" @click="toRest">{{$t('RESET_USERNAME.RETRIEVE_ONLINE')}}</VButton>
            </div>
          </div>
          <div class="steps" v-show="showSteps">
            <steps :stepsList="getInfo" :activeIndex="activeIndex" class="u-step"></steps>
           <div v-if="meindex">
            <div v-if="activeIndex===0">
              <checkId @next="next" :formData="formData"></checkId>
            </div>
            <div v-if="activeIndex===1">
              <safeProblem @next="next" @back="back" :formData="formData"></safeProblem>
            </div>
            <div v-if="activeIndex===2">
              <checkPhone @next="next" @back="back" :formData="formData" />
            </div>
            <div v-if="activeIndex===3">
              <result :message="message" />
            </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <login-footer class="u-footer"></login-footer>
  </div>
</template>

<script>
import loginHeader from '@/components/login/loginHeader';
import loginFooter from '@/components/home/Footer.vue';
import checkId from './components/checkId.vue';
import safeProblem from './components/safeProblem.vue';
import checkPhone from './components/checkPhone.vue';
import result from './components/result.vue'

export default {
  components: {
    loginHeader,
    loginFooter,
    checkId,
    safeProblem,
    checkPhone,
    result
  },
  data() {
    const self = this;
    return {
      
      meindex:true,
      activeTabName: 'first',
      activeIndex: 0,
      formData: {},
      message: {},
      tips: true,
      showSteps: false,
    };
  },

  computed: {
   getInfo(){
        const stepsList= [
              {
                title: this.$t('RESET_USERNAME.INFORMATION_AND_ACCOUNT_NUMBER'),
                description: ''
              },
              {
                title: this.$t('RESET_USERNAME.VERIFY_SECURITY_QUESTIONS'),
                description: ''
              },
              {
                title: this.$t('RESET_USERNAME.VERIFY_OTP'),
                description: ''
              },
              {
                title:  this.$t('RESET_USERNAME.SUBMIT_RESULTS'),
                description: ''
              }
            ]
      return stepsList
}
  },
  created() {},
  watch: {
   '$i18n.locale'(){ 
    this.meindex=false
    this.$nextTick(()=>{
     this.meindex=true
    })
   },
  },
  methods: {
    toLogin() {
      this.$router.push('/login');
    },
    toRest() {
      this.tips = false;
      this.showSteps = true;
    },
    next(val) {
      if (this.activeIndex === 3) {
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 2) {
        // 调用接口
        // 接口状态返回正常
        console.log(this.activeIndex,'this.activeIndex')
        console.log('val', val);
        this.message = val;

        return this.activeIndex++;
      } else {
        this.formData = val;
        console.log(this.activeIndex, '1');
        return this.activeIndex++;
      }
    },
    back() {
      this.activeIndex--;
    }
  }
};
</script>

<style lang="scss" scoped>
.g-firstLogin {
  .u-steps {
    margin-top: 36px;
    margin-bottom: 36px;
    margin-left: 11%;
  }

  .g-contant {
    // margin-top: 20px;
    width: 1340px;
    height: 960px;
    max-height: 960px;
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
    .u-content {
      width: 370px;
      margin: 0 auto;
      margin-top: 36px;
      p {
        font-size: 16px;
        color: #000;
        font-weight: 500;
      }
      ul {
        margin-top: 19px;
        li {
          font-size: 14px;
          color: rgba($color: #000000, $alpha: 0.45);
          line-height: 24px;
        }
      }
      .u-btn {
        margin-top: 40px;
        display: flex;
      }
    }
    .u-tips {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      padding-left: 55px;
    }
  }
  .u-footer {
    margin-top: 12px;
    background: #fff;
  }
}
/deep/.el-form-item__error {
  left: 15px;
}
.u-step {
  margin-top: 36px;
  margin-bottom: 36px;
  margin-left: 26%;
}
</style>
