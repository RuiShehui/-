<!--
 * @Author: your name
 * @Date: 2022-09-17 10:19:16
 * @LastEditTime: 2022-09-26 10:04:18
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\authManagement\tranDetail\index.vue
-->
<template>
  <div class="u-detail">
    <div class="u-temSet">
      <divider  :title="$t('COMMON.DETAIL')" />
      <div class="u-content">
        <detail-item :title="$t('AUTHORIZE.AUTH_TEMPLATE')" :content="jsonRow.modelName" />
        <detail-item :title="$t('RIGHTS_TEMPLATE.MODULE_TYPE')" :content="jsonRow.modelType==='1'?$t('RIGHTS_TEMPLATE.CASH_MODULE'):$t('RIGHTS_TEMPLATE.NO_CASH_MODULE')" />
      </div>
      <el-table :data="moneyData">
        <el-table-column :label="$t('RIGHTS_TEMPLATE.TO_AMMOUNT')" min-width="25%" v-if="jsonRow.modelType==='1'">
          <template
            slot-scope="scope"
          >{{currencyFormat(scope.row.amountStart,'', 2) }} &nbsp;&nbsp;&lt;&nbsp;{{$t('COMMON.MONEY')}}&nbsp;&lt;=&nbsp;&nbsp;{{currencyFormat(scope.row.amountEnd,'', 2) }}</template>
        </el-table-column>
        <el-table-column min-width="25%" prop="levelANumber" style="width: 150px" :label="$t('AUTHORIZE.AUTH_APEOPLE')"></el-table-column>
        <el-table-column min-width="25%" prop="levelBNumber" :label="$t('AUTHORIZE.AUTH_BPEOPLE')"></el-table-column>
        <el-table-column min-width="25%" prop="levelCNumber" :label="$t('AUTHORIZE.AUTH_CPEOPLE')"></el-table-column>
      </el-table>
    </div>
    <div class="flexc">
      <v-button @click="returnClick">{{$t('COMMON.BACK')}}</v-button>
    </div>
  </div>
</template>
<script>
import Divider from '../../operatorMaintain/components/divider';
import tool from '@/dataTools/tools/moneyTools.js';
export default {
  components: {
    Divider
  },
  data() {
    return {
      jsonRow: {},
      moneyData: [
        {
          startMoney: '0.00',
          endMoney: '100000.00',
          levelANumber: '1',
          levelBNumber: '1',
          levelCNumber: '1'
        }
      ]
    };
  },
  created() {
    this.jsonRow = this.$route.query.modelInfo;
    if (this.jsonRow.amuntUserList) {
      this.moneyData = this.jsonRow.amuntUserList;
      // this.moneyData.forEach(item => {
      //   item.amountEnd = tool.currencyFormat(item.amountEnd, '', 2);
      //   item.amountStart = tool.currencyFormat(item.amountStart, '', 2);
      // });
    }
  },
  methods: {
    returnClick() {
      // this.$router.go(-1);
      this.$router.push({
        path: '/_businessManagement/authManagement/dealMandate',
        query: this.$route.query
      });
    },
      currencyFormat(value = "", currencySign = "", decimals = 2) {
    value = parseFloat(value);
    if (!isFinite(value) || (!value && value !== 0)) return "";
    const stringified = Math.abs(value).toFixed(decimals);
    const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    const i = _int.length % 3;
    const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
    const _float = decimals ? stringified.slice(-1 - decimals) : "";
    const sign = value < 0 ? "-" : "";
    const digitsRE = /(\d{3})(?=\d)/g;
    return (
      sign +
      currencySign +
      head +
      _int.slice(i).replace(digitsRE, "$1,") +
      _float
    );
  },
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>