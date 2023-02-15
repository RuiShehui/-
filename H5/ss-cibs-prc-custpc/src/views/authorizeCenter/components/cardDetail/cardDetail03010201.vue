<!--
 * @Author: zhangcheng
 * @Date: 2022-03-30 11:24:20
 * @LastEditTime: 2022-09-21 20:51:14
 * @LastEditors: Please set LastEditors
 * @Description: 转数快
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardDetail\cardDetail03010201.vue
-->
<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__top">
      <div class="m-left">
        <!-- 付款账户 -->
        <div class="u-flag">{{$t('AUTHORIZE.debitAcctName')}}</div>
        <!-- <img class="u-bg-logo" src="@/images/authorizeCenter/银行logo@2x.png"  alt=""> -->
        <ul>
          <li class="u-name">{{ detailData.debitAcctName }}</li>
          <li class="u-accountNo">{{ detailData.debitAcct }}</li>
          <!-- <li class="u-accountName">储蓄账户（暂无字段）</li> -->
          <!-- 演示银行有限公司 -->
          <li class="u-bankName">{{$t('AUTHORIZE.CHUANG_XIN')}}</li>
        </ul>
      </div>
      <div class="m-middle">
        <div class="u-currency">{{ detailData.ccy }} {{ detailData.amount }}</div>
        <img src="@/images/internationalBusiness/daoxian.png" alt />
      </div>
      <div class="m-right">
        <!-- 收款账户 -->
        <div class="u-flag">{{$t('AUTHORIZE.creditAcctName')}}</div>
        <!-- <img class="u-bg-logo" src="@/images/authorizeCenter/银行logo@2x.png"  alt=""> -->
        <ul>
          <li class="u-name">{{ detailData.creditAcctName }}</li>
          <li class="u-accountNo">{{ detailData.creditAcct }}</li>
          <!-- <li class="u-accountName">储蓄账户（暂无字段）</li> -->
          <li class="u-bankName">{{ filterBankInfo(detailData.creditBankCode) }}</li>
        </ul>
      </div>
    </div>
    <div class="showDetail">
      <!-- 收款人类型 -->
      <detail-item
        :title="$t('AUTHORIZE.creditorType')"
        :content="detailData.creditorType | processCreditType"
      />
      <!-- 收款人识别方式 -->
      <detail-item
        :title="$t('AUTHORIZE.PRESON_WAYS')"
        :content="detailData.creditAcctIdentificationType | FPStransTypeFilers"
      />
      <!-- 重试扣账 -->
      <detail-item
        :title="$t('AUTHORIZE.isRetry')"
        v-if="detailData.isScheduleTx === 'Y'"
        :content="detailData.isRetry | yesOrNo"
      />
      <!-- 附言（致收款人） -->
      <detail-item
        :title="$t('AUTHORIZE.ZHI_PERSON')"
        :content="detailData.additionalComment?detailData.additionalComment: '- -'"
      />
      <!-- <detail-item title="备注" :content="detailData.remark?detailData.remark: '- -'" /> -->
      <!-- 登记此账户 -->
      <detail-item :title="$t('AUTHORIZE.isRegistry')" :content="detailData.isRegistry | yesOrNo" />
      <!-- 交易类型 -->
      <detail-item :title="$t('AUTHORIZE.TYPE')" :content="detailData.opType|opTypeFilter" />
      <!-- 操作类型 -->
      <detail-item
        v-if="detailData.opType"
        :title="$t('AUTHORIZE.operation')"
        :content="opFilter(detailData.opType)"
      />
      <!-- 提交时间 -->
      <detail-item :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime" />
      <!-- 参考编号 -->
      <detail-item :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo" />
      <!-- 授权状态 -->
      <detail-item
        class="waitAuth"
        :title="$t('AUTHORIZE.authState')"
        :content="tableData.authState | authStateFilter"
        v-if="isProcess"
      />
      <!-- 交易状态 -->
      <detail-item
        :title="$t('AUTHORIZE.tradeState')"
        v-show="scene ==='1' || scene ==='3'"
        :content="tableData.tradeState | tradeStateFilter"
      />
    </div>
    <!-- 授权流程 -->
    <div class="m-head mgt-24" v-if="isProcess">{{$t('AUTHORIZE.isProcess')}}</div>
    <!-- <auth-show-detail :authDetailData="authDetailData" /> -->
    <authorizetion-process
      class="mgt-24"
      :authStatus="tableData.authState"
      :flowNo="tableData.flowNo"
      :menuCode="tableData.transactionType"
      v-if="isProcess"
    ></authorizetion-process>
    <authOpinion
      :transactionType="transactionType"
      :creditType="creditType"
      :detailData="tableData"
      class="mgt20"
      v-if="scene ==='2'"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import { authExecFPSTx } from '@/api/paymentRemittance';
import authorizetionProcess from '../authorizetionProcess';
import authOpinion from '../authOpinion';
// import authShowDetail from '../authShowDetail';
import filters from '@/filters/public';
import { bankInfos } from '@/mixins';
import { otpDialog } from '@/components/messageBox';
import business from '@/filters/business.js';
import acFilters from '@/filters/accountManagement';
import {
  getIdentifyWay,
  getCreditTypeLabel
} from '@bank-transfer/utils/function';
import { PAYEEID_TYPE } from '@bank-transfer/utils/constant';
let that;
export default {
  name: 'CardDetail03010201',
  mixins: [bankInfos],
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
    isAppointmant: {
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
  data() {
    return {
      detailData: {},
      authDetailData: [],
      PAYEEID_TYPE,
      transactionType: '',
      form: {
        checkWay: ''
      }
    };
  },
  components: {
    authorizetionProcess,
    authOpinion
    // authShowDetail
  },
  beforeCreate() {
    that = this;
  },
  created() {
    console.log(this.tableData, 'tableDatasssss');
    this.tableData = this.stt ? this.res : this.tableData;
    this.detailData = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.transactionType = this.tableData.transactionType;
    console.log(this.transactionType, ' this.transactionType');
    if (
      this.detailData.businessCode == '0303' ||
      this.detailData.creditorType == '3'
    ) {
      this.creditType = '3';
    } else {
      this.creditType = this.detailData.creditorType;
    }
  },
  filters: {
    ...filters,
    ...acFilters,
    getCreditTypeLabel,
    getIdentifyWay,
    FPStransTypeFilers:business.FPStransTypeFilers,
    opTypeFilter(n) {
      if (n) {
        return `${that.$t('AUTHORIZE.opType')}-${that.$t('AUTHORIZE.FPS')}`;
      } else {
        // '转数快'
        return that.$t('AUTHORIZE.FPS');
      }
    }
  },
  methods: {
    opFilter(val) {
      switch (val) {
        case '0':
          // '修改'
          return this.$t('AUTHORIZE.UPDATE');
        case '1':
          // '取消'
          return this.$t('AUTHORIZE.CANCLE');
        default:
          return '';
      }
    },
    async confirm(data) {
      let custNo = sessionStorage.getItem('custNo');
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
        flowNumList: [this.tableData.flowNo]
      };
      if (this.isAppointmant) {
        this.$emit('appointmant', params);
      } else {
        const result = await authExecFPSTx(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.replace({
            path: '/authorizeCenter/result',
            query: { resultList: [result.body.authResultInfo] }
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
  &__top {
    display: flex;
    justify-content: center;
    .m-left,
    .m-right {
      width: 300px;
      height: 160px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      float: left;
      position: relative;
      background-image: url('~@/images/authorizeCenter/banklogo.png');
      background-position: right bottom;
      background-size: 132px 95px;
      background-repeat: no-repeat;
      .u-flag {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 24px;
        background-color: #fdf0e5;
        border-radius: 4px;
        font-size: 12px;
        color: #f06b00;
        line-height: 24px;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 87px;
      padding-left: 24px;
    }
    .m-right {
      margin-right: 87px;
      padding-left: 24px;
    }
    .u-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 4px;
      line-height: 20px;
    }
    .u-accountNo,
    .u-accountName {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 500;
    }
    .u-bankName {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 14px;
    }
    .m-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 200px;
      padding: 0 40px;
      text-align: center;
      .u-currency {
        margin-top: 40.5px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 700;
      }
      .charge {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 20px;
      }
      img {
        width: 200px;
      }
      // .u-money {
      //   font-size: 12px;
      //   color: rgba(0, 0, 0, 0.65);
      //   line-height: 20px;
      //   margin-top: 4px;
      // }
    }
  }
  .showDetail {
    display: flex;
    flex-wrap: wrap;
    margin-left: 36px;
    margin-top: 28px;
    div {
      margin-top: 8px;
    }
    div:nth-of-type(2n) {
      margin-left: 70px;
    }
    div:last-child {
      color: #f06b00;
    }
  }
}
.mgt20 {
  margin-top: 20px;
}
.mgt-24 {
  margin-top: 24px;
}
</style>
