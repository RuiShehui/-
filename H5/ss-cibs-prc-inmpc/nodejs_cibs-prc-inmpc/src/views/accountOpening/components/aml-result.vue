<!-- 开户结果 -->
<template>
  <div class="transverse-table" v-show="isShow">
    <div class="row">
      <div id="title">{{ $t('RAO_CHECK.AMLRESULT') }}</div>
    </div>
    <div class="row" v-for="(item, index) in amlResultList" :key="index">
      <div>{{ item.label }}</div>
      <div>{{ item.value }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AccountOpeningStatus',
  components: {
  },
  props: {
    amlResult: {
      type: Object,
      default: () => {}
    }, // AML结果
  },
  data() {
    return {
      // 是否显示AML结果
      isShow: false,
      amlResultList: [
        {
          label: this.$t('RAO_CHECK.AML_RISK_CODE'),
          value: ''
        },
        {
          label: this.$t('RAO_CHECK.AML_TOTAL_RISK_CODE'),
          value: ''
        },
        {
          label: this.$t('RAO_CHECK.AML_RISK_LEVEL'),
          value: ''
        },
        {
          label: this.$t('RAO_CHECK.AML_REVIEW_LEVEL'),
          value: ''
        }
      ]
    };
  },
  watch: {
    amlResult(news) {
      this.isShow = Boolean(news.eCaraRiskRating || news.eCaraRiskResult || news.eCaraRiskReview || news.eCaraRiskScore)
      // RISK_CODE
      this.$set(this.amlResultList[0], 'value', news.eCaraRiskResult)
      // AML_TOTAL_RISK_CODE
      this.$set(this.amlResultList[1], 'value', news.eCaraRiskScore)
      // AML_RISK_LEVEL
      this.$set(this.amlResultList[2], 'value', news.eCaraRiskRating)
      // AML_REVIEW_LEVEL
      this.$set(this.amlResultList[3], 'value', news.eCaraRiskReview)
    }
  },
  computed: {

  },
  created() {
  },

  mounted() {
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
.f-w-340 {
  width: 340px;
}
#bgc-fff {
  background-color: #fff;
}
</style>
