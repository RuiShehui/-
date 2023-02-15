<template>
  <div class="g-card-detail-wrapper" v-loading="submits">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-confirmContent">
      <!-- :content="transactionDescribe.fixedAccount+'-'+transactionDescribe.fixedAccountCur" -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT`)"
        :content="`${formatAccountNo(transactionDescribe.fixedAccount)} ${transactionDescribe.depositCurrency } ${this.$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT')}`"
      ></DetailItem>
      <DetailItem
        :title="$t(`OPEN_FIXED.PAYMENT_ACCOUNT`)"
        v-if="transactionDescribe.paymentAccount"
        :content="formatAccountNo(transactionDescribe.paymentAccount)"
      ></DetailItem>
      <DetailItem :title="$t('AUTHORIZE.DEPOSIT_CODE')" :content="transactionDescribe.altId"></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
        :content="transactionDescribe.depositCurrency+' '+formatMoneyNew(transactionDescribe.depositAmount)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        v-if="transactionDescribe.depsitPeriod"
        :content="transactionDescribe.depsitPeriod"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
        :content="transactionDescribe.newMaturityInstructions==1?$t(`FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL`):transactionDescribe.newMaturityInstructions==2?$t(`FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS`) : $t(`FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL`)"
      ></DetailItem>
      <!-- 指定为多币种 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        v-if="(transactionDescribe.newMaturityInstructions =='2'||transactionDescribe.newMaturityInstructions =='3') && transactionDescribe.newAppointAccountType == 'MULTICURRENCY'"
        :content="formatAccountNo(transactionDescribe.newAppointAccount.slice(0,12)) + ' ' + transactionDescribe.newAppointAccount.slice(12,15) +' '+processAccountType(transactionDescribe.newAppointAccountType)"
      ></DetailItem>
      <!-- 指定为普通 -->
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
         v-if="(transactionDescribe.newMaturityInstructions =='2'||transactionDescribe.newMaturityInstructions =='3')"
        :content="formatAccountNo(transactionDescribe.newAppointAccount) + ' ' + transactionDescribe.depositCurrency+' '+processAccountType(transactionDescribe.newAppointAccountType)"
      ></DetailItem>
      <DetailItem
        :title="$t('AUTHORIZE.NEXT_TRANS_DATE')"
        v-if="transactionDescribe.newMaturityInstructions=='1'||transactionDescribe.newMaturityInstructions=='2'"
        :content="getFixedTermType(transactionDescribe.newNextTransferDate)||'--'"
      ></DetailItem>
      <DetailItem :title="$t(`OPEN_FIXED.RATE`)" :content="transactionDescribe.rate+'%p.a.'"></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST`)"
        :content="transactionDescribe.depositCurrency+' '+formatMoneyNew(transactionDescribe.preAvailableInterest)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL`)"
        :content="transactionDescribe.depositCurrency +' '+formatMoneyNew(transactionDescribe.preAvailablePrincipalInterest)"
      ></DetailItem>
      <!-- 更改到期指示 -->
      <DetailItem :title="$t('AUTHORIZE.TYPE')" :content="$t('AUTHORIZE.UPDATE_DATE')"></DetailItem>
      <DetailItem :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime"></DetailItem>
      <DetailItem :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo"></DetailItem>
      <DetailItem
        :title="$t('AUTHORIZE.authState')"
        :content="tableData.authState | authStateFilter"
        v-if="isProcess"
      ></DetailItem>
      <DetailItem
        tradeState
        :title="`${$t('AUTHORIZE.tradeState')}：`"
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
      :detailData="transactionDescribe"
      class="mgt20"
      v-if="scene ==='2'"
      @confirm="submites"
    />
  </div>
</template>

<script>
import authorizetionProcess from '../authorizetionProcess';
import authOpinion from '../authOpinion';
import { updateInstructionsAuth } from '@/api/openFixed.js';
import { action } from '@/api/public.js';
import tool from '@/dataTools/tools/moneyTools.js';
import CONSTANTS from '@/utils/contants.js';
import filters from '@/filters/public';
import mathTools from '@/utils/mathTools.js';
import business from '@/filters/business.js';
export default {
  props: {
    tableData: {
      type: Object
    },
    type: {
      type: Number,
      default: 9
      /**
       * 0行内转账
       * 1转数
       * 2本地特快
       * 3电汇
       * 4批量转账
       * 5批量发薪 ----delete
       * 6登记第三者账户
       * 7自动转账收款
       * 8申领支票簿
       * 9开立定期存款
       * 10更改到期指示
       * 11货币兑换
       * 12基金认购
       * 13基金转换
       * 14基金赎回
       * 15缴付账单
       * 16高风险商户维护
       * 17预约交易管理
       * 18预约缴付管理
       */
    },
    processType: {
      type: Array
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
  components: {
    authorizetionProcess,
    authOpinion
  },
  filters:{
    fixedTermType:filters.fixedTermType
  },
  data() {
    return {
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
      submits: false,
      transactionDescribe: {},
      transactionType: ''
    };
  },
  computed: {},
  created() {
    // this.newTableData.push(...this.tableData);

    this.transactionDescribe = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.transactionType = this.tableData.transactionType;
    this.transactionDescribe.fixedAccountCur = this.stt
      ? this.transactionDescribe.depositCurrency
      : this.transactionDescribe.fixedAccountCur;
    console.log(this.tableData, ' this.tableData.transactionDescribe');
    let depsitPeriod = '';
    if (this.transactionDescribe.depsitPeriod) {
      depsitPeriod = this.transactionDescribe.depsitPeriod.substr(
        this.transactionDescribe.depsitPeriod.length - 1,
        1
      );

    //   if (depsitPeriod == 'D') {
    //     // console.log(item.deposiTime,'item.deposiTime')
    //     this.transactionDescribe.depsitPeriod = this.transactionDescribe.depsitPeriod.replace(
    //       /(.*)D/,
    //       `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DAY')}`
    //     );
    //     //  console.log(item.deposiTime,'item.deposiTim1e')
    //   }
    //   if (depsitPeriod == 'M') {
    //     this.transactionDescribe.depsitPeriod = this.transactionDescribe.depsitPeriod.replace(
    //       /(.*)M/,
    //       `$1${this.$t('AUTHORIZE.MONTH')}`
    //     );
    //   }
    }

    // if (
    //   this.transactionDescribe.newMaturityInstructions == '1' ||
    //   (this.transactionDescribe.newMaturityInstructions == '2' &&
    //     this.transactionDescribe.newNextTransferDate)
    // ) {
    //   let newNextTransferDate = this.transactionDescribe.newNextTransferDate.substr(
    //     this.transactionDescribe.newNextTransferDate.length - 1,
    //     1
    //   );
    //   if (newNextTransferDate == 'D') {
    //     // console.log(item.deposiTime,'item.deposiTime')
    //     this.transactionDescribe.newNextTransferDate = this.transactionDescribe.newNextTransferDate.replace(
    //       /(.*)D/,
    //       `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DAY')}`
    //     );
    //     //  console.log(item.deposiTime,'item.deposiTim1e')
    //   }
    //   if (newNextTransferDate == 'M') {
    //     this.transactionDescribe.newNextTransferDate = this.transactionDescribe.newNextTransferDate.replace(
    //       /(.*)M/,
    //       `$1${this.$t('AUTHORIZE.MONTH')}`
    //     );
    //   }
    // }
  },
  methods: {
    async submites(form) {
      this.submits = true;
      let flowNo = this.tableData.flowNo,
        account = this.tableData.transactionDescribe.fixedAccount,
        amount = this.tableData.transactionDescribe.depositAmount;
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
          bsnCode: this.tableData.transactionType
        },
        // dueDate:this.ta
        flowNoList: [flowNo]
      };
      const result = await action(params);
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
        processAccountType(val) {
      return business.processAccountType(val);
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
    getFixedTermType(val){
      return filters.fixedTermType(val)
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
.g-confirmContent {
  margin-left: 16%;
  width: 888px;
  display: flex;
  flex-wrap: wrap;
  // margin-left: 64px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
.m-author {
  margin-top: 24px;
}
</style>