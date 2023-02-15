    <template>
  <div class="g-beforeDetails" v-loading="changeDueTip">
    <div class="g-confirmContent">
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT`)"
        :content="formatAccountNo(comfirmData.fixedAccount)+'-'+comfirmData.fixedAccountCur+'-'+this.$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT')"
      ></DetailItem>
      <DetailItem :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_NUMBER`)" :content="comfirmData.altId"></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.VALUE_DATE`)"
        :content="datefilter(comfirmData.valueDate)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURIT`)"
        :content="datefilter(comfirmData.dueDate)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
        :content="comfirmData.depositAmount"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        :content="comfirmData.depositTimes"
      ></DetailItem>
      <DetailItem :title="$t(`FIXED_DEPOSIT_OVERVIEW.INTEREST_RATES`)" :content="comfirmData.rate"></DetailItem>
      <DetailItem
        v-if="comfirmData.preAvailableInterest==null||comfirmData.preAvailableInterest==''?false:true"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST`)"
        :content="comfirmData.fixedAccountCur+' '+comfirmData.preAvailableInterest"
      ></DetailItem>
      <DetailItem
        v-if="comfirmData.preAvailablePrincipalInterest==null||comfirmData.preAvailablePrincipalInterest==''?false:true"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL`)"
        :content="comfirmData.fixedAccountCur+' '+comfirmData.preAvailablePrincipalInterest"
      ></DetailItem>
      <DetailItem :title="$t(`FIXED_DEPOSIT_OVERVIEW.REMARKS`)" :content="comfirmData.remark||'--'"></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
        :content="comfirmData.newMaturityInstructions === '1' ? $t(`FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL`): comfirmData.newMaturityInstructions === '2' ? $t('FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS') : $t(`FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL`)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR`)"
        v-if="comfirmData.newMaturityInstructions!=='3'"
        :content="comfirmData.newNextTransferDates"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        v-if="comfirmData.newMaturityInstructions=='2'||comfirmData.newMaturityInstructions=='3'"
        :content="`${formatAccountNo(comfirmData.newAppointAccount)} ${(comfirmData.newAppointAccountCur) } ${processAccountType(comfirmData.newAppointAccountType)}`"
      ></DetailItem>
    </div>
    <div class="f-btn">
      <VButton size="w160" @click="back">{{$t(`COMMON.PREVIOUS_STEP`)}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:16px;"
        @click="next"
      >{{$t(`COMMON.DETERMINE`)}}</VButton>
    </div>
  </div>
</template>

<script>
import {
  changeDueTipsResult,
  updateInstructionsAuth,
  updateInstructionsSubmit
} from '@/api/openFixed.js';
import business from '@/filters/business.js';
import CONSTANTS from '@/utils/contants.js';
import mathTools from '@/utils/mathTools.js';
export default {
  props: {
    comfirmData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      account: [],
      changeDueTip: false,
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
      ]
    };
  },
  created() {
    console.log(this.comfirmData, 'comfirmDatassssss');
    this.dateList.forEach(item => {
      if (this.comfirmData.depositTime == item.value) {
        this.comfirmData.depositTimes = item.label;
      }
    });
    if (
      this.comfirmData.newMaturityInstructions == '2' ||
      this.comfirmData.newMaturityInstructions == '1'
    ) {
      this.dateList.forEach(item => {
        if (this.comfirmData.newNextTransferDate == item.value) {
          this.comfirmData.newNextTransferDates = item.label;
        }
      });
    }
  },
  methods: {
    processAccountType(val) {
      return business.processAccountType(val);
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    next() {
      this.changeDueTip = true;

      if (
        this.comfirmData.newMaturityInstructions == '2' ||
        this.comfirmData.newMaturityInstructions == '3'
      ) {
        if (this.comfirmData.newAppointAccountType == 'MULTICURRENCY') {
          this.comfirmData.newAppointAccount = this.comfirmData.newAppointAccount + this.comfirmData.newAppointAccountCur
        }
      }
      CONSTANTS.SELECT_DATE_LISTS.forEach(item => {
        if (this.comfirmData.depositTime == item.label) {
          this.comfirmData.depositTime = item.value;  
        }
      });
      this.comfirmData.depositAmount = mathTools.delDecollator(
        this.comfirmData.depositAmount
      );
      this.comfirmData.preAvailablePrincipalInterest = mathTools.delDecollator(
        this.comfirmData.preAvailablePrincipalInterest
      );
      this.comfirmData.rate = this.comfirmData.rate.split('%')[0];
      let params = {
        action: '1',
        depositAmount: this.comfirmData.depositAmount, //存款额
        altId: this.comfirmData.altId, //存款编号
        depositCode: this.comfirmData.depositCode,
        depositCurrency: this.comfirmData.depositCurrency, // 币种
        depsitPeriod: this.comfirmData.depositTime, //存款期
        dueDate: this.comfirmData.dueDate,
        fixedAccount: this.comfirmData.fixedAccount,
        fixedAccountCur: this.comfirmData.fixedAccountCur,
        fixedAccountType: 'FIXED',
        newAppointAccount: this.comfirmData.newAppointAccount,
        newAppointAccountCur: this.comfirmData.newAppointAccountCur,
        newAppointAccountType: this.comfirmData.newAppointAccountType,
        newMaturityInstructions: this.comfirmData.newMaturityInstructions,
        newNextTransferDate: this.comfirmData.newNextTransferDate,
        nextTransferDate: this.comfirmData.nextTransferDate,
        preAvailableInterest: this.comfirmData.preAvailableInterest,
        preAvailablePrincipalInterest: this.comfirmData
          .preAvailablePrincipalInterest,
        rate: this.comfirmData.rate,
        remark: this.comfirmData.remark,
        valueDate: this.comfirmData.valueDate,
        paymentAccount: this.comfirmData.paymentAccount,
        paymentAccountCur: this.comfirmData.paymentAccountCur,
        paymentAccountType: this.comfirmData.paymentAccountType,
        depositTermType: this.comfirmData.depositTermType

        // action: '1'
      };

      console.log(params, 'prams');
      let entType = localStorage.getItem('entType');
      updateInstructionsSubmit(params).then(resp => {
        console.log('resp', resp);
        const { authResultInfo } = resp.body;
        const { head } = resp;
        console.log(head.returnCode, 'returnCode');
        if (
          resp.head.returnCode === '000000' &&
          ['03', '90'].includes(authResultInfo.authResultState)
        ) {
          if (authResultInfo.authResultState === '03') {
            let message = {
              status: 'success',
              title: this.$t('AUTHORIZE.WAIT_AUTH'),
              desc:
                this.$t('OPERATORLOG.REFERENCE_NUMBER') + authResultInfo.flowNo,
              confirm: this.$t('ACCOUNT_MAINTENACE.TO_AUTHORIZED')
            };
            this.acctLoading = false;
            this.$emit('next', message);
          } else {
            let message = {
              status: 'success',
              title: this.$t('COMMON.SUBMIT_SUCCESS'),
              desc:
                this.$t('OPERATORLOG.REFERENCE_NUMBER') + authResultInfo.flowNo,
              confirm: ''
            };
            this.acctLoading = false;
            this.$emit('next', message);
          }
        } else if (head.returnCode == 'COC009970') {
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
              this.changeDueTip = false;
            });
        } 
      }).catch(()=>{
         this.changeDueTip = false;
      })
    },
    back() {
      this.$emit('back');
    },
    datefilter(val) {
      let y = val.substring(0, 4),
        m = val.substring(4, 6),
        d = val.substring(6, 8);
      console.log(y, 'yyyyyy');
      console.log(m, 'mmmm');
      console.log(d, 'ddddd');
      return y + '-' + m + '-' + d;
    }
  }
};
</script>{

<style lang="scss" scoped>
.el-row {
  margin-left: 22%;
}
.u-form {
  margin-left: 27%;
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
  margin-left: 35%;
}
.u-pickerDate {
  ::v-deep .el-input__inner {
    width: 320px !important;
  }
  ::v-deep .el-input__suffix {
    right: -100px;
  }
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
