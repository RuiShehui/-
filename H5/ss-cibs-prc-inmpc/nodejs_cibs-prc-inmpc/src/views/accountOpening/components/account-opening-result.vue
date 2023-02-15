<!-- 开户结果 -->
<template>
  <div class="transverse-table">
    <div class="row">
      <div id="title">{{ $t('RAO_CHECK.ACCOUNT_OPEN_RESULT') }}</div>
    </div>
    <div class="row" v-for="(item, index) in acctResultList" :key="index">
      <div>{{ item.label }}</div>
      <div>{{ item.accNo }}</div>
      <div id="bgc-fff">{{ statusObj[item.status] }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AccountOpeningStatus',
  components: {
  },
  props: {
    accountResult: {
      type: Object,
      default: () => {}
    }, // 开户结果
  },
  data() {
    return {
      acctResultList: [
        {
          label: this.$t('RAO_CHECK.CIF'),
          accNo: '',
          status: ''
        },
        {
          label: this.$t('RAO_CHECK.MCY'),
          accNo: '',
          status: ''
        },
        {
          label: this.$t('RAO_CHECK.TERMLY'),
          accNo: '',
          status: ''
        },
        {
          label: this.$t('RAO_CHECK.ATM'),
          accNo: '',
          status: ''
        },
        {
          label: this.$t('RAO_CHECK.EBANK'),
          accNo: '',
          status: ''
        },
        {
          label: this.$t('RAO_CHECK.ELECTRONIC_STATEMENTS'),
          accNo: '',
          status: ''
        },
      ],
      statusObj: {
        Success: this.$t('RAO_CHECK.ACC_SECCESS'),
        Failure: this.$t('RAO_CHECK.ACC_FAILURE'),
        Exist: this.$t('RAO_CHECK.ACC_EXIST'),
        '': '',
      }
    };
  },
  watch: {
    accountResult(news, olds) {
      // cif
      this.$set(this.acctResultList[0], 'status', news.cifStatus)
      this.$set(this.acctResultList[0], 'accNo', news.cifAcct)
      // MCY
      this.$set(this.acctResultList[1], 'status', news.mcyStatus)
      this.$set(this.acctResultList[1], 'accNo', news.mcyAcct)
      // 定期
      this.$set(this.acctResultList[2], 'status', news.tdStatus)
      this.$set(this.acctResultList[2], 'accNo', news.tdAcct)
      // ATM
      this.$set(this.acctResultList[3], 'status', news.atmStatus)
      this.$set(this.acctResultList[3], 'accNo', news.atmAcct)
      // 网银
      this.$set(this.acctResultList[4], 'status', news.nibsStatus)
      this.$set(this.acctResultList[4], 'accNo', news.nibsAcct)
      // 综合结单
      this.$set(this.acctResultList[5], 'status', news.csStatus)
      this.$set(this.acctResultList[5], 'accNo', news.csAcct)
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
