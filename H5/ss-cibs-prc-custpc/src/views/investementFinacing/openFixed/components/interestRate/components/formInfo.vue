<template>
  <div class="u-form" v-loading="acctLoading">
    <el-form ref="formData" :rules="rules" :model="formData" class="m-form" label-width="330px">
      <el-form-item :label="$t(`FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT`)" prop="fixedAccount">
        <el-select v-model="formData.fixedAccount" @change="changeOpenFixed">
          <el-option
            v-for="(item,index) in fixedAccount"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <span class="u-span" @click="showDialog('intestRate')">{{$t(`OPEN_FIXED.RATES_ENQUIRY`)}}</span>
        <span
          class="u-span"
          @click="showDialog('calactor')"
        >{{$t(`OPEN_FIXED.INTEREST_CALCULATOR`)}}</span>
      </el-form-item>
      <el-form-item :label="$t(`OPEN_FIXED.PAYMENT_ACCOUNT`)" prop="paymentAccount">
        <el-select v-model="formData.paymentAccount" @change="changePayment">
          <el-option
            v-for="(item,index) in paymentAccount"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <span
          class="f12 gray3"
          style="margin-left:12px;"
          v-if="formData.paymentAccount"
        >{{$t(`OPEN_FIXED.AVAILABLE_BALANCE`)}}:{{formData.paymentAccountBalance}}</span>
      </el-form-item>
      <el-tag
        v-if="payAccountType==='CURRENT'"
        style="margin-left: 32%;margin-bottom: 20px;"
        type="warning"
      >
        <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
      </el-tag>
      <el-form-item
        :label="$t(`APPOINTMENT_NUMBER.APPOINTMENT_NUMBERS`)"
        class="u-code"
        prop="reservationNo"
      >
        <el-input
          v-model="formData.reservationNo"
          @blur="changeBlur(formData.reservationNo)"
          @focus="changeFocus"
        ></el-input>
      </el-form-item>
      <p class="u-errorTips" v-if="tipsOne">{{$t(`APPOINTMENT_NUMBER.APPOINTMENT_NUMBER`)}}</p>
      <p class="u-errorTips" v-if="tipsTwo">{{$t(`APPOINTMENT_NUMBER.NOT_YET`)}}</p>
      <p
        class="u-errorTips"
        v-if="tipsThree"
      >{{$t(`APPOINTMENT_NUMBER.APPOINTMENT_NUMBER_EXPIRED`)}}</p>
      <p class="u-errorTips" v-if="tipsFour">{{$t(`OPEN_FIXED.THE_CODE_USED`)}}</p>
      <p
        class="u-errorTips"
        style="color:#ccc;padding-bottom:8px"
        v-if="formData.flag"
      >{{$t(`APPOINTMENT_NUMBER.VALIDITY_PERIOD`)}}:{{effectiveDate}}</p>
      <div class="u-formItem" v-if="formData.flag">
        <el-form-item
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
          class="u-sel"
          prop="contactType"
        >
          <el-select v-model="formData.contactType" disabled>
            <!-- <el-option
              v-for="item in rate"
              :key="item.value"
              :value="item.label"
              :label="item.label"
            ></el-option>-->
          </el-select>
          <el-input v-model="formData.amount" disabled style="margin-left:11px;width:160px;"></el-input>
          <!-- <span
            class="f12 gray3"
            style="margin-left:12px;padding-top: 9px;"
          >{{$t(`OPEN_FIXED.RATE`)}}:{{formData.rate+'%P.a.'}}</span> -->
        </el-form-item>
        <el-form-item :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)" prop="date">
          <div style="display:flex">
            <el-radio
              style="padding-top:14px;"
              v-model="formData.fixedFlag"
              v-if="formData.fixedFlag=='Y'"
              label="Y"
              disabled
            >{{$t(`APPOINTMENT_NUMBER.FIXED_TERM`)}}</el-radio>
            <el-select
              disabled
              v-if="formData.fixedFlag=='Y'"
              class="u-sels"
              v-model="formData.fixedDateType"
              style="margin-left:51px;"
            ></el-select>
          </div>
          <div style="display:flex">
            <el-radio
              style="padding-top:14px;"
              v-model="formData.fixedFlag"
              v-if="formData.fixedFlag=='N'"
              label="N"
              disabled
            >{{$t(`APPOINTMENT_NUMBER.MATURITY_DATE`)}}</el-radio>
            <el-form-item class="u-date">
              <el-date-picker
                v-if="formData.fixedFlag=='N'"
                v-model="formData.endDate"
                disabled
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
          v-if="formData.date ==='N'"
          prop="fixedDate"
        >
          <el-select v-model="formData.fixedDate" disabled>
            <el-option
              v-for="item in fixedDate"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
          <!-- <span
            class="f12 gray3"
            style="margin-left:12px;"
          >{{$t("OPEN_FIXED.INSTEREST_RATE")}}:{{formData.interestRate || '--'}}</span> -->
        </el-form-item>
        <el-form-item :label="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)" prop="tips">
          <el-radio
            v-model="formData.maturityInstructions"
            label="3"
            disabled
            style="padding-top: 11px"
          >{{$t(`FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL`)}}</el-radio>
        </el-form-item>
        <el-form-item
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
          prop="appointAccount"
        >
          <el-select v-model="formData.appointAccount">
            <el-option
              v-for="(item,index) in newAppointAccount"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="m-btn">
      <VButton size="w160" style="margin-right:20px" @click="reset">{{$t(`COMMON.RESET`)}}</VButton>
      <VButton size="w160" type="primary" @click="transConfirm">{{$t(`COMMON.NEXT_STEP`)}}</VButton>
    </div>

    <!-- 利率计算器 -->
    <PopUp
      class="u-intestRate"
      ref="intestRate"
      width="1132px"
      @confirm="confirm('intestRate')"
      :options="false"
      :confirmField="confirmField"
      :show-close="true"
      @close="close"
    >
      <div class="logo-wrapper">
        <!-- <img src="@/images/logo/logo.png" alt="演示银行" /> -->
      </div>
      <div class="u-content">
        <tables :tableData="fixedData"></tables>
      </div>
    </PopUp>

    <calactor ref="calactor" />
  </div>
</template>

<script>
import {
  queryAccBalance,
  queryAcctList,
  queryRate,
  queryBookingDetail,
  rateQuery,
  calcRate,
  openVerify
} from '@/api/openFixed.js';
import tool from '@/dataTools/tools/moneyTools.js';
import { queryPayAccountBalance } from '@/api/public.js';
import { safeSetLocalStorage } from '@/utils/index';
import CONSTANTS from '@/utils/contants.js';
import calactor from './calactor.vue';
import tables from './tables.vue';
import mathTools from '@/utils/mathTools.js';
export default {
  components: {
    tables,
    calactor
  },
  props: {
    formData: {
      type: Object,
      default: () => ({
        paymentAccountBalance: '', //可用结余
        maturityInstructions: '3', // d到期指示
        flag: false
      })
    }
  },
  computed: {
    rules() {
      return {
        fixedAccount: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT')
            }),
            trigger: 'blur'
          }
        ],
        paymentAccount: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('OPEN_FIXED.PAYMENT_ACCOUNT')
            }),
            trigger: 'blur'
          }
        ],
        // depositCurrency:[{ required: true, message: '存款额不能为空' }],
        reservationNo: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('APPOINTMENT_NUMBER.APPOINTMENT_NUMBERS')
            }),
            trigger: 'blur'
          }
        ],

        appointAccount: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT')
            }),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  data() {
    return {
      fixedAccount: [],
      paymentAccount: [],
      newAppointAccount: [],
      rate: [],
      fixedDate: [],
      accountNo: [],
      transOutDate: {
        // 时间选择器
        disabledDate(time) {
          let curDate = new Date().getTime();
          let thatDate = time.getTime();
          return (
            curDate + 180 * 24 * 3600 * 1000 < thatDate ||
            thatDate < Date.now() - 8.64e6
          );
        }
      },
      dialogVisible: false,
      flag: false,
      tipsOne: false,
      tipsTwo: false,
      tipsThree: false,
      tipsFour: false,
      effectiveDate: '',
      fixedData: [],
      confirmField: this.$t('COMMON.DETERMINE'),
      acctLoading: false,
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
      payAccountType: ''
    };
  },
  created() {
    this.getFixedList();
    // this.Datalist();
  },
  methods: {
    transConfirm() {
      this.$refs.formData.validate(valid => {
        let value = mathTools.delDecollator(this.formData.amount);
        let currency = Number(this.formData.paymentAccountBalance);
        let account = this.formData.fixedAccount.split('-');
        this.dateList.forEach(item => {
          if (this.formData.fixedDateType == item.label) {
            this.formData.fixedDateType = item.value;
          }
        });
        this.$refs['formData'].validate(valid => {
          if (valid) {
             this.getNewRate();
          }
        });
      });
    },
  async  getNewRate() {
     this.acctLoading = true;
      let fixedTerm = '';
      if (this.formData.fixedFlag == 'Y') {
        fixedTerm = '0';
      } else {
        fixedTerm = '1';
      }
      console.log(this.formData, 'formData');
      let fixedAccount = this.formData.fixedAccount.split('-');
      let paymentAccount = this.formData.paymentAccount.split('-');
      let appointAccount = '';
      if (this.formData.maturityInstructions == '3') {
        appointAccount = this.formData.appointAccount.split('-');
        this.accountTypeList.forEach(item => {
          if (item.label === appointAccount[2]) {
            appointAccount[2] = item.value;
          }
        });
      }
      let paymentAccountBalance = '';
      paymentAccountBalance = mathTools.delDecollator(
        this.formData.paymentAccountBalance
      );

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
        fixedTerm: this.formData.fixedDateType, //固定存期
        depositTermType: fixedTerm, // 存款类型
        appointedDay: this.formData.endDate,
        maturityInstructions: this.formData.maturityInstructions,
        nextTransferDate: this.formData.nextTransferDate, //下次转存期
        appointAccount: appointAccount[0],
        appointAccountCur: appointAccount[1],
        appointAccountType: appointAccount[2], //指定账户类型
        paymentAccountBalance: paymentAccountBalance,
        preAvailableInterest: this.formData.preAvailableInterest, //可得利息
        preAvailablePrincipalInterest: this.formData
          .preAvailablePrincipalInterest, //可得本息
        rate: this.formData.rate,
        reservationNumber: this.formData.reservationNo,
      };
      const res  =await  openVerify(params);
      if(res){
        this.formData.fixedTermRate = res.rate;
        this.formData.preAvailableInterest = res.preAvailableInterest;
        this.formData.preAvailablePrincipalInterest =
          res.preAvailablePrincipalInterest;
        this.formData.fixedTerm = res.fixedTerm;
        this.$refs['formData'].validate(valid => {
          if (valid) {
             this.acctLoading=false
            this.$emit('next', this.formData);
          }
          this.acctLoading = false;
        });
      }else{
        this.acctLoading=false
      }
    },
    reset() {
      this.$set(this.formData, 'fixedAccount', '');
      this.$set(this.formData, 'paymentAccount', '');
      this.$set(this.formData, 'paymentAccountBalance', '');
      this.$set(this.formData, 'reservationNo', '');
      this.$set(this.formData, 'flag', false);
      // this.$ref['formData'].resetFields();
    },
    getFixedList() {
      queryAcctList().then(res => {
        console.log(res, 'res111');

        let accountInfoList = [];
        let payerAccoInfoList = [];
        res.accountInfoList.forEach((item, index) => {
          let obj = {};
          // CONSTANTS.ACCOUNT_TYPE_LIST.forEach(type => {
          this.accountTypeList.forEach(type => {
            if (type.value == item.acctTypeConvertor) {
              item.acctTypeConvertors = type.label;
            }
          });
          CONSTANTS.ACCOUNT_TYPE_ARRAY.forEach(type => {
            obj = {
              label:
                item.accountNo +
                '-' +
                this.ccyFilter(type) +
                '-' +
                item.acctTypeConvertors,
              value: item.accountNo + '-' + type + '-' + item.acctTypeConvertor
            };
            return accountInfoList.push(obj);
          });
        });

        this.fixedAccount = accountInfoList;
      });
    },
    changeBlur(value) {
      console.log(value, 'val');
      let params = {
        reservationNo: value
      };
      if (value) {
        queryBookingDetail(params).then(res => {
          console.log(res, 'res222');
          let fixedFlag = res.fixedFlag;
          this.dateList.forEach(item => {
            if (res.fixedDateType == item.value) {
              res.fixedDateType = item.label;
            }
          });
          switch (res.reservationResult) {
            case '0':
              // this.formData.flag = true;
              this.$set(this.formData, 'flag', true);
              this.$set(this.formData, 'maturityInstructions', '3');
              this.formData.contactType = res.contactType;
              this.formData.rate = res.rate;
              this.formData.fixedFlag = res.fixedFlag;
              this.formData.amount = res.amount;
              this.formData.fixedDateType = res.fixedDateType;
              this.formData.endDate = res.endDate;
              this.$set(this, 'effectiveDate', res.endTime);
              this.tipsOne = false;
              this.tipsTwo = false;
              this.tipsThree = false;
              this.tipsFour = false;
              // this.fromData.rate = res.rate;
              break;
            case '1':
              this.$set(this.formData, 'flag', false);

              this.tipsOne = true;
              this.tipsTwo = false;
              this.tipsThree = false;
              this.tipsFour = false;
              break;
            case '2':
              this.$set(this.formData, 'flag', false);
              this.tipsOne = false;
              this.tipsTwo = true;
              this.tipsThree = false;
              this.tipsFour = false;
              break;
            case '3':
              this.$set(this.formData, 'flag', false);
              this.tipsOne = false;
              this.tipsTwo = false;
              this.tipsThree = true;
              this.tipsFour = false;
              break;
            case '4':
              this.$set(this.formData, 'flag', false);
              this.tipsOne = false;
              this.tipsTwo = false;
              this.tipsThree = false;
              this.tipsFour = true;
          }
        });
      }
    },
    changePayment(val) {
      this.acctLoading = true;
      let acctNo = val.split('-')[0];
      let currencyType = val.split('-')[1];
      let params = {
        accountNo: acctNo,
        currencyType: currencyType
      };
      this.payAccountType = val.split('-')[2];
      queryPayAccountBalance(params)
        .then(res => {
          this.formData.paymentAccountBalance = tool.currencyFormat(
            res.avaliableBalance,
            '',
            2
          );
          this.acctLoading = false;
        })
        .catch(err => {
          this.acctLoading = false;
        });
    },
    showDialog(refName) {
      this.$refs[refName].showDialog();
    },
    changeFocus() {
      this.tipsOne = false;
      this.tipsTwo = false;
      this.tipsThree = false;
    },
    changeOpenFixed(value) {
      let str = value.split('-');
      let params = {
        currencyType: str[1]
      };
      queryAcctList(params).then(res => {
        let payerAccoInfoList = [];
        res.payerAccoInfoList.forEach((item, index) => {
          let obj = {};
          this.accountTypeList.forEach(type => {
            if (type.value == item.acctTypeConvertor) {
              item.acctTypeConvertors = type.label;
              obj = {
                label:
                  item.accountNo +
                  '-' +
                  this.ccyFilter(item.currencyType) +
                  '-' +
                  item.acctTypeConvertors,
                value:
                  item.accountNo +
                  '-' +
                  item.currencyType +
                  '-' +
                  item.acctTypeConvertor
              };
            }
          });
          return payerAccoInfoList.push(obj);
        });
        this.paymentAccount = payerAccoInfoList;
        this.newAppointAccount = payerAccoInfoList;
      });
    },
    close(refName) {},
    confirm(refName) {
      this.$refs[refName].closeHandle();
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
</script>

<style lang="scss" scoped>
.m-form {
  margin-top: 22px;
  margin-left: 4%;
  ::v-deep .el-input--suffix {
    width: 320px !important;
  }
}
.u-sel {
  // display: flex;
  ::v-deep .el-form-item__content {
    display: flex !important;
  }
  ::v-deep .el-input--suffix {
    width: 152px !important;
  }
  ::v-deep .el-input__inner {
    width: 158px;
  }
}

::v-deep .el-input__inner {
  width: 320px;
}
.u-span {
  margin-left: 12px;
  color: #f06b00;
  cursor: pointer;
}
.m-btn {
  display: flex;
  margin-left: 32%;
  margin-top: 36px;
}
.u-code {
  ::v-deep .el-input__inner {
    width: 320px;
  }
}
.u-sels {
  ::v-deep .el-input--suffix {
    width: 160px !important;
  }
  ::v-deep .el-input__inner {
    width: 160px;
  }
}
.u-errorTips {
  margin-left: 36%;
  color: #f23f47;
  font-size: 14px;
}
.u-date {
  ::v-deep .el-input--suffix {
    width: 205px !important ;
  }
  ::v-deep .el-input__inner {
    width: 205px;
  }
}
</style>