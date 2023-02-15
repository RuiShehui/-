<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <div class="u-content">
        <div class="u-content__item">
          <!-- 投资账户 -->
          <div class="u-content__item__left">{{ $t('FUND.INVESTMENT_ACCOUNT') }}</div>
          <div class="u-content__item__right">{{ formData.invAcctNo }}</div>
        </div>
        <div class="u-content__item">
          <!-- 基金公司 -->
          <div class="u-content__item__left">{{ $t('FUND.FUND_COMPANY') }}</div>
          <div class="u-content__item__right">{{ formData.fundHouseName }}</div>
        </div>
        <div class="u-content__item">
          <!-- 基金编号 -->
          <div class="u-content__item__left">{{ $t('FUND.FUND_CODE') }}</div>
          <div class="u-content__item__right">{{ formData.fundProductCode }}</div>
        </div>
        <div class="u-content__item">
          <!-- 基金名称/类别/货币(转出) -->
          <div class="u-content__item__left">{{ $t('FUND.FUND_NAME_TYPE_CCY_OUT') }}</div>
          <div
            class="u-content__item__right"
          >{{ `${formData.fundProductName}-${formData.assetTypeName}/${formData.fundCCY}` }}</div>
        </div>
        <div class="u-content__item">
          <!-- 结算账户 -->
          <div class="u-content__item__left">{{ $t('FUND.SETTLEMENT_ACCOUNT') }}</div>
          <div class="u-content__item__right">{{ formData.settleAcctNo }}</div>
        </div>
        <div class="u-content__item">
          <!-- 认购金额 -->
          <div class="u-content__item__left">{{ $t('FUND.SUBSCRIPTION_AMOUNT') }}</div>
          <div class="u-content__item__right">{{ formData.subscriptAmount }}</div>
        </div>
        <div class="u-content__item">
          <!-- 认购费(折扣后) -->
          <div class="u-content__item__left">{{ $t('FUND.SUBSCRIPTION_FEE_AFTER') }}</div>
          <div class="u-content__item__right">{{ formData.flexChargeDisplay }}</div>
        </div>
        <div class="u-content__item">
          <!-- 交易类型 -->
          <div class="u-content__item__left">{{ $t('FUND.TRANSATION_TYPE') }}</div>
          <!-- 认购 -->
          <div class="u-content__item__right">{{$t('AUTHORIZE.BUY')}}</div>
        </div>
        <div class="u-content__item">
          <!-- 提交时间 -->
          <div class="u-content__item__left">{{ $t('COMMON.SUBMIT_TIME') }}</div>
          <div class="u-content__item__right">{{ tableData.createTime }}</div>
        </div>
        <div class="u-content__item">
          <!-- 参考编号 -->
          <div
            class="u-content__item__left"
          >{{ $t('REMITTANCECONFIRM.ONLINE_BANKING_SERIAL_NUMBER') }}</div>
          <div class="u-content__item__right">{{ tableData.flowNo }}</div>
        </div>
        <div class="u-content__item" v-if="isProcess">
          <!-- 授权状态 -->
          <div class="u-content__item__left">{{ $t('COMMON.AUTHORIZATION_STATUS') }}</div>
          <div class="u-content__item__right status">{{ authState | authStateFilter }}</div>
        </div>
        <div class="u-content__item" v-show="scene ==='1' || scene ==='3'">
          <!-- 交易状态 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.tradeState')}}</div>
          <div class="u-content__item__right status">{{ tableData.tradeState | tradeStateFilter}}</div>
        </div>
      </div>
    </div>
    <!-- 授权流程 -->
    <div class="m-head mgt-24" v-if="isProcess">{{$t('AUTHORIZE.isProcess')}}</div>
    <!-- <auth-show-detail :authDetailData="authDetailData" /> -->
    <authorizetion-process
      :authStatus="authState"
      class="mgt-24"
      v-if="isProcess"
      :menuCode="tableData.transactionType"
      :flowNo="tableData.flowNo"
    ></authorizetion-process>
    <authOpinion
      :transactionType="transactionType"
      :detailData="tableData"
      class="mgt20"
      v-if="scene ==='2'"
      @confirm="fundSubscriptionAuth"
    />
  </div>
</template>

<script>
import authorizetionProcess from '../authorizetionProcess';
import { fundSubscriptionAuth } from '@/api/investmentServices';
import authOpinion from '../authOpinion.vue';
import filters from '@/filters/public';
export default {
  name: 'CardDetail050201',
  props: {
    tableData: {
      type: Object,
      default() {
        return {};
      }
    },
    authState: {
      type: String,
      default: ''
    },
    scene: {
      type: String,
      default: '0'
    },
    isProcess: {
      type: Boolean,
      default: false
    },
    res: {
      type: Object,
      default() {
        return {};
      }
    },
    stt: {
      type: String,
      default: ''
    }
  },
  filters,
  components: {
    authorizetionProcess,
    authOpinion
  },
  data() {
    return {
      tranType: '2',
      formData: {},
      transactionType: ''
    };
  },
  created() {
    this.tableData = this.stt ? this.res : this.tableDate;
    this.formData = this.stt
      ? JSON.parse(this.tableData.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.transactionType = this.tableData.transactionType;
  },
  methods: {
    async fundSubscriptionAuth(data) {
      let params = {
        authReqInfo: {
          authActionType: data.radio,
          authActionMessage: data.opinion,
          flowNo: this.tableData.flowNo,
          opType: this.tableData.operationType
            ? this.tableData.operationType.charAt(0)
            : null,
          bsnCode: this.tableData.transactionType
        },
        flowNoList: [this.tableData.flowNo]
      };
      const result = await fundSubscriptionAuth(params);
      if (result) {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: result
        });
        // this.$router.go(-1);
        // this.$message({
        //   type: 'success',
        //   message: '提交成功',
        //   delay: 3000
        // });
        // this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-card-detail-wrapper {
  .m-head {
    border-left: 4px solid #f06b00;
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
    padding-left: 12px;
    margin-bottom: 20px;
  }
  .u-content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    color: pink;
    margin-top: 36px;
    &__item {
      width: 50%;
      display: flex;
      margin-bottom: 16px;
      &__left {
        width: 222px;
        text-align: right;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 22px;
        // margin-left: 82px;
      }
      &__right {
        flex: 1;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        line-height: 22px;
        margin-left: 24px;
      }
    }
  }
  .status {
    color: #f06b00;
  }
}
.mgt-24 {
  margin-top: 24px;
}
.mgt20 {
  margin-top: 20px;
}
</style>