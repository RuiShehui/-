<template>
  <div class="g-card-detail-wrapper">
    <!-- 客户卖出 -->
    <div class="m-head">{{$t('FOREXLISTPRICE.CUSTOMER_SELLSONE')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <div class="u-content">
        <div class="u-content__item">
          <!-- 币种 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.debitCurrency')}}</div>
          <div class="u-content__item__right">{{dataDep.debitCurrency}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账户 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.ACCOUNT')}}</div>
          <div
            class="u-content__item__right"
          >{{dataDep.debitAcctNo | formatBankNo}} {{dataDep.debitCurrency|ccyFilter}} {{filterAccount(dataDep.debitAccountType)}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账户名称 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.debit_AcctName')}}</div>
          <div class="u-content__item__right">{{debitAcctName}}</div>
        </div>
        <div class="u-content__item">
          <!-- 金额 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.amountDebited')}}</div>
          <div class="u-content__item__right">{{dataDep.debitCurrency}} {{amountDebited | formatMoneyNew}}</div>
        </div>
      </div>
      <!-- 客户买入 -->
      <div class="m-head">{{$t('FOREXLISTPRICE.CUSTOMER_BUYSONE')}}</div>
      <div class="u-content">
        <div class="u-content__item">
          <!-- 币种 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.debitCurrency')}}</div>
          <div class="u-content__item__right">{{dataDep.creditCurrency}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账户 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.ACCOUNT')}}</div>
          <div
            class="u-content__item__right"
          >{{dataDep.creditAcctNo | formatBankNo}} {{dataDep.creditCurrency|ccyFilter}} {{filterAccount(dataDep.creditAccountType)}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账户名称 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.debit_AcctName')}}</div>
          <div class="u-content__item__right">{{creditAcctName}}</div>
        </div>
        <div class="u-content__item">
          <!-- 金额 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.amountDebited')}}</div>
          <div class="u-content__item__right">
            {{dataDep.creditCurrency}} {{amountCreditedone | formatMoneyNew}}
            <span
              v-if="statusone"
              style="color:red"
            >({{ $t("REMITTANCECONFIRM.AMOUNT_UPDATED") }})</span>
          </div>
        </div>
      </div>
      <!-- 汇率 -->
      <div class="m-head">{{$t('AUTHORIZE.RATE')}}</div>
      <div class="u-content">
        <div class="u-content__item">
          <!-- 货币兑换 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.CURRCY')}}</div>
          <!-- (仅供参考) -->
          <div
            class="u-content__item__right"
          >{{one}} = {{dataDep.customerRate}}{{two}} {{$t('AUTHORIZE.ONLY')}}</div>
        </div>
      </div>
      <div class="u-content">
        <div class="u-content__item">
          <div class="u-content__item__left"></div>
          <div class="u-content__item__right"></div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left"></div>
          <div class="u-content__item__right"></div>
        </div>
        <div class="u-content__item">
          <!-- 交易类型 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.TYPE')}}</div>
          <!-- 货币兑换 -->
          <div class="u-content__item__right">{{$t('AUTHORIZE.CURRCY')}}</div>
        </div>
        <div class="u-content__item">
          <!-- 提交时间 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.createTime')}}</div>
          <div class="u-content__item__right">{{dataItem.createTime}}</div>
        </div>
        <div class="u-content__item">
          <!-- 参考编号 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.flowNo')}}</div>
          <div class="u-content__item__right">{{dataItem.flowNo}}</div>
        </div>
        <div class="u-content__item" v-if="isProcess">
          <!-- 授权状态 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.authState')}}</div>
          <div class="u-content__item__right status">{{tableData.authState | authStateFilter}}</div>
        </div>
        <div class="u-content__item" v-show="scene ==='1' || scene ==='3'">
          <!-- 交易状态 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.tradeState')}}</div>
          <div class="u-content__item__right status">{{dataItem.tradeState | tradeStateFilter}}</div>
        </div>
      </div>
      <authorizetion-process
        :authStatus="tableData.authState"
        class="mgt-24"
        v-if="isProcess"
        :menuCode="transactionType"
        :flowNo="dataItem.flowNo"
      ></authorizetion-process>
      <authOpinion
        :transactionType="transactionType"
        :detailData="dataDep"
        hasAuthorization="0"
        v-if="scene ==='2'"
        @confirm="confirm"
      ></authOpinion>
    </div>
  </div>
</template>

<script>
import authorizetionProcess from '../authorizetionProcess';
import authOpinion from '../authOpinion';
import { currencyExchangeAuth } from '@/api/payService';
import {
  currencyExchangeDetails,
  currencyExchangeVerify,
  judgeCurrExchangeDate
} from '@/api/internationalBusiness';
import filters from '@/filters/public';
import filter from '@/filters/accountManagement';
import { formatMoneyNew } from '@/utils/tools';
import mathTools from '@/utils/mathTools.js';
import { currencyExchangeTransRecords } from '@/api/internationalBusiness';
export default {
  components: {
    authorizetionProcess,
    authOpinion
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
    scene: {
      type: String,
      default: '0'
    },
    type: {
      type: Number,
      default: 0
    },
    stt: {
      type: String,
      default: ''
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
    }
  },
  filters: {
    ...filters,
    accountType: filter.accountType,
    filtersType: filters.filtersType,
    formatMoneyNew: formatMoneyNew,
    showMaxOpinion(val) {
      if (typeof val === 'undefined') return;
      if (val.length <= 30) {
        return val;
      } else {
        return val.substr(0, 30) + '...';
      }
    }
  },
  data() {
    return {
      active: 2,
      dataItem: {}, //
      dataDep: {}, //
      amountCredited: '',
      amountCreditedone: '',
      amountDebited: '',
      creditAcctName: '',
      debitAcctName: '',
      statusone: false,
      approveList: [],
      status: '0',
      accountList: [],
      one: '',
      two: '',
      stepTitle1: '', //授权流程标题
      stepTitle2: '',
      stepTitle3: '',
      stepTitle4: '',
      stepTitle5: '',
      newTableData: [],
      flowNoList: [],
      transactionType: '',
      processStatus: '', //步骤进度当前的状态
      authActionMessage: '', //授权意见
      authActionType: '', //待授权动作 : submit 提交-0 | AUTH接口必输: pass 授权通过-1 refuse 授权拒绝-2
      lastInputFlag: ''
    };
  },
  created() {
    this.dataItem = this.tableData;
    if (this.stt) {
      this.dataItem.authState = this.stt;
    }
    this.dataDep = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.transactionType = this.tableData.transactionType;
    this.flowNoList.push(this.dataItem.flowNo);
    let arr = this.dataDep.amountDebited;
    let brr = arr.toString();
    this.amountDebited = mathTools.moneyCheck(brr);
    console.log(this.tableData, 'dataDep');
    console.log(this.dataDep, 'dataDepsssss');
    // if (this.dataDep.debitAccountType == 'SAVING') {
    //   // '储蓄账户'
    //   this.dataDep.debitAccountType = this.$t('AUTHORIZE.SAVING');
    // } else if (this.dataDep.debitAccountType == 'MULTICURRENCY') {
    //   // '多种币种储蓄账户'
    //   this.dataDep.debitAccountType = this.$t('AUTHORIZE.MULTICURRENCY');
    // } else if (this.dataDep.debitAccountType == 'CURRENT') {
    //   // '往来账户'
    //   this.dataDep.debitAccountType = this.$t('AUTHORIZE.CURRENT');
    // } else if (this.dataDep.debitAccountType == 'FIXED') {
    //   // '定期账户'
    //   this.dataDep.debitAccountType = this.$t('AUTHORIZE.FIXED');
    // } else if (this.dataDep.debitAccountType == 'LOAN') {
    //   // '贷款账户'
    //   this.dataDep.debitAccountType = this.$t('AUTHORIZE.LOAN');
    // } else if (this.dataDep.debitAccountType == 'SECURITIES') {
    //   // '股票账户'
    //   this.dataDep.debitAccountType = this.$t('AUTHORIZE.SECURITIES');
    // } else if (this.dataDep.debitAccountType == 'INVESTMENT') {
    //   // '投资账户'
    //   this.dataDep.debitAccountType = this.$t('AUTHORIZE.INVESTMENT');
    // }

    // if (this.dataDep.creditAccountType == 'SAVING') {
    //   this.dataDep.creditAccountType = this.$t('AUTHORIZE.SAVING');
    // } else if (this.dataDep.creditAccountType == 'MULTICURRENCY') {
    //   this.dataDep.creditAccountType = this.$t('AUTHORIZE.MULTICURRENCY');
    // } else if (this.dataDep.creditAccountType == 'CURRENT') {
    //   this.dataDep.creditAccountType = this.$t('AUTHORIZE.CURRENT');
    // } else if (this.dataDep.creditAccountType == 'FIXED') {
    //   this.dataDep.creditAccountType = this.$t('AUTHORIZE.FIXED');
    // } else if (this.dataDep.creditAccountType == 'LOAN') {
    //   this.dataDep.creditAccountType = this.$t('AUTHORIZE.LOAN');
    // } else if (this.dataDep.creditAccountType == 'SECURITIES') {
    //   this.dataDep.creditAccountType = this.$t('AUTHORIZE.SECURITIES');
    // } else if (this.dataDep.creditAccountType == 'INVESTMENT') {
    //   this.dataDep.creditAccountType = this.$t('AUTHORIZE.INVESTMENT');
    // }
    //计算汇率
    if (
      this.dataDep.debitCurrency == 'JPY' ||
      this.dataDep.creditCurrency == 'JPY'
    ) {
      if (this.dataDep.debitCurrency == 'JPY') {
        this.two = this.dataDep.creditCurrency;
        this.one = '100JPY';
      } else {
        this.two = this.dataDep.debitCurrency;
        this.one = '100JPY';
      }
    } else {
      if (this.dataDep.debitCurrency == 'HKD') {
        this.two = this.dataDep.debitCurrency;
        this.one = '1' + this.dataDep.creditCurrency;
      } else {
        this.two = this.dataDep.creditCurrency;
        this.one = '1' + this.dataDep.debitCurrency;
      }
    }

    let params = {
      commFlow: this.dataItem.flowNo,
      custmNo: ''
    };
    //查询详情
    if (this.stt) {
      currencyExchangeTransRecords(params).then(res => {
        this.amountCredited = res.amountCredited;
        let arr = this.amountCredited;
        let brr = arr.toString();
        this.amountCreditedone = mathTools.moneyCheck(brr);
        this.creditAcctName = res.creditAcctName;
        this.debitAcctName = res.debitAcctName;
      });
    } else {
      currencyExchangeDetails(params).then(res => {
        this.amountCredited = res.currencyExchangeReq.amountCredited;
        this.lastInputFlag = res.currencyExchangeReq.lastInputFlag;
        let arr = this.amountCredited;
        let brr = arr.toString();
        this.amountCreditedone = mathTools.moneyCheck(brr);
        this.creditAcctName = res.currencyExchangeReq.creditAcctName;
        this.debitAcctName = res.currencyExchangeReq.debitAcctName;
      });
    }
  },
  methods: {
    //授权接口
    async authInit() {
      let s = this.dataDep;
      let params = {
        authReqInfo: {
          authActionMessage: this.authActionMessage,
          authActionType: this.authActionType,
          flowNo: this.dataItem.flowNo,
          opType: this.dataItem.operationType
            ? this.dataItem.operationType.charAt(0)
            : null,
          bsnCode: this.dataItem.transactionType,
          ccy: '',
          cry: '',
          cstmNo: '',
          expiration: '',
          feeAccount: '',
          payAccount: '',
          totalNum: '',
          transAmount: 0,
          transDetail: '',
          userCode: '',
          userLevel: '',
          userName: ''
        },
        account: '',
        amount: 0,
        entType: '',
        flowNoList: this.flowNoList,
        t24CustNo: '',
        total: '',
        totalMoney: ''
      };
      console.log('---params', params);
      const result = await currencyExchangeAuth(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },
    showBox(result) {
      switch (result) {
        case '0':
          return this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('COMMON.NOT_SEVER_TIME'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          }).then(() => {
            this.$router.replace('/home');
          });
        case '1':
          this.currencyExchangeVerifyFun();
          return;
        case '2':
          return this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('COMMON.SPECIAL_WEATHER'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          }).then(() => {});
      }
    },
    currencyExchangeVerifyFun(){
      let params = {
        amountCredited: this.lastInputFlag == 'C' ? this.amountCredited : '',
        amountDebited:
          this.lastInputFlag == 'C' ? '' : this.dataDep.amountDebited,
        creditAcctNo: this.dataDep.creditAcctNo,
        creditCurrency: this.dataDep.creditCurrency,
        debitAcctNo: this.dataDep.debitAcctNo,
        debitCurrency: this.dataDep.debitCurrency,
        customerRate: this.dataDep.customerRate,
        creditAccountType: '',
        debitAccountType: ''
      };
      currencyExchangeVerify(params).then(res => {
        if (res && this.dataDep.customerRate != res.customerRate) {
          this.dataDep.customerRate = res.customerRate;
          this.amountCreditedone = res.amountCredited;
          this.statusone = true;
        } else if (res && this.dataDep.customerRate == res.customerRate) {
          this.authInit();
        }
      });
    },
    async confirm(form) {
      this.authActionType = form.radio;
      this.authActionMessage = form.opinion;
      const result = await judgeCurrExchangeDate();
      if (result) {
        this.showBox(result);
        return;
      }
    },
    filterType(type, cur) {
      return filters.filtersType(type, cur);
    },
    filterAccount(type) {
      return filter.accountType(type);
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
    // margin-top: 36px;
    .u-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      // margin-top: 36px;
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
::v-deep .el-pagination .el-pagination__jump {
  margin-left: 10px;
  height: 32px;
  position: relative;
  line-height: 32px;
  font-size: 16px !important;
  color: #595959;
  margin-right: 30px;
}
</style>