<template>
  <div class="g-beforeDetails" v-loading="submits">
    <div class="g-confirmContent">
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT`)"
        :content="fixedAccount"
      ></DetailItem>
      <DetailItem :title="$t(`OPEN_FIXED.PAYMENT_ACCOUNT`)" :content="paymentAccounts"></DetailItem>
      <DetailItem
        :title="$t(`APPOINTMENT_NUMBER.APPOINTMENT_NUMBERS`)"
        :content="formData.reservationNo"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
        :content="this.formData.contactType+' '+formData.amount"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        :content="formData.fixedTerms"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
        :content="$t(`FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL`)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        :content="appointAccount"
      ></DetailItem>
      <DetailItem :title="$t(`OPEN_FIXED.RATE`)" :content="formData.rate+'%p.a.'"></DetailItem>
      <!-- <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST`)"
        :content="formData.contactType+' '+formData.preAvailableInterest"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL`)"
        :content="this.formData.contactType+' '+formData.preAvailablePrincipalInterest"
      ></DetailItem> -->
    </div>

    <div class="f-btn">
      <VButton size="w160" @click="back">{{$t("COMMON.PREVIOUS_STEP")}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:16px;"
        :disabled="isComit"
        @click="next"
      >{{$t("COMMON.CONFIRM")}}</VButton>
    </div>
  </div>
</template>

<script>
import { submitOpen } from '@/api/openFixed.js';
import mathTools from '@/utils/mathTools.js';
import CONSTANTS from '@/utils/contants.js';
import tool from '@/dataTools/tools/moneyTools.js';
// import { formatAcctNo } from '../../utils/tools.js';
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      submits: false,
      isComit: false,
      fixedTerm: '',
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
      dateList: [
        {
          value: '7D',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.ONE_WEEK')
        },
        {
          value: '14D',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.TWO_WEEK')
        },
        {
          value: '1M',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.ONE_MONTHS')
        },
        {
          value: '2M',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.TWO_MONTHS')
        },
        {
          value: '3M',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.THREE_MONTHS')
        },
        {
          value: '6M',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.SIX_MONTHS')
        },
        {
          value: '9M',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.NINE_MONTHS')
        },
        {
          value: '12M',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.TWELEVE_MONTHS')
        },
        {
          value: '24M',
          label: this.$t('FIXED_DEPOSIT_OVERVIEW.TWENTY_MONTHS')
        }
      ],
      fixedAccount:'',
      paymentAccounts:'',
       appointAccount:''
    };
  },
  created() {
    console.log(this.formData, 'formData');
    this.formData.amount = tool.currencyFormat(this.formData.amount, '', 2);
    this.formData.preAvailableInterest = tool.currencyFormat(
      this.formData.preAvailableInterest,
      '',
      2
    );
    this.formData.preAvailablePrincipalInterest = tool.currencyFormat(
      this.formData.preAvailablePrincipalInterest,
      '',
      2
    );
   this.dateList.forEach(item=>{
     if(this.formData.fixedTerm==item.value){
       this.formData.fixedTerms = item.label
     }
   })
    let fixedAccount = this.formData.fixedAccount.split('-');
    let paymentAccount = this.formData.paymentAccount.split('-');
     let appointAccount = this.formData.appointAccount.split('-');
    this.accountTypeList.forEach(item => {
      if (paymentAccount[2] == item.value) {
        paymentAccount[2] = item.label;
      }
      if (fixedAccount[2] == item.value) {
        fixedAccount[2] = item.label;
      }
    });
     this.fixedAccount =
      this.formatAcctNo(fixedAccount[0]) +
      ' ' +
      this.ccyFilter(fixedAccount[1]) +
      ' ' +
      fixedAccount[2];

    this.paymentAccounts =
      this.formatAcctNo(paymentAccount[0]) +
      ' ' +
      this.ccyFilter(paymentAccount[1]) +
      ' ' +
      paymentAccount[2];
        if (
      this.formData.maturityInstructions == '2' ||
      this.formData.maturityInstructions == '3'
    ) {
     
      this.accountTypeList.forEach(item => {
        // CONSTANTS.ACCOUNT_TYPE_LIST.forEach(item => {
        if (item.value === appointAccount[2]) {
          appointAccount[2] = item.label;
        }
      });
      this.appointAccount =
        this.formatAcctNo(appointAccount[0]) +
        '' +
        appointAccount[1] +
        '' +
        appointAccount[2];
    }
  },
  methods: {
    async next() {
      this.isComit = true;
      this.formData.amount = mathTools.delDecollator(this.formData.amount);
      this.formData.preAvailableInterest = mathTools.delDecollator(
        this.formData.preAvailableInterest
      );
      this.formData.preAvailablePrincipalInterest = mathTools.delDecollator(
        this.formData.preAvailablePrincipalInterest
      );
      this.formData.paymentAccountBalance = mathTools.delDecollator(
        this.formData.paymentAccountBalance
      );
      this.submits = true;
      let entType = localStorage.getItem('entType');
      let fixedAccount = this.formData.fixedAccount.split('-');
      let paymentAccount = this.formData.paymentAccount.split('-');
      let maturityInstructions = this.formData.maturityInstructions;
      // let appointAccount = this.formData.appointAccount.split('-');
      let fixedTerm = '';
      if (this.formData.fixedFlag == 'Y') {
        fixedTerm = '0';
      } else {
        fixedTerm = '1';
      }
      this.accountTypeList.forEach(item => {
        if (item.label === paymentAccount[2]) {
          paymentAccount[2] = item.value;
        }
      });

      // if (paymentAccount[2] == 'MULTICURRENCY') {
      //   paymentAccount[0] = paymentAccount[0] + paymentAccount[1];
      // }
      let appointAccount = '';
      if (maturityInstructions == '3') {
        appointAccount = this.formData.appointAccount.split('-');
        this.accountTypeList.forEach(item => {
          if (item.label === appointAccount[2]) {
            appointAccount[2] = item.value;
          }
        });
        // if (appointAccount[2] == 'MULTICURRENCY') {
        //   appointAccount[0] = appointAccount[0] + appointAccount[1];
        // }
      }
      let params = {
        confirm: 'true',
        fixedAccount: fixedAccount[0],
        fixedAccountCur: fixedAccount[1],
        fixedAccountType: 'FIXED', // 定期账户类型
        paymentAccount: paymentAccount[0],
        paymentAccountCur: paymentAccount[1],
        paymentAccountType: paymentAccount[2], //付款账户类型
        depositCurrency: this.formData.contactType,
        depositAmount: this.formData.amount,
        fixedTerm: this.formData.fixedTerm, //固定存期
        depositTermType: fixedTerm, // 存款类型
        appointedDay: this.formData.endDate,
        maturityInstructions: this.formData.maturityInstructions,
        nextTransferDate: this.formData.nextTransferDate, //下次转存期
        appointAccount: appointAccount[0], 
        appointAccountCur: appointAccount[1],
        appointAccountType: appointAccount[2], //指定账户类型
        paymentAccountBalance: this.formData.paymentAccountBalance,
        preAvailableInterest: this.formData.preAvailableInterest, //可得利息
        preAvailablePrincipalInterest:
          this.formData.preAvailablePrincipalInterest, //可得本息
        rate: this.formData.rate,
        reservationNumber: this.formData.reservationNo,
        depositType: '1'
      };
      console.log(params, 'params');
      submitOpen(params)
        .then(res => {
          console.log(res, 'res');
          const { authResultInfo } = res.body;
          const { head } = res;
          console.log(authResultInfo, 'authResultInfo');
          if (['03', '90'].includes(authResultInfo.authResultState)) {
            if (authResultInfo.authResultState == '03') {
              // 需要授权
              let message = {
                status: 'success',
                title: this.$t('COMMON.SUBMIT_SUCCESS'),
                desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + authResultInfo.flowNo,
                confirm: this.$t('ACCOUNT_MAINTENACE.TO_AUTHORIZED')
              };
              this.submits = false;
              this.$emit('next', message);
            } else {
              // 不需要授权
              let message = {
                status: 'success',
                title: this.$t('COMMON.SUBMIT_SUCCESS'),
                desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + authResultInfo.flowNo,
                confirm: ''
              };
              this.submits = false;
              this.$emit('next', message);
            }
          } else {
            let message = {
              status: 'fail',
              title: this.$t('COMMON.SUBMIT_FAIL'),
              desc:this.$t('RIGHTS_TEMPLATE.FAIL_RESON') + head.returnMessage,
              confirm:this.$t('RIGHTS_TEMPLATE.NEED_HELP')
            };
            this.submits = false;
            this.$emit('next', message);
          }
        })
        .catch(err => {
          console.log(err, 'err');
          this.$message({
            type: 'fail',
            message:this.$t('COMMON.SUBMIT_FAIL'),
            desc: 3000
          });
          this.submits = false;
          this.isComit =false
        });
    },
    back() {
      this.$emit('back', this.formData);
    },
    ccyFilter(val) {
      switch (val) {
        case 'HKD':
          return this.$t('ACCOUNT_MANAGEMENT.HKD');
        case 'AUD':
          return this.$t('ACCOUNT_MANAGEMENT.AUD');
        case 'CAD':
          return this.$t('ACCOUNT_MANAGEMENT.CAD');
        case 'CNY':
          return this.$t('ACCOUNT_MANAGEMENT.CNY');
        case 'EUR':
          return this.$t('ACCOUNT_MANAGEMENT.EUR');
        case 'GBP':
          return this.$t('ACCOUNT_MANAGEMENT.GBP');
        case 'JPY':
          return this.$t('ACCOUNT_MANAGEMENT.JPY');
        case 'NZD':
          return this.$t('ACCOUNT_MANAGEMENT.NZD');
        case 'SGD':
          return this.$t('ACCOUNT_MANAGEMENT.SGD');
        case 'TWD':
          return this.$t('ACCOUNT_MANAGEMENT.TWD');
        case 'USD':
          return this.$t('ACCOUNT_MANAGEMENT.USD');
        case 'CHF':
          return this.$t('ACCOUNT_MANAGEMENT.CHF');
        case 'CNH':
          return this.$t('ACCOUNT_MANAGEMENT.CNH');
        case 'DKK':
          return this.$t('ACCOUNT_MANAGEMENT.DKK');
        case 'SEK':
          return this.$t('ACCOUNT_MANAGEMENT.SEK');
        case 'THB':
          return this.$t('ACCOUNT_MANAGEMENT.THB');
        default:
          return val;
      }
    },
    formatAcctNo(origin) {
      const _origin = origin || '';
      const str1 = _origin.slice(0, 3),
        str2 = _origin.slice(3, 5),
        str3 = _origin.slice(5, _origin.length);

      return `${str1}-${str2}-${str3}`;
    },
  }
};
</script>{

<style lang="scss" scoped>
.el-row {
  margin-left: 22%;
}
.m-form {
  margin-top: 20px;
}
// .content {
//   width: 250px;
// }
.u-btn {
  display: flex;
  margin-left: 35%;
}
.f-btn {
  display: flex;
  margin-top: 22px;
  margin-left: 34%;
}
.g-confirmContent {
  width: 888px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 18%;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
