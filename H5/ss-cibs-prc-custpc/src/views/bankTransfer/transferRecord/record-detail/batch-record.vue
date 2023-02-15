<template>
  <div class="batch-detail-wrapper">
    <div class="m-detail-content">
      <!-- 编号 -->
      <detail-item :title="$t('PAYMENT.WEBBANK_FLOW_NO')" :content="showItem.flowNo" />
      <!-- 交易类型 -->
      <detail-item
        :title="$t('PAYMENT.TRANS_TYPE')"
        :content="escapeTransType(showItem.businessCode)"
      />
      <!-- 付款账户 -->
      <detail-item
        :title="$t('PAYMENT.PAYMENT_ACCOUNT')"
        :content="
          `${formatAcctNo(showItem.debitAcct)} ${
            showItem.ccy
          } ${getProcessType(showItem.debitAcctType)}`
        "
      />
      <!-- 成交金额 (缺省) -->
      <detail-item :title="$t('PAYMENT.DEAL_AMOUNT')" :content="`${String(showItem.amount).toMoney()} ${showItem.ccy}`" />
      <!-- 成交笔数 -->
      <detail-item :title="$t('PAYMENT.DEAL_TRANS')" :content="showItem.successNum" />
      <!-- 手续费扣款账户 -->
      <detail-item
        :title="$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')"
        :content="
          `${formatAcctNo(showItem.feeAcct)} ${
            showItem.ccy
          } ${getProcessType(showItem.feeAcctType)}`
        "
      />
      <!-- 手续费 -->
      <detail-item
        :title="$t('PAYMENT.CHARGE_CCY')"
        :content="
          `${showItem.chargeAmt} ${
            showItem.chargeCcy ? showItem.chargeCcy : ''
          } ${showItem.ccy}`
        "
      />
      <!-- 提交时间 -->
      <detail-item
        :title="$t('APPOINTTRACTION.SUBMIT_TIME')"
        :content="showItem.submitTime | filterLinkTime"
      />
    </div>

    <div class="g-payDayDetails">
      <el-table :data="tableDatas">
        <el-table-column :label="$t('TRANSFR_INFO.NUMBER')" type="index" width="60"></el-table-column>
        <el-table-column :label="$t('TRANSFR_INFO.CUT_ACCOUNT')" prop="debitAcct"></el-table-column>
        <el-table-column :label="$t('TRANSFR_INFO.ACCOUNT_NAME')" prop="debitAcctName"></el-table-column>
        <el-table-column prop="bankCode" :label="$t('TRANSFR_INFO.BANKNAME')">
          <template
          v-slot="{ row }"
        >{{row.bankCode}} {{ filterBankInfo(row.bankCode) ? filterBankInfo(row.bankCode) : row.bankName }}</template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('TRANSFR_INFO.AMOUNT')">
          <template v-slot="{row}">{{row.amount | formatMoneyNew}}</template>
        </el-table-column>
        <el-table-column :label="$t('TRANSFR_INFO.CUR')" prop="cur" width="90"></el-table-column>
        <el-table-column :label="$t('TRANSFR_INFO.TRADESTATE')" prop="tradeState" width="90"></el-table-column>
        <el-table-column :label="$t('PAYMENT.POSTSCRIPT')" prop="additionalComment" width="150"></el-table-column>
        <el-table-column :label="$t('TRANSFR_INFO.RETURNMAG')" prop="returnMag" width="90"></el-table-column>
      </el-table>
      <pageNation
        class="mt16"
        :total="total"
        :page_index="current"
        @sizeChange="sizeChange"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { confirm } from '@bank-transfer/mixins';
import { escapeTransType } from '@bank-transfer/utils/filters';
import { batchDetail } from '@/api/cashManage';
import { bankInfos } from '@/mixins';
import { formatMoneyNew } from '@/utils/tools';
export default {
  name: 'BatchRecord',
  components: {},
  mixins: [confirm],
  props: {
    detailItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showItem: {},
      tableDatas: [],
      batchNo: '',
      current: 1,
      size: 10,
      total: 0
    };
  },
  filters: {
    formatMoneyNew: formatMoneyNew
  },
  computed: {},
  mounted() {
    if (Object.keys(this.detailItem).length) {
      this.$set(this, 'showItem', this.detailItem);
    }
    if (this.$route.query.params) {
      this.$set(this, 'showItem', this.$route.query.params);
    }
    this.batchDetailInit();
  },
  methods: {
    escapeTransType,

    async batchDetailInit() {
      let params = {
        batchNo: this.showItem.flowNo,
        current: this.current,
        size: this.size
      };
      console.log('參數', params);
      let res = await batchDetail(params);
      this.total = res.total;
      this.tableDatas = res.list;
      this.tableDatas.map(item => {
        switch (item.tradeState) {
          case '0':
            item.tradeState = this.$t('TRANSFR_INFO.TRANS_SUCCESS');
            break;
          case '1':
            item.tradeState = this.$t('TRANSFR_INFO.FAILED');
            break;
          case '6':
            item.tradeState = this.$t('TRANSFR_INFO.FAILED');
            break;
          case '2':
            item.tradeState = this.$t('TRANSFR_INFO.WAIT');
            break;
          case '3':
            item.tradeState = this.$t('TRANSFR_INFO.NOW_EXCUCTE');
            break;
          case '4':
            item.tradeState = this.$t('TRANSFR_INFO.DESTORYED');
            break;
          case '5':
            item.tradeState = this.$t('TRANSFR_INFO.HUAN_YI');
            break;
        }
      });
      console.log('數據', res);
    },
    sizeChange(size) {
      this.size = size.page_limit;
      this.batchDetailInit();
      console.log('size---', this.size);
    },
    pageChange(page) {
      this.current = page.page_index;
      this.batchDetailInit();
      console.log('current---', this.current);
    }
  }
};
</script>

<style lang="scss" scoped>
.batch-detail-wrapper {
  width: 100%;

  ::v-deep .el-table th.el-table__cell > .cell {
    padding: 0 !important;
  }
  ::v-deep .el-table .cell {
    padding: 0 !important;
  }
  ::v-deep .el-table .el-table__cell {
    padding: 0 !important;
  }
  ::v-deep .el-table .el-table__cell .div {
    padding: 0 !important;
  }
  ::v-deep .el-table .el-table__row {
    height: 46px;
  }
  .m-detail-content {
    width: 940px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    flex-wrap: wrap;
    .detailItem {
      margin-bottom: 16px;
      &:nth-child(2n) {
        margin-left: 52px;
      }
    }
  }
}
</style>
