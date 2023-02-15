<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 16:20:56
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 10:34:43
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\transaction-auth-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="g-userManagementDetail">
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO_LABEL') }}</div>
        <div>{{ tableData[0].ebankCstmNo }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_NAME') }}</div>
        <div>{{ ebankCsInfo[0].entName }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.STATUS') }}</div>
        <div>{{ ebankCsInfo[0].authStatus }}</div>
      </div>
      <div v-for="(item,index) in ebankCsInfo[0].cardList" :key="index+'ebank'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') + (index + 1) }}</div>
          <div>{{ item.cardType }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') + (index + 1) }}</div>
          <div>{{ item.cardNo }}</div>
        </div>
      </div>
      <el-tabs model="option">
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL')" name="option"></el-tab-pane>
      </el-tabs>
      <div v-for="(item,i) in hasMoneyList" :key="i + 'no'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.TRANSACTION_ACC')}}</div>
          <div>{{ item.acctNo }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.TRANSACTION_NAME') }}</div>
          <div>{{ item.tradeType | tradeTypeNameFilter }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.TEMPLATE_TYPE') }}</div>
          <div>{{ item.modelName }}</div>
        </div>
      </div>
      <el-tabs model="option">
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.NO_AMOUNT_TRANSACTION_TYPE')" name="option"></el-tab-pane>
      </el-tabs>
      <div v-for="(item,k) in withoutMoneyList" :key="k">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.TRANSACTION_NAME') }}</div>
          <div>{{ item.tradeType | tradeTypeNameFilter }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME') }}</div>
          <div>{{ item.modelName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryMerchantList } from '@/api/customer-management/customer';
import CONSTANTS from '@/utils/constant.js';
import filters from '@/filters/business';
export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  filters,
  data() {
    return {
      tableData: [],
      hasMoneyList: [],
      withoutMoneyList: [],
      ebankCsInfo: [
        { entName: '', authStatus: '', cardList: [], amuntUserList: [] }
      ]
    };
  },
  computed: {},
  async created() {
    this.tableData = JSON.parse(this.options.temp.afterMdJson).body.list;
    console.log('this.tableData---详情页s----修改授权模板', this.tableData);
    const result = await queryMerchantList({
      ebankCstmNo: this.tableData[0].ebankCstmNo,
      serchType: '1'
    });
    this.tableData.forEach(item => {
      if (item.approvalType === '1') {
        this.hasMoneyList.push(item);
      } else {
        this.withoutMoneyList.push(item);
      }
    });

    console.log(result);
    let lang = JSON.parse(sessionStorage.getItem('head')).lang;
    if (lang !== 'en' && result.body[0].entChsName !== '') {
      this.ebankCsInfo[0].entName = result.body[0].entChsName;
    } else {
      this.ebankCsInfo[0].entName = result.body[0].entEglsName;
    }
    this.ebankCsInfo[0].authStatus = CONSTANTS.ENABLE[result.body[0].status];
    this.ebankCsInfo[0].cardList = result.body[0].cardList;
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
