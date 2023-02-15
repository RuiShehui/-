<template>
  <div class="g-card-detail-wrapper" v-loading="submits">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-confirmContent">
      <!-- 定期存款账户 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT`)"
        :content="`${formatAccountNo(detailData.fixedAccount)} ${formatAccountCur(detailData.fixedAccountCur) } ${formatAccountType(detailData.fixedAccountType)}`"
      ></DetailItem>
      <!-- 付款账户 -->
      <DetailItem
        :title="$t(`OPEN_FIXED.PAYMENT_ACCOUNT`)"
        :content="`${formatAccountNo(detailData.paymentAccount)} ${formatAccountCur(detailData.paymentAccountCur)} ${formatAccountType(detailData.paymentAccountType)}`"
      ></DetailItem>
      <!-- 存款额 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
        :content="`${detailData.fixedAccountCur} ${formatMoneyNew(detailData.depositAmount)}`"
      ></DetailItem>
      <!-- 存款期 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        v-if="detailData.maturityInstructions === '1'"
        :content="dateFilter(detailData.fixedTerm)"
      ></DetailItem>
      <!-- 存款期 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        v-if="detailData.maturityInstructions === '2'"
        :content="dateFilter(detailData.fixedTerm)"
      ></DetailItem>
      <!-- 存款期 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        v-if="detailData.maturityInstructions == '3' || detailData.fixedTerm"
        :content="detailData.fixedTerm"
      ></DetailItem>
      <!-- 下次转存期 -->
      <DetailItem
        :title="$t('FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR')"
        v-if="detailData.maturityInstructions !== '3'"
        :content="dateFilter(detailData.nextTransferDate)"
      ></DetailItem>
      <!-- 到期指示 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
        :content="maturityInstructionsFilter(detailData.maturityInstructions)"
      ></DetailItem>
      <!-- 指定账户 -->
      <DetailItem
        v-if="detailData.maturityInstructions === '2'||detailData.maturityInstructions === '3' "
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        :content="`${formatAccountNo(detailData.appointAccount)} ${detailData.appointAccountType==='MULTICURRENCY'?'':formatAccountCur(detailData.appointAccountCur)} ${formatAccountType(detailData.appointAccountType)}`"
      ></DetailItem>
      <!-- 利率 -->
      <DetailItem :title="$t(`OPEN_FIXED.RATE`)" :content="`${detailData.rate}%p.a.`"></DetailItem>
      <!--  预计可得利息-->
      <DetailItem
        v-if="!detailData.reservationNumber"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST`)"
        :content="`${detailData.paymentAccountCur} ${detailData.preAvailableInterest}`"
      ></DetailItem>
      <!--  预计可得本息-->
      <DetailItem
        v-if="!detailData.reservationNumber"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL`)"
        :content="`${detailData.paymentAccountCur} ${formatMoneyNew(detailData.preAvailablePrincipalInterest)}`"
      ></DetailItem>
      <!-- 交易类型： 开立定期存款 -->
      <DetailItem :title="$t('AUTHORIZE.TYPE')" :content="$t('AUTHORIZE.FIEXD')"></DetailItem>
      <!-- 提交时间： -->
      <DetailItem :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime"></DetailItem>
      <!-- 参考编号： -->
      <DetailItem :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo"></DetailItem>
      <!-- 授权状态： -->
      <DetailItem
        :title="$t('AUTHORIZE.authState')"
        :content="tableData.authState | authStateFilter"
        v-if="isProcess"
      ></DetailItem>
      <!-- 交易状态： -->
      <DetailItem
        :title="$t('AUTHORIZE.tradeState')"
        v-show="scene ==='1' || scene ==='3'"
        :content="tableData.tradeState | tradeStateFilter"
      ></DetailItem>
    </div>
    <authorizetionProcess
      :authStatus="tableData.authState"
      v-if="isProcess"
      :flowNo="tableData.flowNo"
      :menuCode="tableData.transactionType"
    ></authorizetionProcess>
    <authOpinion
      :transactionType="transactionType"
      :detailData="detailData"
      class="mgt20"
      v-if="scene ==='2'"
      @confirm="sumbitAuth"
    />
  </div>
</template>

<script>
import authorizetionProcess from '../authorizetionProcess';
import authOpinion from '../authOpinion';
import { openDepositAuth } from '@/api/openFixed.js';
import filters from '@/filters/public';
import filter from '@/filters/accountManagement';
import mathTools from '@/utils/mathTools.js';
import tool from '@/dataTools/tools/moneyTools.js';
import CONSTANTS from '@/utils/contants.js';
import depositFilter from '@/filters/deposit.js';
export default {
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
    isAppointmant: {
      type: Boolean,
      default: false
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
  components: {
    authorizetionProcess,
    authOpinion
  },
  filters: {
    ...filters,
    accountType: filter.accountType,
    dateList: filter.dateList
  },
  data() {
    return {
      detailData: {},
      stepTitle1: '', //授权流程标题
      stepTitle2: '',
      stepTitle3: '',
      stepTitle4: '',
      stepTitle5: '',
      newTableData: [],
      processStatus: '', //步骤进度当前的状态
      stepsList: [],
      activeIndex: 0,
      batchStatus: false,
      authActionMessage: '', //授权意见
      authActionType: '', //待授权动作 : submit 提交-0 | AUTH接口必输: pass 授权通过-1 refuse 授权拒绝-2
      submits: false,
      transactionType: '3',
      accountTypeList: [
        {
          value: '',
          label: this.$t('RIGHTS_TEMPLATE.ALL')
        },
        {
          value: 'SAVING',
          label: this.$t('USER_MANAGEMENT.SAVINGS_ACCOUNT')
        },
        {
          value: 'MULTICURRENCY',
          label: this.$t('USER_MANAGEMENT.CURRENCY_SAVINGS_ACCOUNTS')
        },
        {
          value: 'CURRENT',
          label: this.$t('USER_MANAGEMENT.CURRENT_ACCOUNT')
        },
        {
          value: 'FIXED',
          label: this.$t('USER_MANAGEMENT.FIXED')
        },
        {
          value: 'LOAN',
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'SECURITIES',
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'INVESTMENT',
          label: this.$t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
        }
      ],
      detailDatas: []
    };
  },
  created() {
    // console.log(JSON.parse(this.res.transactionDescribe), '11213232323');
    console.log('输出的数据', this.isProcess);
    // this.tableData = this.stt?this.res:this.tableData;
    this.detailData = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.transactionType = this.stt
      ? this.res.transactionType
      : this.tableData.transactionType;
    let detailDatas = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.detailDatas = this.detailData;
    console.log(
      this.detailDatas,
      'this.detailDatathis.detailDatathis.detailData'
    );
  },

  methods: {
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },

    maturityInstructionsFilter(value) {
      switch (value) {
        case '1':
          // '本息自动续存'
          return this.$t('AUTHORIZE.XUCUN');
        case '2':
          // '本金自动续存，利息转入指定账户'
          return this.$t('AUTHORIZE.BENJIN');
        case '3':
          // '本息转入指定账户'
          return this.$t('AUTHORIZE.FIXED_ACCOUNT');
        default:
          return value;
      }
    },
    async sumbitAuth(form) {
      this.submits = true;
      let flowNo = this.tableData.flowNo;
      this.authActionType = form.radio;
      this.authActionMessage = form.opinion;
      let params = {
        authReqInfo: {
          authActionType: this.authActionType,
          authActionMessage: this.authActionMessage,
          flowNo: this.tableData.flowNo,
          opType: this.tableData.operationType
            ? this.tableData.operationType.charAt(0)
            : null,
          bsnCode: this.tableData.transactionType,
          flowNoList: [flowNo]
        },
        flowNoList: [flowNo]
      };
      console.log(params, 'params');
      const result = await openDepositAuth(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.submits = false;
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      } else {
        this.submits = false;
      }
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    formatAccountCur(val) {
      return mathTools.ccyFilter(val);
    },
    formatMoneyNew(val) {
      const invalidList = [null, undefined, NaN];
      if (!invalidList.includes(val)) {
        let num = val;
        let money;
        let dot = String(num).includes('.');
        if (!dot) {
          money = this.moneyFormat(num) + '.00';
        } else {
          const numStr = String((Math.round(num * 100) / 100).toFixed(2));
          dot = numStr.indexOf('.');
          const decimal = numStr.substr(dot + 1, 2);
          money = this.moneyFormat(numStr.substr(0, dot)) + '.' + decimal;
        }
        return money;
      }
      return '0.00';
    },
    moneyFormat(num) {
      return String(num).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    formatAccountType(val) {
      return filter.accountType(val);
    },
    dateFilter(val) {
      return filter.dateList(val);
    },
     forMatDate(val){
      return depositFilter.getDay(val)
    }
  }
};
</script>

<style lang="scss" scoped>
.g-card-detail-wrapper {
  .m-head {
    border-left: .25rem solid #f06b00;
    color: rgba(0, 0, 0, 0.85);
    font-size: 1.125rem;
    line-height: 1.125rem;
    font-weight: 500;
    padding-left: .75rem;
    margin-bottom: 1.25rem;
  }
  &__top {
    display: flex;
    justify-content: center;
    .m-left,
    .m-right {
      width: 18.75rem;
      height: 10rem;
      box-sizing: border-box;
      background: #fff;
      border: .0625rem solid #e7e7e7;
      box-shadow: 0rem .25rem 1rem 0rem rgba(0, 0, 0, 0.08);
      border-radius: .5rem;
      float: left;
      position: relative;
      background-image: url('~@/images/authorizeCenter/banklogo.png');
      background-position: right bottom;
      background-size: 8.25rem 5.9375rem;
      background-repeat: no-repeat;
      .u-flag {
        position: absolute;
        right: 0;
        top: 0;
        width: 4rem;
        height: 1.5rem;
        background-color: #fdf0e5;
        border-radius: .25rem;
        font-size: .75rem;
        color: #f06b00;
        line-height: 1.5rem;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 5.4375rem;
      padding-left: 1.5rem;
    }
    .m-right {
      margin-right: 5.4375rem;
      padding-left: 1.5rem;
    }
    .u-name {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: .25rem;
      line-height: 1.25rem;
    }
    .u-accountNo,
    .u-accountName {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.85);
      line-height: 1.5rem;
      font-weight: 500;
    }
    .u-bankName {
      font-size: .875rem;
      color: rgba(0, 0, 0, 0.45);
      margin-top: .875rem;
    }
    .m-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 12.5rem;
      padding: 0 2.5rem;
      text-align: center;
      .u-currency {
        margin-top: 2.53125rem;
        font-size: 1.25rem;
        color: rgba(0, 0, 0, 0.85);
        line-height: 1.75rem;
        font-weight: 700;
      }
      img {
        width: 12.5rem;
      }
      // .u-money {
      //   font-size: .75rem;
      //   color: rgba(0, 0, 0, 0.65);
      //   line-height: 1.25rem;
      //   margin-top: .25rem;
      // }
    }
  }
  &__middle {
    margin-top: 2.25rem;
    .u-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      margin-top: 2.25rem;
      &__item {
        width: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        &__left {
          width: 13.875rem;
          text-align: right;
          color: rgba(0, 0, 0, 0.45);
          font-size: .875rem;
          line-height: 1.375rem;
          // margin-left: 5.125rem;
        }
        &__right {
          flex: 1;
          color: rgba(0, 0, 0, 0.85);
          font-size: .875rem;
          line-height: 1.375rem;
          margin-left: 1.5rem;
        }
        .status {
          color: #f06b00;
        }
      }
    }
  }
  &__bottom {
    background-color: #f7f7f7;
    padding: 1.25rem 0 0 3.875rem;
    margin-bottom: 1.6875rem;
  }
}
// .u-bg-logo {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   height: 5.9375rem;
//   width: 8.25rem;
//   z-index: 0;
// }
.g-confirmContent {
  margin-left: 16%;
  width: 55.5rem;
  display: flex;
  flex-wrap: wrap;
  // margin-left: 4rem;
  .detailItem:not(:last-child) {
    margin-bottom: 1rem;
  }
}
.m-author {
  margin-top: 1.5rem;
}
</style>