<!-- 开立普通定期————信息填写 -->
<template>
  <div class="u-form" v-loading="acctLoading">
    <el-form ref="formData" :rules="rules" :model="formData" class="m-form">
      <el-form-item
        label-width="330px"
        :label="$t(`FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT`)"
        prop="fixedAccount"
      >
        <el-select v-model="formData.fixedAccount" @change="changeOpenFixed">
          <el-option
            v-for="(item,index) in option"
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
      <el-form-item
        label-width="330px"
        :label="$t(`OPEN_FIXED.PAYMENT_ACCOUNT`)"
        prop="paymentAccount"
      >
        <el-select v-model="formData.paymentAccount" @change="changeAccount">
          <el-option
            v-for="(item,index) in accountNo"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <span
          class="f12 gray3"
          style="margin-left:12px;"
          v-if="formData.paymentAccount"
        >{{$t(`OPEN_FIXED.AVAILABLE_BALANCE`)}}{{formData.paymentAccountBalance}}</span>
      </el-form-item>
      <el-tag
        v-if="payAccountType==='CURRENT'"
        style="margin-left: 32%;margin-bottom: 20px;"
        type="warning"
      >
        <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
      </el-tag>

      <el-row class="u-rowStyle">
        <el-form-item
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
          class="u-sel"
          prop="depositCurrency"
          label-width="330px"
        >
          <el-select v-model="formData.depositCurrency" :disabled="true" @change="changeRate">
            <el-option
              class="u-input1"
              v-for="item in rate"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="depositAmounts">
          <el-input
            class="u-input3"
            v-model="depositAmounts"
            :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{input:''})"
            style="margin-left:11px;"
            @blur="onMoneyInput"
            @focus="changeMoney"
          ></el-input>
        </el-form-item>
      </el-row>

      <el-form-item
        label-width="330px"
        :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        prop="depositTermType"
      >
        <el-radio-group
          v-model="formData.depositTermType"
          class="u-rateDate"
          @change="changeRateDate(formData.depositTermType)"
        >
          <div>
            <el-radio
              prop="depositTermType"
              label="0"
              style="margin-top:12px;margin-bottom:26px;"
            >{{$t('OPEN_FIXED.SELECT_FIXED_TERM')}}</el-radio>
            <el-select
              v-model="formData.fixedTerm"
              :disabled="disabled"
              @change="changeFixedTerm"
              style="margin-left:14px;"
            >
              <el-option
                v-for="item in rateDate"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <span
              class="f12 gray3"
              v-if="formData.fixedTermRate"
              style="margin-left:12px;"
            >{{$t('OPEN_FIXED.RATE')}}:{{formData.fixedTermRate+'%p.a.'}}</span> -->
          </div>
          <div>
            <el-radio prop="depositTermType" label="1">{{$t('OPEN_FIXED.SELECT_MATURITY_DATE')}}</el-radio>
            <el-date-picker
              style="margin-left:28px;"
              v-model="formData.appointedDay"
              type="date"
              @change="changAppointedDay"
              value-format="yyyy-MM-dd"
              :picker-options="transOutDate"
              :disabled="disable"
            ></el-date-picker>
            <!-- <span
              class="f12 gray3"
              v-if="formData.depositTermType==='1'"
              style="margin-left:12px;"
            >{{$t('OPEN_FIXED.RATE')}}:{{formData.fixedTermRate+'%p.a.'}}</span> -->
            <!-- <span>{{formData.fixedTermRate}}</span> -->
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION')"
        prop="maturityInstructions"
        label-width="330px"
      >
        <el-radio
          :disabled="!disable"
          v-model="formData.maturityInstructions"
          @change="matChange('1')"
          label="1"
          style="padding-top:13px"
        >{{$t('FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL')}}</el-radio>
        <el-radio
          :disabled="!disable"
          v-model="formData.maturityInstructions"
          @change="matChange('2')"
          label="2"
          style="padding-top:13px"
        >{{$t('FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS')}}</el-radio>
        <el-radio
          v-model="formData.maturityInstructions"
          @change="matChange('3')"
          label="3"
          style="padding-top:13px"
        >{{$t('FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL')}}</el-radio>
      </el-form-item>
      <el-form-item
        :label="$t('FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR')"
        v-if="formData.maturityInstructions ==='1'||formData.maturityInstructions==='2'"
        prop="nextTransferDate"
        label-width="330px"
      >
        <el-select v-model="formData.nextTransferDate">
          <el-option
            v-for="(item,index) in fixedDate"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="this.$t('FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT')"
        v-if="formData.maturityInstructions === '3'||formData.maturityInstructions==='2'"
        prop="appointAccount"
        label-width="330px"
      >
        <el-select v-model="formData.appointAccount">
          <el-option
            v-for="(item,index) in accountNo"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="m-btn">
      <VButton size="w160" style="margin-right:20px" @click="reset">{{$t('COMMON.RESET')}}</VButton>
      <VButton size="w160" type="primary" @click="transConfirm">{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <ul class="u-content">
        <li>{{$t(`OPEN_FIXED.UPLIFTING_FEES`)}}</li>
        <li>{{$t(`OPEN_FIXED.SERVICE_HOURS`)}}</li>
        <li>{{$t(`OPEN_FIXED.NO_INTEREST`)}}</li>
        <!-- <li>{{$t(`OPEN_FIXED.DEPOSITS`)}}</li> -->
        <!-- <li>4.未到期前提取定期存款将不获支付利息并须交付到期前提款费用</li>
        <li>5.外币投资受汇率波动而产生</li>-->
      </ul>
    </div>
    <!--利率查询弹窗  -->
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
    <!-- 计算器弹窗 -->
    <clactor ref="calactor" />
  </div>
</template>

<script>
import {
  queryAccBalance,
  queryAcctList,
  queryRate,
  rateQuery,
  queryAccountStatus,
  interestRateQuery,
  judgeHoliday,
  openVerify
} from '@/api/openFixed.js';
import { queryPayAccountBalance } from '@/api/public.js';
import CONSTANTS from '@/utils/contants.js';
import clactor from './dialog/calactor.vue';
import tables from './dialog/tables.vue';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
import { formatMoneyNew } from '@/utils/tools.js';
import _ from 'lodash';
import { formatAcctNo } from '../utils/tools.js';
import filters from '@/filters/public.js';

// import { otpDialog } from '@/components/messageBox';
export default {
  components: {
    clactor,
    tables
  },
  props: {
    formData: {
      type: Object,
      default: () => ({
        fixedAccount: '', //定期存款账户
        paymentAccount: '', //付款账户
        paymentAccountBalance: '', //可用结余
        depositAmount: '', // 存款额
        nextTransferDate: '', // 存款期
        fixedTerm: '', // 固定存期
        appointedDay: '', // 指定日期
        maturityInstructions: '', // d到期指示
        depositTermType: 0, // 存款期
        // nextTransferDate:"", // 下次轉存期
        appointAccount: '', //指定賬戶
        fixedTermRate: '',
        appointedDayRate: '', // 预计可得利息
        preAvailablePrincipalInterest: '' // 预计可得本息
      })
    }
  },
  watch: {
    cur(newValue, oldValue) {
      console.log(oldValue, 'o');
      console.log(newValue, 'n');
      if (newValue == 'HKD' || newValue == 'CNY') {
        this.rateDate = this.dateList;
        this.fixedDate = this.dateList;
      } else {
        this.rateDate = this.dateList.slice(0, -1);
        this.fixedDate = this.dateist.slice(0, -1);
        console.log(this.rateDate, 'this.rateDate');
      }
    },
    depositAmounts: function(newvalue, oldValue) {
      if (newvalue) {
        // this.$set(this.formData, 'paymentAccount', '');
        // this.$set(this.formData, 'paymentAccount', '');
        this.$set(this.formData, 'fixedTerm', '');
        this.$set(this.formData, 'appointedDay', '');
        this.$set(this.formData, 'depositTermType', '');
        this.$set(this.formData, 'fixedTermRate', '');
        this.disabled = true;
        // this.formData.maturityInstructions = ''
        // this.formData.nextTransferDate = ''
        // this.formData.appointAccount = ''
        // this.$set(this.formData, 'paymentAccountBalance', '');
      }
    }
  },
  filters: {
    ccyFilter: filters.ccyFilter,
    filtersType: filters.filtersType,
    accountType: filters.accountType
  },
  data() {
    return {
      cur: '', // 币种
      fixedTermRateMoney: '',

      option: [], // 定期存款账户下拉框
      rate: [], //存款金额-币种下拉框
      fixedDate: [], // 下次转存期下拉框
      accountNo: [], //指定账户下拉框
      transOutDate: {
        // 时间选择器
        disabledDate(time) {
          let curDate = new Date().getTime();
          let thatDate = time.getTime();
          return (
            // curDate + 180 * 24 * 3600 * 1000 < thatDate ||
            curDate + 730 * 24 * 3600 * 1000 < thatDate ||
            thatDate < Date.now() - 8.64e6 + 5 * 24 * 3600 * 1000
          );
        }
      }, //指定日期选择期
      rateDate: [], //固定日期选择下拉框
      disabled: true,
      disable: true,
      discount: '',
      depositAmounts: '',
      paymentAccountBalance: '', //账户余额
      fixedTermRate: '',
      appointedDayRate: '',
      fixedData: [], //利率查询表格
      confirmField: this.$t('COMMON.DETERMINE'), // 弹出按钮
      acctLoading: false, //加载
      dialogVisible: false, //弹窗显示
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
      payAccountType: '',
      openfixed: false
      // nextDisable:true
    };
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
        depositTermType: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR')
            }),
            trigger: 'blur'
          }
        ],
        maturityInstructions: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION')
            }),
            trigger: 'blur'
          }
        ],
        appointedDay: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR')
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
        ],
        nextTransferDate: [
          {
            required: true,
            message: this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR')
            }),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  created() {
    console.log(this.formData, 'formData');
    // 固定存期下拉框
    this.rateDate = this.dateList;
    // 下次转存下拉框
    this.fixedDate = this.dateList;
    // 币种下拉框
    this.rate = CONSTANTS.CONTACT_TYPE_LIST;
  },
  mounted() {
    this.getAccount();
    // this.Datalist();
    // this.getRatQuery()
  },
  methods: {
    // 下一步
    transConfirm() {
      console.log('this.formData', this.formData);
      if (!this.formData.fixedTerm && !this.formData.appointedDay) {
        return this.$message({
          title: '',
          message: this.$t('OPEN_FIXED.FIXED_DEPOSIT_PERIOD'),
          type: 'warn',
          delay: 3000,
          clickModal: false
        });
      }
      this.formData.paymentAccountBalance = mathTools.delDecollator(
        this.formData.paymentAccountBalance
      );
      let currency = Number(this.formData.paymentAccountBalance);
      this.$refs.formData.validate(valid => {
        let value = mathTools.delDecollator(this.depositAmounts);
        if (this.depositAmounts) {
          if (valid && !this.acctLoading) {
            if (value > currency) {
              this.$message({
                title: '',
                message: this.$t('OPEN_FIXED.CANNOT_EXCEED'),
                type: 'warn',
                delay: 3000,
                clickModal: false
              });
            } else {
              this.getNewRate();
            }
          }
        } else {
          this.$message({
            title: '',
            message:this.$t('OPEN_FIXED.TO_REQUIRED', {
              input: this.$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT')
            }),
            type: 'warn',
            delay: 3000,
            clickModal: false
          });
        }
      });
    },
    async getNewRate() {
      this.acctLoading = true;
      let fixedAccount = this.formData.fixedAccount.split('-');
      let paymentAccount = this.formData.paymentAccount.split('-');
      let appointAccount = [];
      if (
        this.formData.maturityInstructions == '2' ||
        this.formData.maturityInstructions == '3'
      ) {
        appointAccount = this.formData.appointAccount.split('-');
        this.accountTypeList.forEach(item => {
          // CONSTANTS.ACCOUNT_TYPE_LIST.forEach(item => {
          if (item.label === appointAccount[2]) {
            appointAccount[2] = item.value;
          }
        });
      }
      let params = {
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
        maturityInstructions: this.formData.maturityInstructions, //到期指示
        nextTransferDate: this.formData.nextTransferDate || '', //下次转存期
        paymentAccountBalance: this.formData.paymentAccountBalance, //可用结余a
        // preAvailableInterest: this.formData.preAvailableInterest || '', //可得利息
        // preAvailablePrincipalInterest:
        //   this.formData.preAvailablePrincipalInterest || '', //可得本息
        // rate: this.formData.fixedTermRate, //利率
        appointAccount: appointAccount[0] || '', //指定账户
        appointAccountCur: appointAccount[1] || '', //指定账户币种
        appointAccountType: appointAccount[2] || '' //指定账户类型
      };
      const res = await openVerify(params);
      if (res) {
        console.log(res.body, 'res.body');
        this.formData.fixedTermRate = res.rate;
        this.formData.preAvailableInterest = res.preAvailableInterest;
        this.formData.preAvailablePrincipalInterest =
          res.preAvailablePrincipalInterest;
        this.formData.fixedTerm = res.fixedTerm;
        this.acctLoading = false;
        this.$emit('next', this.formData);
      } else {
        this.acctLoading = false;
      }
      //  .then(res=>{
      //     console.log(res,'res')
      //   })
    },
    //存款期
    changeRateDate(value) {
      console.log(value, 'value');
      if (value === '0') {
        this.$set(this.formData, 'appointedDay', '');
        this.$set(this.formData, 'appointedDayRate', '');

        this.disabled = false;
        this.disable = true;
      } else if (value === '1') {
        this.$set(this.formData, 'fixedTerm', '');
        this.$set(this.formData, 'fixedTermRate', '');

        this.disable = false;
        this.disabled = true;

        this.$set(this.formData, 'maturityInstructions', '3');
      }
    },
    // 弹窗显示
    showDialog(refName) {
      this.$refs[refName].showDialog();
    },
    close(refName) {},
    // 重置
    reset() {
      this.$set(this.formData, 'fixedAccount', '');
      this.$set(this.formData, 'paymentAccount', '');
      this.$set(this.formData, 'maturityInstructions', '');
      this.$set(this.formData, 'nextTransferDate', '');
      this.$set(this.formData, 'appointAccount', '');
      this.$set(this.formData, 'paymentAccountBalance', '');
      this.$set(this.formData, 'depositAmount', '');
      this.$set(this.formData, 'depositCurrency', '');
      this.$set(this.formData, 'fixedTerm', '');
      this.$set(this.formData, 'appointedDay', '');
      this.$set(this.formData, 'depositTermType', '');
      this.$set(this.formData, 'fixedTermRate', '');
      this.disabled = true;
      // this.$ref['formData'].resetFields();
    },
    // 付款账户余额查询
    changeAccount(value) {
      this.acctLoading = true;
      let acctNo = value.split('-')[0];
      let currencyType = value.split('-')[1];
      let param = {
        accNo: acctNo
      };
      let params = {};
      this.payAccountType = value.split('-')[2];
      console.log(this.payAccountType, 'this.payAccountType');
      queryAccountStatus(param)
        .then(res => {
          switch (res.status) {
            case 'ACTIVE':
            case 'NOMAL':
              params = {
                accountNo: acctNo,
                currencyType: currencyType
              };
              queryPayAccountBalance(params).then(res => {
                this.formData.paymentAccountBalance = tool.currencyFormat(
                  res.avaliableBalance,
                  '',
                  2
                );
                this.acctLoading = false;
              });
              break;
            case 'DORMANT':
              this.$message({
                title: '',
                // TODO 三语言
                message: `${this.$t('OPEN_FIXED.ACCOUNT_STATUS', {
                  status: this.$t('ACCOUNT_MAINTENACE.DORMANT')
                })}`,
                type: 'warn',
                delay: 3000,
                clickModal: false
              });
              this.$set(this.formData, 'paymentAccount', '');
              this.acctLoading = false;
              break;
            case 'FROZEN':
              this.$message({
                title: '',
                message: `${this.$t('OPEN_FIXED.ACCOUNT_STATUS', {
                  status: this.$t('ACCOUNT_MAINTENACE.FROZEN')
                })}`,
                type: 'warn',
                delay: 3000,
                clickModal: false
              });
              this.$set(this.formData, 'paymentAccount', '');
              this.acctLoading = false;
              break;
            case 'CLOSE':
              this.$message({
                title: '',
                message: `${this.$t('OPEN_FIXED.ACCOUNT_STATUS', {
                  status: this.$t('ACCOUNT_MAINTENACE.STATUS_CLOSE')
                })}`,
                type: 'warn',
                delay: 3000,
                clickModal: false
              });
              this.$set(this.formData, 'paymentAccount', '');
              this.acctLoading = false;
              break;
            case 'OVERDUE':
              this.$message({
                title: '',
                message: `${this.$t('OPEN_FIXED.ACCOUNT_STATUS', {
                  status: this.$t('OPEN_FIXED.BE_OVERDUE')
                })}`,
                type: 'warn',
                delay: 3000,
                clickModal: false
              });
              this.$set(this.formData, 'paymentAccount', '');
              this.acctLoading = false;
              break;
          }
        })
        .catch(err => {
          this.$set(this.formData, 'paymentAccount', '');
          this.acctLoading = false;
        });
      // let params = {
      //   accountNo: acctNo,
      //   currencyType: currencyType
      // };
    },
    // 定期存款下拉框+付款账户下拉框+指定账户下拉框
    getAccount() {
      queryAcctList().then(res => {
        console.log('打印付款账户：', res);
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

        this.option = accountInfoList;
        this.acctLoading = false;
      });
    },
    // 存款额币种
    changeOpenFixed(value) {
      console.log(value, 'value');
      let str = value.split('-');
      console.log(str, 'str');
      let params = {
        currencyType: str[1]
      };
      queryAcctList(params).then(res => {
        let payerAccoInfoList = [];
        res.payerAccoInfoList.forEach((item, index) => {
          let obj = {};
          this.accountTypeList.forEach(type => {
            // CONSTANTS.ACCOUNT_TYPE_LIST.forEach(type => {
            if (type.value == item.acctTypeConvertor) {
              item.acctTypeConvertors = type.label;
              obj = {
                label:
                  formatAcctNo(item.accountNo) +
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
        this.accountNo = _.uniqBy(payerAccoInfoList, 'label');
      });
      this.formData.depositCurrency = str[1];
      this.cur = this.formData.depositCurrency;
      this.$set(this.formData, 'paymentAccount', '');
      this.$set(this.formData, 'paymentAccount', '');
      // this.$set(this.formData, 'fixedTerm', '');
      this.$set(this.formData, 'appointedDay', '');
      this.$set(this.formData, 'depositTermType', '');
      this.$set(this.formData, 'fixedTermRate', '');
      this.$set(this.formData, 'paymentAccountBalance', '');
      this.disabled = true;
    },
    getRatQuery(value) {
      // console.log(value, 'value');
      if (value == 'HKD' || value == 'CNY') {
        this.fixedDate = this.dateList;
      } else {
        this.fixedDate = this.dateList.pop();
      }
      // interestRateQuery().then(res=>{
      //   console.log(res,'产品')
      // })
    },
    changeRate(value) {},
    // 按固定存期选择
    changeFixedTerm(value) {
    
      if (this.depositAmounts == '') {
        this.$message({
          title: '',
          message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: this.$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT')
          }),
          type: 'warn',
          delay: 3000,
          clickModal: false
        });

      } 
    },

    async changAppointedDay(value) {
      this.acctLoading = true;
      let params = {
        holidayDay: this.formData.appointedDay
      };
      if (this.depositAmounts == '') {
        this.$message({
          title: '',
          message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: this.$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT')
          }),
          type: 'warn',
          delay: 3000,
          clickModal: false
        });
        this.acctLoading = false;
      } else {
        const result = await judgeHoliday(params);
        console.log(result, 'result');
        if (result) {
          this.$message({
            title: '',
            message: this.$t('OPEN_FIXED.PLEASE_CHOOSE_WORKDAY'),
            type: 'warn',
            delay: 3000,
            clickModal: false
          });
          this.$set(this.formData,'appointedDay','')
          this.acctLoading = false;
        
        }else{
          this.acctLoading = false;
        }

      }
    },
    async getRate(params) {
      console.log(this.formData.appointedDay, 'appointedDay');
      this.formData.depositTermType = '2';
      this.$set(this.formData, 'depositTermType', '1');
      const result = await queryRate(params);
      if (result) {
        this.formData.fixedTermRate = result.rate;
        this.formData.preAvailableInterest = formatMoneyNew(
          result.preAvailableInterest
        );
        this.formData.preAvailablePrincipalInterest = formatMoneyNew(
          result.preAvailablePrincipalInterest
        );
        this.acctLoading = false;
      } else {
        this.acctLoading = false;
      }
    },
    confirm(refName) {
      this.$refs[refName].closeHandle();
    },
    onMoneyInput(value) {
      let currency = Number(this.formData.paymentAccountBalance);
      this.formData.depositAmount = mathTools.delDecollator(
        this.depositAmounts
      );
      let values = Number(this.depositAmounts);
      switch (this.formData.depositCurrency) {
        case 'AUD':
          if (values < 1000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 1000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }
          return;
        case 'CAD':
          if (values < 1000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 1000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'CHF':
          if (values < 1000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 1000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'EUR':
          if (values < 1000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 1000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'GBP':
          if (values < 1000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 1000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'HKD':
          if (values < 5000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 5000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'JPY':
          if (values < 100000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 10000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'NZD':
          if (values < 1000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 1000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'CNY':
          console.log(values, 'valse');
          if (values < 5000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 5000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
        case 'USD':
          if (values < 1000) {
            this.$message({
              title: '',
              message: this.$t('OPEN_FIXED.LESS_THAN', {
                ammount: 1000
              }),
              type: 'warn',
              delay: 3000,
              clickModal: false
            });
            this.depositAmounts = '';
            this.$set(this.formData, 'depositAmount', '');
          } else {
            this.forMatterMoney(values);
          }

          return;
      }

      console.log('this.formData.depositAmount', this.depositAmounts);
    },
    changeMoney(value) {
      this.depositAmounts = mathTools.delDecollator(this.depositAmounts);
    },
    forMatterMoney(val) {
      console.log(val, 'valssssssssss');
      let currency = Number(this.formData.paymentAccountBalance);
      if (Number(val) > Number(currency)) {
        this.$message({
          title: '',
          message: this.$t('OPEN_FIXED.INSUFFICIENT_BALANCE'),
          type: 'fail',
          delay: 3000,
          clickModal: false
        });
        this.depositAmounts = '';
        this.$set(this.formData, 'depositAmount', '');
      } else {
        this.depositAmounts = formatMoneyNew(val);
      }
    },
    matChange(e) {
      this.formData.maturityInstructions = e;
      // console.log('e', this.formData.maturityInstructions, e);
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
    accountFilters(val) {
      return filters.accountType(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-form {
  margin-top: 22px;
  margin-left: 4%;
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
::v-deep .el-input--suffix {
  width: 320px !important;
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
  margin-left: 34%;
}
.u-rateDate {
  display: flex;
  flex-direction: column;
  ::v-deep .el-input__inner {
    width: 160px;
  }
  ::v-deep .el-input--suffix {
    width: 160px !important;
  }
}
.u-intestRate {
  // height: 1790px;
  margin-top: 10vh;
  .u-content {
    height: 550px;
  }
}
.u-tips {
  margin-top: 56px;
  margin-left: 24px;
  // position: absolute;
  // bottom: 0px;
  .u-title {
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 400;
  }
  .u-content {
    margin-top: 12px;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.45);
    font-weight: 400;
    line-height: 28px;
  }
}
::v-deep .u-rowStyle {
  display: flex;
  .u-input1 {
    width: 80px !important;
  }
  ::v-deep .el-input__inner {
    width: 158px;
  }
}
.u-input3 {
  display: inline-table;
  ::v-deep .el-input__inner {
    width: 155px !important;
  }
}
</style>