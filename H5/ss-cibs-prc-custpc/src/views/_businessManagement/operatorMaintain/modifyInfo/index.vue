<template>
  <div class="modifyInfoWapper">
    <steps :stepsList="stepsList" class="steps" :activeIndex="activeIndex" />
    <!-- 基本信息 -->
    <div v-if="activeIndex === 0">
      <basic-info :basicInfoForm="basicInfoForm" @next="next" @back="back" />
    </div>

    <!-- 确认信息 -->
    <div v-if="activeIndex === 1">
      <confirm-info :confirmInfo="basicInfoForm" @next="next" @back="back" />
    </div>

    <div v-if="activeIndex === 2">
      <operate-result @back="back" :message="message" />
    </div>
  </div>
</template>
<script>
import basicInfo from './components/basicInfo';
import confirmInfo from './components/confirmInfo';
import OperateResult from './components/confirmResult';
export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    basicInfo,
    confirmInfo,
    OperateResult
  },
  data() {
    return {
      // 步骤条
      stepsList: [
        {
          title: this.$t('USER_MANAGERMENT.UPDATE_MESSAGE'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.CONFIRM_INFO'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.TIJIAO'),
          description: ''
        }
      ],
      activeIndex: 0,
      basicInfoForm: {}
    };
  },
  created() {
    this.basicInfoForm = this.$route.query.row;
  },
  methods: {
    //   返回
    back() {
      if (this.activeIndex === 2) {
        return this.$router.go(-1);
      }
      this.activeIndex--;
    },
    // 下一步
    next(info) {
      this.basicInfoForm = info;
      if (this.activeIndex === 1) {
        // 调用接口
        // 接口状态返回正常
        let message = {
          status: 'success',
          title: this.$t('COMMON.SUBMIT_SUCCESS'),
          desc: this.$t('COMMON.FLOW_NO') + ': 1231213213213'
        };
        this.message = message;

        return this.activeIndex++;
      } else {
        this.activeIndex++;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.modifyInfoWapper {
  .steps {
    width: 540px;
    margin: 0 auto;
  }
}
</style>