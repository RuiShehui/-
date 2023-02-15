<template>
  <div class="g-firstLogin">
    <login-header class="u-header"></login-header>
    <div class="g-contant" style="margin-top: 12px;">
      <el-tabs class="u-tabs" v-model="activeTabName">
        <el-tab-pane :label="$t('FIRST_LOGIN.WELCOME_BANK')" name="first">
          <steps :stepsList="stepsList" :activeIndex="activeIndex" class="u-steps"></steps>
          <div v-if="activeIndex===0">
            <checkId @next='next'  ></checkId>
          </div>
          <div v-if="activeIndex===1">
            <result :message="message" ></result>
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
import checkId from './checkId.vue';
import result from './result.vue'
export default {
  components: {
    loginHeader,
    loginFooter,
    checkId,
    result
  },
  data() {
    return {
      activeTabName: 'first',
      activeIndex: 0,
      steps: 'NORMAL_FIRST',
      // stepsList: [
      //   {
      //     title: this.$t('FIRST_LOGIN.LOGIN_CHECK'),
      //     description: ''
      //   },
      //   {
      //     title: this.$t('FIRST_LOGIN.CHECK_RESULT'),
      //     description: ''
      //   },
      // ],
      // formData: {},
      message: {},
    };
  },
  computed: {
    stepsList(){
      const self =this
      return[
          {
          title: self.$t('FIRST_LOGIN.LOGIN_CHECK'),
          description: ''
        },
        {
          title: self.$t('FIRST_LOGIN.CHECK_RESULT'),
          description: ''
        },
      ]
    }
  },
  created() {

  },
  watch: {},
  methods: {
   next(val) {
      if (this.activeIndex === 2) {
        // console.log(1)
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 1) {
          //  console.log(2)
        return this.activeIndex++;
      } else {
          this.message = val;
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
    margin-left: 35%;
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
/deep/.el-form-item__error {
  left: 15px;
}
</style>
