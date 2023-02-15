<!-- 存量客戶信息 -->
<template>
  <div class="transverse-table">
    <div class="row">
      <div id="title">{{ $t('RAO_CHECK.EXIT_ACCOUNT_INFO') }}</div>
    </div>
    <div class="row" v-for="(item, index) in stockAccountList" :key="index">
      <div>{{ item.label }}</div>
      <div>{{ item.accNo }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'StockAccountInfo',
  components: {
  },
  props: {
    stockAccountInfos: {
      type: Object,
      default: () => {}
    }, // 存量客户信息
    atm: {}
  },
  data() {
    return {
      stockAccountList: [
        {
          label: this.$t('RAO_CHECK.CIF'),
          accNo: '',
        },
        {
          label: this.$t('RAO_CHECK.TERMLY'),
          accNo: '',
        },
        {
          label: this.$t('RAO_CHECK.ELECTRONIC_STATEMENTS'),
          accNo: '',
        },
      ], // 账户信息
    };
  },
  watch: {
    stockAccountInfos: {
      handler(news, olds) {
        // cif
        this.$set(this.stockAccountList[0], 'accNo', news.cifAcct)
        // 定期
        this.$set(this.stockAccountList[1], 'accNo', news.tdAcct)
        // 综合结单
        this.$set(this.stockAccountList[2], 'accNo', news.csAcct)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},
  created() {
  },

  mounted() {
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
