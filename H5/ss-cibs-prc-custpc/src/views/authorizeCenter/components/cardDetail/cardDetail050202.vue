<template>
  <div>
    <div class="g-card-detail-wrapper" v-if="formData.tranType==='3'">
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
            >{{ formData.fundName }}-{{formData.assetTypeCode | assetTypeCodeFilter}}/{{formData.fundCCY}}</div>
          </div>
          <div class="u-content__item">
            <!-- 结算账户 -->
            <div class="u-content__item__left">{{ $t('FUND.SETTLEMENT_ACCOUNT') }}</div>
            <div class="u-content__item__right">{{ formData.settleAcctNo }}</div>
          </div>
          <div class="u-content__item">
            <!-- 赎回单位 -->
            <div class="u-content__item__left">{{ $t('FUND.REDEEM_QUANTITY') }}</div>
            <div class="u-content__item__right">{{ formData.redeemUnit }}</div>
          </div>
          <div class="u-content__item">
            <!-- 认购费(折扣后) -->
            <div class="u-content__item__left">{{ $t('FUND.SUBSCRIPTION_FEE_AFTER') }}</div>
            <div class="u-content__item__right">{{ formData.redemptFeeDisplay }}</div>
          </div>
          <div class="u-content__item">
            <!-- 交易类型 -->
            <div class="u-content__item__left">{{ $t('FUND.TRANSATION_TYPE') }}</div>
            <!-- 赎回 -->
            <div class="u-content__item__right">{{$t('AUTHORIZE.SHU_HUI')}}</div>
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
          <div class="u-content__item">
            <!-- 授权状态 -->
            <div class="u-content__item__left">{{ $t('COMMON.AUTHORIZATION_STATUS') }}</div>
            <div class="u-content__item__right status">{{ authState | authStateFilter }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="formData.tranType==='2'">
      <div class="g-card-detail-wrapper">
        <!-- 转出 -->
        <div class="m-head">{{ $t('FUND.SWITCH_OUT') }}</div>
        <div class="g-card-detail-wrapper__middle">
          <div class="u-content">
            <div class="u-content__item">
              <!-- 基金公司 -->
              <div class="u-content__item__left">{{ $t('FUND.FUND_COMPANY') }}</div>
              <div class="u-content__item__right">{{ formData.fundHouseName }}</div>
            </div>
            <div class="u-content__item">
              <!-- 基金编号(转出) -->
              <div class="u-content__item__left">{{ $t('FUND.FUND_CODE_SWITCHOUT') }}</div>
              <div class="u-content__item__right">{{ formData.switchOutFundProductCode }}</div>
            </div>
            <div class="u-content__item">
              <!-- 投资账户 -->
              <div class="u-content__item__left">{{ $t('FUND.INVESTMENT_ACCOUNT') }}</div>
              <div class="u-content__item__right">{{ formData.invAcctNo }}</div>
            </div>
            <div class="u-content__item">
              <!-- 转出单位 -->
              <div class="u-content__item__left">{{ $t('FUND.SWITCH_OUT_QUANTITY') }}</div>
              <div class="u-content__item__right">{{ formData.changeUnit }}</div>
            </div>
            <div class="u-content__item">
              <!-- 基金名称/类别/货币(转出) -->
              <div class="u-content__item__left">{{ $t('FUND.FUND_NAME_TYPE_CCY_OUT') }}</div>
              <div
                class="u-content__item__right"
              >{{ formData.outFundName }}-{{ formData.outAssetTypeCode | assetTypeCodeFilter }}/{{ formData.outFundCCY }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="g-card-detail-wrapper">
        <!-- 转入 -->
        <div class="m-head">{{ $t('FUND.TRANSFER_IN') }}</div>
        <div class="g-card-detail-wrapper__middle">
          <div class="u-content">
            <div class="u-content__item">
              <!-- 转入方式 -->
              <div class="u-content__item__left">{{ $t('FUND.TRANSFER_IN_METHOD') }}</div>
              <div class="u-content__item__right">{{ formData.changeMode | changeModeFilter }}</div>
            </div>
            <div class="u-content__item">
              <!-- 基金资产类别 -->
              <div class="u-content__item__left">{{ $t('FUND.FUND_ASSET_CLASS') }}</div>
              <div
                class="u-content__item__right"
              >{{ formData.inAssetTypeCode | assetTypeCodeFilter }}</div>
            </div>
            <div class="u-content__item">
              <!-- 货币 -->
              <div class="u-content__item__left">{{ $t('FUND.CCY') }}</div>
              <div class="u-content__item__right">{{ formData.inFundCCY }}</div>
            </div>
            <div class="u-content__item">
              <!-- 基金名称/类别/货币（转入） -->
              <div class="u-content__item__left">{{ $t('FUND.FUND_NAME_TYPE_CCY_IN') }}</div>
              <div
                class="u-content__item__right"
              >{{ formData.inFundCCY }}-{{ formData.inAssetTypeCode | assetTypeCodeFilter }}/{{ formData.inFundCCY }}</div>
            </div>
            <div class="u-content__item">
              <!-- 基金编号(转入) -->
              <div class="u-content__item__left">{{ $t('FUND.FUND_CODE_TRANSFER_IN') }}</div>
              <div class="u-content__item__right">{{ formData.switchInFundProductCode }}</div>
            </div>
            <div class="u-content__item">
              <!-- 产品风险评级 -->
              <div class="u-content__item__left">{{ $t('FUND.PRODUCT_RISK_LEVEL') }}</div>
              <div class="u-content__item__right">{{ formData.riskRating | riskRatingFilter }}</div>
            </div>
            <div class="u-content__item">
              <!-- 产品投资目标 -->
              <div class="u-content__item__left">{{ $t('FUND.PRODUCT_INVEST_GOAL') }}</div>
              <div class="u-content__item__right">{{ formData.productObjCode | productObjFilter }}</div>
            </div>
            <div class="u-content__item">
              <!-- 我的投资目标 -->
              <div class="u-content__item__left">{{ $t('FUND.MY_INVEST_GOAL') }}</div>
              <div class="u-content__item__right">{{ formData.myInvObj | productObjFilter }}</div>
            </div>
            <div class="u-content__item">
              <!-- 转换费(折扣后) -->
              <div class="u-content__item__left">{{ $t('FUND.SWITCH_AMOUNT') }}</div>
              <div class="u-content__item__right">{{ formData.switchFeeDisplay }}</div>
            </div>
            <div style="width:95%;height:1px;background:#f2f2f2;margin: 8px auto 24px"></div>
            <div class="u-content__item">
              <!-- 交易类型 -->
              <div class="u-content__item__left">{{ $t('FUND.TRS_TYPE') }}</div>
              <!-- 转换 -->
              <div class="u-content__item__right">{{$t('AUTHORIZE.CHANGE')}}</div>
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
              <div
                class="u-content__item__right status"
              >{{ tableData.tradeState | tradeStateFilter}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 授权流程 -->
    <div class="m-head mgt-24" v-if="isProcess">{{$t('AUTHORIZE.isProcess')}}</div>
    <!-- <auth-show-detail :authDetailData="authDetailData" /> -->
    <authorizetion-process
      :authStatus="authState"
      class="mgt-24"
      :flowNo="tableData.flowNo"
      :menuCode="tableData.transactionType"
      v-if="isProcess"
    ></authorizetion-process>
    <authOpinion
      :transactionType="transactionType"
      :detailData="tableData"
      class="mgt20"
      v-if="scene ==='2'"
      @confirm="submitAuth"
    />
  </div>
</template>

<script>
import authorizetionProcess from '../authorizetionProcess';
import { fundChangeAuth, fundRedeemAuth } from '@/api/investmentServices';
import authOpinion from '../authOpinion.vue';
import publicFilters from '@/filters/public';
import fundFilters from '@/filters/fund';
export default {
  props: {
    tableData: {
      type: Object,
      default: () => {
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
  created() {
    console.log(this.tableData, 'fundSwitch');
    this.tableData = this.stt ? this.res : this.tableDate;
    this.formData = this.stt
      ? JSON.parse(this.tableData.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.transactionType = this.tableData.transactionType;
  },
  filters: {
    ...publicFilters,
    ...fundFilters
  },
  components: {
    authorizetionProcess,
    authOpinion
  },
  data() {
    return {
      formData: {},
      transactionType: ''
    };
  },
  methods: {
    async submitAuth(data) {
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
      if (this.formData.tranType === '2') {
        const result = await fundChangeAuth(params);
        if (result) {
          this.$router.replace({
            path: '/authorizeCenter/result',
            query: result
          });
        }
      } else {
        const result = await fundRedeemAuth(params);
        if (result) {
          this.$router.replace({
            path: '/authorizeCenter/result',
            query: result
          });
        }
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
      align-items: center;
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