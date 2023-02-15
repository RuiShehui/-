<template>
  <div class="g-beforeDetails" v-loading="acctLoading">
    <div class="m-detailItem">
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT`)"
        :content="fixedAccount"
      ></detail-item>
      <detail-item :title="$t(`OPEN_FIXED.PAYMENT_ACCOUNT`)" :content="paymentAccounts"></detail-item>
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
        :content="formData.depositCurrency+' '+formData.depositAmounts"
      ></detail-item>
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        :content="formData.depositTermType === '0' ? fixedTerm: formData.depositTermType === '1' ? formData.appointedDay : formData.appointedDay"
      ></detail-item>
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
        :content="formData.maturityInstructions === '1' ? $t(`FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL`): formData.maturityInstructions === '2' ? $t(`FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS`) : $t(`FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL`)"
      ></detail-item>
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        v-if="formData.maturityInstructions=='2'||formData.maturityInstructions=='3'"
        :content="appointAccount"
      ></detail-item>
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR`)"
        v-if="formData.maturityInstructions !=='3'"
        :content="nextTransferDate"
      ></detail-item>
      <detail-item :title="$t(`OPEN_FIXED.RATE`)" :content="formData.fixedTermRate+'%p.a.'"></detail-item>
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST`)"
        :content="this.formData.depositCurrency+' '+formData.preAvailableInterest"
      ></detail-item>

      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL`)"
        :content="this.formData.depositCurrency+' '+formData.preAvailablePrincipalInterest"
      ></detail-item>
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
import { sendEmail } from '@/api/sendMsg.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
import { formatAcctNo } from '../utils/tools.js';
import CONSTANTS from '@/utils/contants.js';
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
      acctLoading: false,
      fixedAccount: '', //定期账户
      paymentAccounts: '', // 付款账户
      appointAccount: '', // 指定账户
      fixedTerm: '', // 固定存期
      nextTransferDate: '', // 下次转存期
      isComit: false,
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
    };
  },
  created() {
    this.formData.depositAmounts = tool.currencyFormat(
      this.formData.depositAmount,
      '',
      2
    );
    console.log(this.formData.depositAmount, 'this.formData');
  },
  mounted() {
    this.handleMoney();
    let fixedAccount = this.formData.fixedAccount.split('-');
    let paymentAccount = this.formData.paymentAccount.split('-');
    this.accountTypeList.forEach(item => {
      if (paymentAccount[2] == item.value) {
        paymentAccount[2] = item.label;
      }
      if (fixedAccount[2] == item.value) {
        fixedAccount[2] = item.label;
      }
    });
    this.fixedAccount =
      formatAcctNo(fixedAccount[0]) +
      ' ' +
      this.ccyFilter(fixedAccount[1]) +
      ' ' +
      fixedAccount[2];

    this.paymentAccounts =
      formatAcctNo(paymentAccount[0]) +
      ' ' +
      this.ccyFilter(paymentAccount[1]) +
      ' ' +
      paymentAccount[2];

    if (
      this.formData.maturityInstructions == '2' ||
      this.formData.maturityInstructions == '3'
    ) {
      let appointAccount = this.formData.appointAccount.split('-');
      this.accountTypeList.forEach(item => {
        // CONSTANTS.ACCOUNT_TYPE_LIST.forEach(item => {
        if (item.value === appointAccount[2]) {
          appointAccount[2] = item.label;
        }
      });
      this.appointAccount =
        formatAcctNo(appointAccount[0]) +
        '' +
        appointAccount[1] +
        '' +
        appointAccount[2];
    }

    this.dateList.forEach(item => {
      if (this.formData.fixedTerm == item.value) {
        this.fixedTerm = item.label;
      }
      if (this.formData.nextTransferDate == item.value) {
        this.nextTransferDate = item.label;
      }
    });
  },
  methods: {
    async next(confirm = 'false') {
      this.isComit = true;
      console.log(this.formData, 'formData');
      this.formData.depositAmount = mathTools.delDecollator(
        this.formData.depositAmount
      );
      this.formData.paymentAccountBalance = mathTools.delDecollator(
        this.formData.paymentAccountBalance
      );
      this.formData.preAvailablePrincipalInterest = mathTools.delDecollator(
        this.formData.preAvailablePrincipalInterest
      );
      this.formData.preAvailableInterest = mathTools.delDecollator(
        this.formData.preAvailableInterest
      );
      let entType = localStorage.getItem('entType');
      this.acctLoading = true;
      let fixedAccount = this.formData.fixedAccount.split('-');
      let paymentAccount = this.formData.paymentAccount.split('-');

      let maturityInstructions = this.formData.maturityInstructions;
      this.accountTypeList.forEach(item => {
        // CONSTANTS.ACCOUNT_TYPE_LIST.forEach(item => {
        if (item.label === paymentAccount[2]) {
          paymentAccount[2] = item.value;
        }
        if (item.label == fixedAccount[2]) {
          fixedAccount[2] = item.value;
        }
      });
      let appointAccount = '';
      if (maturityInstructions == '2' || maturityInstructions == '3') {
        appointAccount = this.formData.appointAccount.split('-');
        this.accountTypeList.forEach(item => {
          // CONSTANTS.ACCOUNT_TYPE_LIST.forEach(item => {
          if (item.label === appointAccount[2]) {
            appointAccount[2] = item.value;
          }
        });
        // if (appointAccount[2] == 'MULTICURRENCY') {
        //   appointAccount[0] = appointAccount[0] + appointAccount[1];
        // }
      }

      console.log(paymentAccount[0], 'paymentAccount[2]');
      let params = {};
      switch (maturityInstructions) {
        case '1':
          params = {
            confirm,
            fixedAccount: fixedAccount[0], //定期账户
            fixedAccountCur: fixedAccount[1], //定期账户币种
            fixedAccountType: fixedAccount[2], // 定期账户类型
            paymentAccount: paymentAccount[0], // 付款账户
            paymentAccountCur: paymentAccount[1], // 付款账户币种
            paymentAccountType: paymentAccount[2], //付款账户类型
            depositCurrency: this.formData.depositCurrency, //存款币种
            depositAmount: this.formData.depositAmount, //存款金额
            fixedTerm: this.formData.fixedTerm, //固定存期
            depositTermType: this.formData.depositTermType, // 存款类型
            appointedDay: this.formData.appointedDay, //指定日期
            maturityInstructions: maturityInstructions, //到期指示
            nextTransferDate: this.formData.nextTransferDate || '', //下次转存期
            paymentAccountBalance: this.formData.paymentAccountBalance, //可用结余
            preAvailableInterest: this.formData.preAvailableInterest || '', //可得利息
            preAvailablePrincipalInterest:
              this.formData.preAvailablePrincipalInterest || '', //可得本息
            rate: this.formData.fixedTermRate, //利率
            depositType: '0'
          };
          break;
        case '2':
          params = {
            confirm,
            fixedAccount: fixedAccount[0],
            fixedAccountCur: fixedAccount[1],
            fixedAccountType: fixedAccount[2], // 定期账户类型
            paymentAccount: paymentAccount[0],
            paymentAccountCur: paymentAccount[1],
            paymentAccountType: paymentAccount[2], //付款账户类型
            depositCurrency: this.formData.depositCurrency,
            depositAmount: this.formData.depositAmount,
            fixedTerm: this.formData.fixedTerm, //固定存期
            depositTermType: this.formData.depositTermType, // 存款类型
            appointedDay: this.formData.appointedDay,
            maturityInstructions: maturityInstructions,
            nextTransferDate: this.formData.nextTransferDate, //下次转存期
            appointAccount: appointAccount[0], //指定账户
            appointAccountCur: appointAccount[1], //指定账户币种
            appointAccountType: appointAccount[2], //指定账户类型
            paymentAccountBalance: this.formData.paymentAccountBalance,
            preAvailableInterest: this.formData.preAvailableInterest || '', //可得利息
            preAvailablePrincipalInterest:
              this.formData.preAvailablePrincipalInterest || '', //可得本息
            rate: this.formData.fixedTermRate,
            depositType: '2'
          };
          break;
        case '3':
          params = {
            confirm,
            fixedAccount: fixedAccount[0],
            fixedAccountCur: fixedAccount[1],
            fixedAccountType: fixedAccount[2], // 定期账户类型
            paymentAccount: paymentAccount[0],
            paymentAccountCur: paymentAccount[1],
            paymentAccountType: paymentAccount[2], //付款账户类型
            depositCurrency: this.formData.depositCurrency,
            depositAmount: this.formData.depositAmount,
            fixedTerm: this.formData.fixedTerm, //固定存期
            depositTermType: this.formData.depositTermType, // 存款类型
            appointedDay: this.formData.appointedDay,
            maturityInstructions: maturityInstructions,
            nextTransferDate: this.formData.nextTransferDate, //下次转存期
            appointAccount: appointAccount[0],
            appointAccountCur: appointAccount[1],
            appointAccountType: appointAccount[2], //指定账户类型
            paymentAccountBalance: this.formData.paymentAccountBalance,
            preAvailableInterest: this.formData.preAvailableInterest, //可得利息
            preAvailablePrincipalInterest: this.formData
              .preAvailablePrincipalInterest, //可得本息
            rate: this.formData.fixedTermRate,
            depositType: '3'
          };
          break;
      }
      console.log(params, 'params');

      const result = await submitOpen(params);
      console.log(result, 'result');
      const body = result.body;
      const returnMessage = result.head.returnMessage;
      if (body) {
        const returnCode = result.head.returnCode;

        const hostErrorCode = result.head.hostErrorCode;
        const authResultInfo = result.body.authResultInfo;
        const flowNo = result.body.authResultInfo.flowNo;
        if (['03', '90'].includes(authResultInfo.authResultState)) {
          if (authResultInfo.authResultState === '03') {
            let message = {
              status: 'success',
              title: this.$t('AUTHORIZE.WAIT_AUTH'),
              desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + flowNo,
              confirm: this.$t('ACCOUNT_MAINTENACE.TO_AUTHORIZED')
            };
            this.acctLoading = false;
            this.$emit('next', message);
          } else {
            let message = {
              status: 'success',
              title: this.$t('COMMON.SUBMIT_SUCCESS'),
              desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + flowNo,
              confirm: ''
            };
            this.acctLoading = false;
            this.$emit('next', message);
          }
        } else if (result.head.returnCode == 'COC009970') {
          this.$confirm({
            isIcon: false,
            type: 'warn',
            message: this.$t('PAYMENT.TRANSFER_REPEAT_INT'),
            btnText: {
              cancleText: this.$t('COMMON.CANCEL'),
              confirmText: this.$t('COMMON.CONFIRM')
            },
            countDown: true,
            isCancle: true
          })
            .then(() => {
              this.next('true');
            })
            .catch(() => {
              this.isComit = false;
              this.acctLoading = false;
            });
        } else {
          let message = {
            status: 'fail',
            title: this.$t('COMMON.SUBMIT_FAIL'),
            desc: this.$t('RIGHTS_TEMPLATE.FAIL_RESON') + returnMessage,
            confirm: this.$t('RIGHTS_TEMPLATE.NEED_HELP')
          };
          this.acctLoading = false;
          this.$emit('next', message);
        }
      }else{
        this.$message({
          type: 'fail',
          message:returnMessage
        })
         this.isComit = false;
         this.acctLoading = false;
      }
      // if (authResultInfo !== '91') {
      //   if (entType == '2') {
      //     let message = {
      //       status: 'success',
      //       title: this.$t('AUTHORIZE.WAIT_AUTH'),
      //       desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + flowNo,
      //       confirm: this.$t('ACCOUNT_MAINTENACE.TO_AUTHORIZED')
      //     };
      //     this.$emit('next', message);
      //   } else if (entType == '1') {
      //     let message = {
      //       status: 'success',
      //       title: this.$t('COMMON.SUBMIT_SUCCESS'),
      //       desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + flowNo,
      //       confirm: ''
      //     };
      //     this.acctLoading = false;
      //     this.$emit('next', message);
      //   }
      // } else {
      //   let message = {
      //     status: 'fail',
      //     title: this.$t('COMMON.SUBMIT_FAIL'),
      //     desc: this.$t('RIGHTS_TEMPLATE.FAIL_RESON') + returnMessage,
      //     confirm: this.$t('RIGHTS_TEMPLATE.NEED_HELP')
      //   };
      //   this.acctLoading = false;
      //   this.$emit('next', message);
      // }
      // } else if (result.head.returnCode == 'COC009970') {
      //   this.$confirm({
      //     isIcon: false,
      //     type: 'warn',
      //     message: this.$t('PAYMENT.TRANSFER_REPEAT_INT'),
      //     btnText: {
      //       cancleText: this.$t('COMMON.CANCEL'),
      //       confirmText: this.$t('COMMON.CONFIRM')
      //     },
      //     countDown: true,
      //     isCancle: true
      //   })
      //     .then(() => {
      //       this.next('true');
      //     })
      //     .catch(() => {
      //       this.isComit = false;
      //       this.acctLoading = false;
      //     });
      // } else {
      //   let message = {
      //     status: 'fail',
      //     title: this.$t('COMMON.SUBMIT_FAIL'),
      //     desc: this.$t('RIGHTS_TEMPLATE.FAIL_RESON') + returnMessage,
      //     confirm: this.$t('RIGHTS_TEMPLATE.NEED_HELP')
      //   };
      //   this.acctLoading = false;
      //   this.$emit('next', message);
      // }
    },
    //处理金额千分位显示
    handleMoney() {
      this.formData.paymentAccountBalance = tool.currencyFormat(
        this.formData.paymentAccountBalance,
        '',
        2
      );
      this.formData.preAvailablePrincipalInterest = tool.currencyFormat(
        this.formData.preAvailablePrincipalInterest,
        '',
        2
      );
      this.formData.preAvailableInterest = tool.currencyFormat(
        this.formData.preAvailableInterest,
        '',
        2
      );
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
    }
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
.u-btn {
  display: flex;
  margin-left: 35%;
}
.f-btn {
  display: flex;
  margin-top: 22px;
  margin-left: 34%;
}
.m-detailItem {
  width: 888px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 18%;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
