<template>
  <div>
    <div class="g-transation-detail">
      <title-bar :title="$t('ACCOUNT_MANAGEMENT.DETAIL_MESSAGE')"></title-bar>
      <div class="m-transation-detail-content">
        <!-- 交易流水号 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.SERIALNO')"
          :content="transationParams.transactionSerialNo || '- -'"
        />
        <!-- 交易时间 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.TRADE_TIME')"
          :content="transationParams.transactionTime || '- -'"
        />
        <!-- 交易类型 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.TRANSATION_TYPE')"
          :content="transationParams.transactionType || '- -'"
        />
        <!-- 存入 -->
        <detail-item
          v-if="transationParams.cramt"
          :title="$t('ACCOUNT_MANAGEMENT.INCOME')"
          :content="formatMoney(transationParams.currency,transationParams.cramt) || '- -'"
        />
        <!-- 支出 -->
        <detail-item
          v-if="transationParams.dbamt"
          :title="$t('ACCOUNT_MANAGEMENT.WITHDRAWAL')"
          :content="formatMoney(transationParams.currency,transationParams.dbamt) || '- -'"
        />
        <!-- 对方账户 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.RECIPROCAL_ACCOUNT')"
          :content="transationParams.reciprocalAccount || '- -'"
        />
        <!-- 对方户名 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.COUNTERPART_ACCOUNT_NAME')"
          :content="transationParams.reciprocalName || '- -'"
        />
        <!-- 可用结余 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_BALANCE')"
          :content="formatMoney(transationParams.currency,transationParams.availableBalance) || '- -'"
        />
        <!-- 对方银行 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.RECIPROCAL_BANK')"
          :content="transationParams.reciprocalBank || '- -'"
        />
        <!-- 摘要 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ABSTRACT')"
          :content="transationParams.abstractStr || '- -'"
        />
        <!-- 附言 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.PS')"
          :content="transationParams.postscript || '- -'"
        />
      </div>
      <div class="g-btn">
        <v-button size="w210" type @click="returnBtn">{{$t('ACCOUNT_MANAGEMENT.BACK')}}</v-button>
      </div>
    </div>
  </div>
</template>

<script>
// import accountCurrent from './components/accountCurrent';
import { formatMoney } from '@/utils/tools.js';
export default {
  components: {
    // accountCurrent
  },
  data() {
    return {
      transationParams: {
        referenceNo: '',
        transType: '',
        counterpartAccountNum: '',
        // transType: '',
        counterpartBank: '',
        transTime: '',
        transAmount: '',
        counterpartAccountName: '',
        availableBalance: '',
        ps: ''
      }
    };
  },
  created() {
    console.log('传参', this.$route.query);
    this.transationParams = this.$route.query;
  },
  methods: {
    formatMoney,
    headerStyle() {
      return {
        'font-size': '14px',
        'background-color': '#f3f3f3',
        'text-align': 'center'
      };
    },
    returnBtn() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-transation-detail {
  .nav-bar {
    margin-bottom: 20px;
  }
  .m-transation-detail-content {
    width: 940px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 70px;
    .detailItem:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  .g-btn {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 1440px) {
  .asset-view {
    .el-pagination {
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>