<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__top">
      <div class="m-left">
        <!-- 付款账户 -->
        <div class="u-flag">{{$t('AUTHORIZE.debitAcctName')}}</div>
        <ul>
          <li class="u-name">{{ detailData.debitAcctName }}</li>
          <li class="u-accountNo">{{ detailData.debitAcct | formatBankNo }}</li>
          <!-- 账户类型 -->
          <li class="u-accountName">{{ detailData.debitAcctType | processAccountType }}</li>
          <li class="u-bankName" v-if="detailData.debitBankName">{{ detailData.debitBankName }}</li>
          <!-- 演示银行有限公司 -->
          <li class="u-bankName" v-else>{{$t('AUTHORIZE.CHUANG_XIN')}}</li>
        </ul>
      </div>
      <div class="m-middle">
        <div class="u-currency">{{ detailData.ccy }} {{ detailData.amount }}</div>
        <!-- 手续费 -->
        <div
          class="charge"
        >{{$t('AUTHORIZE.amount')}}：{{ detailData.chargeCcy }} {{ detailData.chargeAmt ? detailData.chargeAmt.toMoney() : '0.00' }}</div>
        <img src="@/images/internationalBusiness/daoxian.png" alt />
      </div>
      <div class="m-right">
        <!-- 收款账户 -->
        <div class="u-flag">{{$t('AUTHORIZE.creditAcctName')}}</div>
        <ul>
          <li class="u-name">{{ detailData.creditAcctName }}</li>
          <li class="u-accountNo">{{ detailData.creditAcct }}</li>
          <!-- 账户类型 -->
          <li class="u-accountName">{{ detailData.chargeAcctType | processAccountType}}</li>
          <li class="u-bankName">{{ filterBankInfo(detailData.creditBankCode) }}</li>
        </ul>
      </div>
    </div>
    <div class="showDetail">
            <!-- 手续费扣款账户 -->
      <detail-item
        :title="$t('AUTHORIZE.feeAcct')"
        :content="feeAcct | formatBankNo"
      />
      <!-- 预约处理 -->
      <detail-item
        :title="$t('AUTHORIZE.isScheduleTx')"
        :content="detailData.isScheduleTx | yesOrNo"
      />
      <!-- 预约处理日期 -->
      <detail-item
        v-if="detailData.isScheduleTx === 'Y'"
        :title="$t('AUTHORIZE.scheduleDate')"
        :content="detailData.scheduleDate"
      />
      <!-- 重试扣账 -->
      <!-- <detail-item :title="$t('AUTHORIZE.isRetry')" :content="detailData.isRetry | yesOrNo" /> -->
      <!-- 收款人类型 -->
      <detail-item
        :title="$t('AUTHORIZE.creditorType')"
        :content="detailData.creditorType | getCreditTypeLabel"
      />
      <!-- 附言 -->
      <detail-item
        :title="$t('AUTHORIZE.CHINESE')"
        :content="detailData.additionalComment?detailData.additionalComment: '- -'"
      />
      <!-- 登记此账户 -->
      <detail-item :title="$t('AUTHORIZE.isRegistry')" :content="detailData.isRegistry | yesOrNo" />
      <!-- 交易类型 -->
      <detail-item :title="$t('AUTHORIZE.TYPE')" :content="detailData.opType|opTypeFilter" />
      <!-- 交易类型 -->
      <detail-item
        v-if="detailData.opType"
        :title="$t('AUTHORIZE.TYPE')"
        :content="opFilter(detailData.opType)"
      />
      <!-- 提交时间 -->
      <detail-item :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime" />
      <!-- 参考编号 -->
      <detail-item :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo" />
      <!-- 授权状态 -->
      <detail-item
        :title="$t('AUTHORIZE.authState')"
        :content="authState | authStateFilter"
        v-if="isProcess"
      />
      <!-- 交易状态 -->
      <detail-item
        :title="$t('AUTHORIZE.tradeState')"
        v-show="scene ==='1' || scene ==='3'"
        :content="tableData.tradeState | tradeStateFilter"
      />
    </div>
    <authorizetionProcess
      :authStatus="authState"
      :flowNo="tableData.flowNo"
      :menuCode="tableData.transactionType"
      v-if="isProcess"
    ></authorizetionProcess>
    <authOpinion
      :transactionType="transactionType"
      :creditType="creditType"
      :detailData="detailData"
      class="mgt20"
      v-if="scene ==='2'"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import { authExecChatsTx } from '@/api/authorizeCenter';
import authorizetionProcess from '../authorizetionProcess';
import authOpinion from '../authOpinion';
// import authShowDetail from '../authShowDetail';
import filters from '@/filters/public';
import business from '@/filters/business.js';
import acFilters from '@/filters/accountManagement';
import { action } from '@/api/public.js';
import { bankInfos } from '@/mixins';
import {
  getIdentifyWay,
  getCreditTypeLabel
} from '@bank-transfer/utils/function';
let that;
export default {
   mixins: [bankInfos],
  components: {
    authorizetionProcess,
    authOpinion
    // authShowDetail
  },
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
    isProcess: {
      type: Boolean,
      default: false
    },
    scene: {
      type: String,
      default: '0'
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
  filters: {
    processAccountType:business.processAccountType,
    ccyFilter:filters.ccyFilter,
    ...filters,
    ...acFilters,
    getCreditTypeLabel,
    getIdentifyWay,
    opTypeFilter(n) {
      if (n) {
        return `${that.$t('AUTHORIZE.opType')}-${that.$t(
          'AUTHORIZE.TRANSFER'
        )}`;
      } else {
        // CHATS
        return that.$t('AUTHORIZE.TRANSFER');
      }
    }
  },
  data() {
    return {
      detailData: {},
      authDetailData: [],
      accountName: '',
      toAccountName: '',
      transactionType: '',
      feeAcct:''
      // creditorType:''
    };
  },
  beforeCreate() {
    that = this;
  },
  created() {
    console.log('isProcess-----传入后',this.isProcess)
    if(this.stt){
      this.authState = this.res.authState
    }
    
    this.tableData = this.stt ? this.res : this.tableData;
    console.log('scene', this.tableData.transactionDescribe);
    this.detailData = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.transactionType = this.tableData.transactionType;
    console.log(this.detailData,'transactionType')
    // this.creditType = this.detailData.creditorType;
    console.log(this.tableData,'detailData')
    this.feeAcct =  this.detailData.chargeAcct + ' ' +  filters.ccyFilter(this.detailData.chargeCcy) + ' ' +  business.processAccountType(this.detailData.chargeAcctType)
    if(this.tableData.transactionType=='0303'||this.detailData.creditorType=='3'){
      this.creditType='3'
    }else{
      this.creditType = this.detailData.creditType
    }
  },
  methods: {
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },
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
    confirm(form) {
      if (this.isAppointmant) {
        this.$emit('appointmant', {
          flowNumList: [this.tableData.flowNo],
          authReqInfo: {
            authActionType: form.radio,
            authActionMessage: form.opinion
          }
        });
      } else {
        // 改为统一授权接口
        this.$emit('authRpc', {
          flowNoList: [this.tableData.flowNo],
          bsnCode: '03010202',
          authActionType: form.radio,
          authActionMessage: form.opinion,
          authReqInfo: {
            authActionType: form.radio,
            authActionMessage: form.opinion,
            flowNo: this.tableData.flowNo,
            opType: this.tableData.operationType
              ? this.tableData.operationType.charAt(0)
              : null,
            bsnCode: this.tableData.transactionType
          }
        });
        return;
       
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
  &__middle {
    margin-top: 36px;
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
        .status {
          color: #f06b00;
        }
      }
    }
  }
  &__bottom {
    background-color: #f7f7f7;
    padding: 20px 0 0 62px;
    margin-bottom: 27px;
  }
}
// .u-bg-logo {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   height: 95px;
//   width: 132px;
//   z-index: 0;
// }
.submitter {
  display: flex;
  flex-direction: column;
  .people,
  .date {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .people {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}
.u-name,
.wait,
.agree,
.refuse {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.wait {
  #name {
    display: inline-block;
    margin-right: 14px;
  }
}
.agree {
  color: #f06b00;
}
.refuse {
  color: #f23f47;
}
.opinion {
  height: 66px;
  font-size: 14px;
  line-height: 22px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.reset {
  margin-left: 24px;
}
.people {
  width: 200px;
}
::v-deep .el-steps--horizontal {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
::v-deep .el-step {
  width: 20%;
}
::v-deep .el-step.is-horizontal .el-step__line {
  width: 95%;
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
</style>