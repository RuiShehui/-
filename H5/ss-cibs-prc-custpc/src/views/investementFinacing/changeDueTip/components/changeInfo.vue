<template>
  <div class="g-beforeDetails">
    <div class="g-confirmContent">
      <DetailItem
        :title="$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT')"
        :content="formatAccountNo(content.acctNo)+'-'+content.cur+'-'+ this.$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT')"
      ></DetailItem>
      <DetailItem :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_NUMBER`)" :content="content.altId"></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.VALUE_DATE`)"
        :content="datefilter(content.effdate)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURIT`)"
        :content="datefilter(content.matdate)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
        :content="content.cur+' '+content.depositAmount"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        :content="monthFilters(content.deposiTime)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.INTEREST_RATES`)"
        :content="content.rateOfYear"
      ></DetailItem>
      <DetailItem
        v-if="content.preAvailableInterest==null||content.preAvailableInterest==''?false:true"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST`)"
        :content="content.cur+' '+content.preAvailableInterest "
      ></DetailItem>
      <DetailItem
        v-if="content.preAvailablePrincipalInterest==null||content.preAvailablePrincipalInterest==''?false:true"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL`)"
        :content="content.cur+' '+content.preAvailablePrincipalInterest "
      ></DetailItem>
      <DetailItem
        :title="this.$t('FIXED_DEPOSIT_OVERVIEW.OLD_MATURITY')"
        :content="content.maturityInstructs"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR`)"
        v-if="content.maturityInstruct !=='3'"
        :content="monthFilters(content.nextTransferDate)"
      ></DetailItem>
      <DetailItem
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        v-if="content.maturityInstruct !=='1'"
        :content="formatAccountNo(appointAccount)+'-'+content.cur+'-'+filetrType(appointType)"
      ></DetailItem>
      <DetailItem :title="$t(`FIXED_DEPOSIT_OVERVIEW.REMARKS`)" :content="content.remark||'--'"></DetailItem>
    </div>
    <divider
      style="margin-top:24px;"
      :title="$t(`FIXED_DEPOSIT_OVERVIEW.AMEND_MATURITY_INSTRUCTION`)"
    />
    <el-form class="u-form" ref="formData" :rules="rules" :model="formData" label-width="220px;">
      <el-form-item
        :label="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
        prop="newMaturityInstructions"
        style="padding-top:12px;"
        label-width="120px"
      >
        <el-radio
          :disabled="isdisabled"
          label="1"
          v-model="formData.newMaturityInstructions"
        >{{$t(`FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL`)}}</el-radio>
        <el-radio
          :disabled="isdisabled"
          label="2"
          v-model="formData.newMaturityInstructions"
        >{{$t(`FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS`)}}</el-radio>
        <el-radio
          label="3"
          v-model="formData.newMaturityInstructions"
          :class="lang==='en'?'':'u-radio'"
        >{{$t(`FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL`)}}</el-radio>
      </el-form-item>
      <el-form-item
        :label="$t(`FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR`)"
        prop="newNextTransferDate"
        class="u-pickerDate"
        v-if="formData.newMaturityInstructions === '1' "
        label-width="120px"
      >
        <el-select v-model="formData.newNextTransferDate">
          <el-option
            v-for="item in nextTransferDate"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label-width="120px"
        prop="newAppointAccount"
        :label="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        v-if="formData.newMaturityInstructions === '2' "
      >
        <el-select v-model="formData.newAppointAccount" @change="selectAccountChange">
          <el-option
            v-for="(item,ind) in account"
            :key="ind"
            :label="`${formatAccountNo(item.accountNo)} ${(item.currencyType) } ${processAccountType(item.acctTypeConvertor)}`"
            :value="item.accountNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t(`FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR`)"
        prop="newNextTransferDate"
        v-if="formData.newMaturityInstructions === '2' "
        label-width="120px"
      >
        <el-select v-model="formData.newNextTransferDate">
          <el-option
            v-for="item in nextTransferDate"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        prop="newAppointAccount"
        class="u-pickerDate"
        v-if="formData.newMaturityInstructions === '3' "
        label-width="120px"
      >
        <el-select v-model="formData.newAppointAccount" @change="selectAccountChange">
          <el-option
            v-for="(item,index) in account"
            :key="index"
            :label="`${formatAccountNo(item.accountNo)} ${(item.currencyType) } ${processAccountType(item.acctTypeConvertor)}`"
            :value="item.accountNo"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="f-btn">
      <VButton size="w160" @click="backTo">{{$t('COMMON.BACK')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:16px;"
        @click="next"
      >{{$t('COMMON.SUBMIT')}}</VButton>
    </div>
  </div>
</template>

<script>
import { queryAcctList } from '@/api/openFixed.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
import business from '@/filters/business.js';
import CONSTANTS from '@/utils/contants.js';
import filters from "@/filters/public.js"
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('app');

export default {
  props: {},
  data() {
    return {
      account: [],
      content: [],
      nextTransferDate: [],
      formData: {
        newMaturityInstructions: '', //到期指示
        date: '',
        newNextTransferDate: '',
        newAppointAccount: '',
        newAppointAccountCur: '',
        newAppointAccountType: ''
      },
      currency: '',
      isdisabled: false,
      appointAccount: '',
      appointType: '',
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
  computed: {
    ...mapState(['lang']),
    rules() {
      return {
        newMaturityInstructions: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION')
            })
          }
        ],
        newNextTransferDate: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR')
            })
          }
        ],
        newAppointAccount: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT')
            })
          }
        ]
      };
    }
  },
  filters:{
   fixedTermType:filters.fixedTermType
  },
  created() {
    this.SET_LANG();
    this.content = this.$route.params;
    console.log(this.content, 'congtent');
    this.getAccountList();
    this.changeDue();
    this.maturityInstructsFilter(this.content.maturityInstruct);
    if (this.content.depositTermType == '1') {
      this.isdisabled = true;
    }
    // if (
    //   this.content.maturityInstruct == '2' ||
    //   this.content.maturityInstruct == '1'
    // ) {
    //   console.log(this.content.deposiTime.length, 'nextTransferDate');
    //   let nextTransferDate = this.content.nextTransferDate.substr(
    //     this.content.nextTransferDate.length - 1,
    //     1
    //   );
    //   let number = this.content.nextTransferDate.substr(
    //             0,
    //             this.content.nextTransferDate.length - 1
    //           );
    //   if(number=='1'){
    //       if (nextTransferDate == 'D') {
    //     // console.log(item.deposiTime,'item.deposiTime')
    //         this.content.nextTransferDates = this.content.nextTransferDate.replace(
    //           /(.*)D/,
    //           `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.ONE_DAYS')}` //天
    //         );
    //         //  console.log(item.deposiTime,'item.deposiTim1e')
    //       }
    //       if (nextTransferDate == 'M') {
    //         this.content.nextTransferDates = this.content.nextTransferDate.replace(
    //           /(.*)M/,
    //           `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.MONTH')}` //个月
    //         );
    //       }
    //   }else{
    //       if (nextTransferDate == 'D') {
    //     // console.log(item.deposiTime,'item.deposiTime')
    //         this.content.nextTransferDates = this.content.nextTransferDate.replace(
    //           /(.*)D/,
    //           `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DAY')}` //天
    //         );
    //         //  console.log(item.deposiTime,'item.deposiTim1e')
    //       }
    //       if (nextTransferDate == 'M') {
    //         this.content.nextTransferDates = this.content.nextTransferDate.replace(
    //           /(.*)M/,
    //           `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DOUBLE_MOTH')}` //个月
    //         );
    //       }
    //   }
    // }
    if (
      this.content.maturityInstruct == '2' ||
      this.content.maturityInstruct == '3'
    ) {
      this.appointAccount = this.content.reNewAcc.replace(/[^0-9]/g, '');
      this.appointType = this.content.reNewAcc.replace(/[^a-zA-Z]/g, '');
      console.log(this.appointType, 'appointType');
      this.appointType = this.appointType.slice(3);
    }
    this.content.preAvailablePrincipalInterest = tool.currencyFormat(
      this.content.preAvailablePrincipalInterest,
      '',
      2
    );
  },
  methods: {
    ...mapActions(['SET_LANG']),

    next() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          CONSTANTS.MATURITY_TRUCIONS.forEach(item => {
            if (item.label == this.content.maturityInstruct) {
              this.content.maturityInstruct = item.value;
            }
          });
          let comfirmData = {
            depositAmount: this.content.depositAmount, //存款金额
            depositCode: this.content.deposit, //存款编号
            depositCurrency: this.content.cur, // 存款币种
            depositTime: this.content.deposiTime, // 存款期
            dueDate: this.content.matdate, // 到期日
            fixedAccount: this.content.acctNo, // 定期账号
            fixedAccountCur: this.content.cur, // 定期账号-币种
            fixedAccountType: this.content.fixedAccountType,
            paymentAccount: this.content.paymentAccount, // 付款账户
            paymentAccountCur: this.content.cur, // 付款账户
            paymentAccountType: this.content.paymentAccountType,
            newMaturityInstructions: this.formData.newMaturityInstructions, // 到期指示
            preAvailableInterest: '' || this.content.preAvailableInterest, // 预计可得利息
            preAvailablePrincipalInterest:
              '' || this.content.preAvailablePrincipalInterest, // 预计可得本息
            valueDate: this.content.effdate, //  起息日
            rate: this.content.rateOfYear, //  利率
            newAppointAccount: '' || this.formData.newAppointAccount, //  更改到期指示时的新指定账户
            newAppointAccountCur: '' || this.formData.newAppointAccountCur, //  更改到期指示时的新指定账户币种
            newAppointAccountType: '' || this.formData.newAppointAccountType, //  更改到期指示时的新指定账户类型
            newNextTransferDate: this.formData.newNextTransferDate, //  更改到期指示时的新下次转存期
            nextTransferDate: this.formData.maturityInstruct, //  下次转存期
            remark: '', //  备注
            altId: this.content.altId,
            depositTermType: this.content.depositTermType
          };
          this.$emit('next', comfirmData);
          // console.log('123',comfirmData)
        }
      });
    },
    maturityInstructsFilter(value) {
      CONSTANTS.getMaturity().forEach(item => {
        if (value == item.value) {
          this.content.maturityInstructs = item.label;
        }
      });
    },
    backTo() {
      this.$router.push('/investmentFinancing/changeDueTip');
    },
    getAccountList() {
      let params = {
        currencyType: this.content.cur
      };
      queryAcctList(params).then(res => {
        this.account = res.payerAccoInfoList;
      });
    },
    changeDue() {
      if (this.content.cur == 'HKD' || this.content.cur == 'CNY') {
        this.nextTransferDate = this.dateList;
      } else {
        this.nextTransferDate = this.dateList;
      }
      console.log(this.nextTransferDate, 'nextTransferDate');
    },
    processAccountType(val) {
      return business.processAccountType(val);
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    filetrType(value) {
      return value
        ? CONSTANTS.getAccountType().find(tpye => tpye.value == value).label
        : '';
    },
    filterDate(value) {
      return value
        ? CONSTANTS.dateList().find(tpye => tpye.value == value).label
        : '';
    },
    monthFilters(val){
      return filters.fixedTermType(val)
    },
    datefilter(val) {
      let y = val.substring(0, 4),
        m = val.substring(4, 6),
        d = val.substring(6, 8);
      console.log(y, 'yyyyyy');
      console.log(m, 'mmmm');
      console.log(d, 'ddddd');
      return y + '-' + m + '-' + d;
    },
    selectAccountChange(acc) {
      this.formData.newAppointAccount = acc;
      for (let i = 0; i < this.account.length; i++) {
        if (this.account[i].accountNo == this.formData.newAppointAccount) {
          this.formData.newAppointAccount = this.account[i].accountNo;
          this.formData.newAppointAccountCur = this.account[i].currencyType;
          this.formData.newAppointAccountType = this.account[
            i
          ].acctTypeConvertor;
        }
      }
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
.el-radio {
  padding-top: 12px;
}
::v-deep .el-input__inner {
  width: 320px !important;
}
::v-deep .el-input {
  width: 320px !important;
}
.u-pickerDate {
  ::v-deep .el-input__inner {
    width: 320px !important;
  }
  // ::v-deep .el-input__suffix {
  //   // right: -100px;
  // }
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
// .u-radio{
//   // margin-left: 138px;
// }
</style>
