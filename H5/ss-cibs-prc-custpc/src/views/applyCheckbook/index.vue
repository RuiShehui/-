<template>
  <div class="g-applyCheckbook">
    <steps
      :stepsList="$t('HEAD.Steps')"
      :activeIndex="activeIndex"
      :getWayList="getWayList"
      class="u-steps"
    />
    <!-- 填写页面 -->
    <form-info
      v-if="activeIndex === 0"
      :formData="formData"
      :getWayList="getWayList"
      @next="toNextPage"
      @setFormData="setFormData"
    />
    <!-- 确认页面 -->
    <confirm-info
      v-if="activeIndex === 1"
      :formData="formData"
      :getWayList="getWayList"
      @next="toResultPage"
      @back="toBackPage"
    />
    <!-- 结果页面 -->
    <result-info v-if="activeIndex === 2" :message="message" @reset="onReset" />
  </div>
</template>

<script>
import FormInfo from './components/formInfo.vue';
import ConfirmInfo from './components/confirm-page.vue';
import ResultInfo from './components/result.vue';

export default {
  name: 'ApplyCheckBook',
  inject: ['scrollToTop'],
  components: {
    FormInfo,
    ConfirmInfo,
    ResultInfo
  },
  data() {
    return {
      activeIndex: 0,
      stepsList: [
        {
          title: this.$t('COMMON.STEPS_FILL_INFORMATION')
        },
        {
          title: this.$t('COMMON.STEPS_COMFIRM_INFORMATION')
        },
        {
          title: this.$t('COMMON.STEPS_RESULT_INFORMATION')
        }
      ],
      formData: {},
      message: {},
      getWayList: [
        {
          label: this.$t('AUTHORIZE.Surface_Mail'),
          value: '0'
        }
      ]
    };
  },
  mounted() {
    this.scrollToTop();
  },

  methods: {
    setFormData(newFormData) {
      this.$set(this, 'formData', newFormData);
      console.log(this.formData);
    },
    back(val) {
      if (this.activeIndex === 1) {
        return this.activeIndex--;
      }
      this.formData = val;
      this.activeIndex--;
    },
    toBackPage() {
      if (this.activeIndex === 0) {
        return;
      }
      this.activeIndex -= 1;
    },
    toNextPage() {
      if (this.activeIndex === 2) {
        return;
      }
      this.activeIndex += 1;
    },
    toResultPage({
      authResultState = '90',
      flowNo = '',
      authResultMessage = '',
      hostMessage = ''
    }) {
      console.log(arguments[0]);
      if (authResultState && authResultState !== '91') {
        this.message = {
          flag: authResultState === '03',
          status: 'success',
          title: this.$t('COMMON.SUBMIT_SUCCESS'),
          desc: `${this.$t('COMMON.FLOW_NO')}: ${flowNo}`,
          succ: true
        };
      } else {
        this.message = {
          status: 'fail',
          title: this.$t('COMMON.SUBMIT_FAIL'),
          desc: `${this.$t('AUTHORIZE.FAIL_WHY')}: ${authResultMessage} ${hostMessage}`,
          succ: false
        };
      }

      this.toNextPage();
    },
    onReset() {
      this.formData = {};
      this.activeIndex = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.u-steps {
  // margin-left: 27%;
}
/deep/ .el-steps {
  display: flex;
  justify-content: center !important;
}
</style>
