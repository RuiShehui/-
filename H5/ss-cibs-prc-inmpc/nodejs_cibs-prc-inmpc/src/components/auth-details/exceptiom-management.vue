<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 15:38:10
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-17 10:43:59
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\authorization-details\exceptiom-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{ $t('BUSINESS_MANAGEMENT.TRADE_SCENE') }}</div>
      <div>{{tableData.tradeType | tradeTypeText}}</div>
      <div>{{ $t('BUSINESS_MANAGEMENT.TRAN_DATE') }}</div>
      <div>{{tableData.createDate}}</div>
    </div>
    <div class="row">
      <div>{{ $t('BUSINESS_MANAGEMENT.TRADE_STATUS') }}</div>
      <div>{{tableData.status | tradeStatusText}}</div>
      <div>{{ $t('BUSINESS_MANAGEMENT.DEBIT_ACCOUNT_NO') }}</div>
      <div>{{tableData.flowNo}}</div>
    </div>

    <div class="row">
      <div>{{ $t('BUSINESS_MANAGEMENT.PAYER_ACCOUNT') }}</div>
      <div>{{tableData.drAcct}}</div>
      <div>{{ $t('BUSINESS_MANAGEMENT.STAFF_ACCOUNT') }}</div>
      <div>{{tableData.crAcct}}</div>
    </div>
    <div class="row">
      <div>{{ $t('BUSINESS_MANAGEMENT.CURRENCY') }}</div>
      <div>{{(tableData.cur)}}</div>
      <div>{{ $t('BUSINESS_MANAGEMENT.TRADE_MONEY_TYPE') }}</div>
      <div>{{tableData.amount}}</div>
    </div>
    <div class="row">
      <div>{{ $t('BUSINESS_MANAGEMENT.TRADE_INFO') }}</div>
      <div>{{tableData.returnMsg}}</div>
    </div>
  </div>
</template>

<script>
import filters from '@/filters/business';
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  filters,
  data() {
    return {
      tableData: {},
    };
  },
  computed: {},
  created() {
    console.log('打印options', JSON.parse(this.options.temp.afterMdJson));
    this.tableData =  JSON.parse(this.options.temp.afterMdJson).body
  },
  methods: {
    // 返回
    backTo() {
      this.$router.push('/businessMangament');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/businessMangament/detail'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.g-detail {
  background: #fff;
  min-height: 100%;
}
.g-tabs {
  margin-top: 3.5%;
  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
</style>
