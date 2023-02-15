<!-- 备注信息 -->
<template>
  <div class="transverse-table">
    <div class="row">
      <div id="title">{{ $t('RAO_CHECK.REMARKS_INFO') }}</div>
    </div>
    <template v-if="raoRemarkList.length > 0">
      <div class="row" v-for="(item, index) in raoRemarkList" :key="index">
        <div class="w-60 bgc-fff">{{item.checkerType}} {{ item.checkerName }}: {{ item.checkerResion }}</div>
        <div class="">
          <div :class="checkClass(item.checkType)">{{ raoRemarkObj[item.checkType] }}</div>
        </div>
        <div class="bgc-fff">{{ item.creationTime }}</div>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="w-60 bgc-fff"></div>
        <div class="">
          <div></div>
        </div>
        <div class="bgc-fff"></div>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  name: 'RemarkInfo',
  components: {
  },
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    raoRemarkList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      raoRemarkObj: {
        Approve: this.$t('RAO_CHECK.CHECK_PASS'),
        Reject: this.$t('RAO_CHECK.CHECK_REJECT'),
        Confirm: this.$t('RAO_CHECK.ADOPT'),
        BackToMaker: this.$t('RAO_CHECK.REFUSE'),
        Success: this.$t('RAO_CHECK.ACC_OPRN_SUCCESS'),
        Fail: this.$t('RAO_CHECK.ACC_OPRN_FAIL'),
      }
    };
  },
  computed: {},
  created() {
  },

  mounted() {
  },

  methods: {
    // 审核样式
    checkClass(otp) {
      if(['Approve', 'Confirm', 'Success'].includes(otp)) {
        return 'success'
      }
      if(['Reject', 'BackToMaker', 'Fail'].includes(otp)) {
        return 'fail'
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bgc-fff {
  background-color: #fff !important;
}
.w-60{
  width: 60% !important;
}
.w-inherit {
  width: inherit !important;
}
.w-180 {
  min-width: 180px !important;
}
.success {
  padding: 4px 16px;
  background-color: #0cc71A;
  border-radius: 4px;
  color: #ffffff;
}
.fail {
  padding: 4px 16px;
  background-color: #F23F47;
  border-radius: 4px;
  color: #ffffff;
}
</style>
