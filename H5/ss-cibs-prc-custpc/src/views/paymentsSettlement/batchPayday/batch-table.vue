<template>
  <el-table class="batch-payment-table" :data="tableData" :stripe="true" :height="height">
    <el-table-column :label="$t('PAYMENT.WEBBANK_FLOW_NO')" width="240">
      <template v-slot="{ row }">
        <span
          style="color:#f06b00;cursor: pointer;"
          @click="replaceToDetails(row)"
        >{{ row.batchNo }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('PAYMENT.PAYMENT_ACCOUNT')" width="160" prop="creditAcct">
      <template v-slot="{ row }">
        {{
        `${formatAcctNo(row.creditAcct)} ${
        row.ccy ? row.ccy : ''
        } ${getProcessType(row.creditAcctType)}`
        }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')" width="190" prop="feeAcct">
      <template v-slot="{ row }">{{ formatAcctNo(row['feeAcct']) }}</template>
    </el-table-column>
    <el-table-column :label="$t('PAYMENT.RESPOS_HANDLE_DATE')" width="140" prop="scheduleDate" />
    <el-table-column :label="$t('PAYMENT.TOTAL_AMOUNT')" width="160" prop="tradeAmount">
      <template
        slot-scope="scope"
      >{{scope.row.tradeAmount? scope.row.cur + ' ' + scope.row.tradeAmount : ''}}</template>
    </el-table-column>
    <el-table-column :label="$t('PAYMENT.CHARGE_CCY')" width="160" prop="serviceCharge">
      <template
        slot-scope="scope"
      >{{scope.row.serviceCharge? scope.row.cur + ' ' + scope.row.serviceCharge : ''}}</template>
    </el-table-column>
    <el-table-column :label="$t('PAYMENT.TOTAL_TRANS')" width="100" prop="tradeNumber" />
    <el-table-column :label="$t('PAYMENT.DEAL_AMOUNT')" width="160" prop="successAmount">
      <template
        slot-scope="scope"
      >{{scope.row.successAmount? scope.row.cur + ' ' + scope.row.successAmount : ''}}</template>
    </el-table-column>
    <el-table-column :label="$t('PAYMENT.DEAL_TRANS')" width="120" prop="successNumber" />
    <el-table-column :label="$t('PAYMENT.INPUT_TYPE')" width="160" prop="inputType" />
    <el-table-column :label="$t('PAYMENT.BATCH_DEAL_STATUS')" width="160" prop="state" />
    <el-table-column :label="$t('PAYMENT.DETAIL_DATE')" width="200" prop="createTime" />
  </el-table>
</template>

<script>
import { confirm } from '@bank-transfer/mixins';
export default {
  name: 'BatchPayDetailTable',
  mixins: [confirm],
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    height: [Number, String]
  },
  methods: {
    replaceToDetails(row) {
      this.$emit('replaceToDetails', row);
    }
  }
};
</script>

<style scoped lang="scss">
.batch-payment-table {
  width: 1040px;
}
</style>
