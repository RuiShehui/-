<!--
 * @Author: your name
 * @Date: 2021-12-03 14:31:37
 * @LastEditTime: 2022-09-29 17:18:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\internationalBusiness\remittanceConfirm\components\exchange.vue
-->
<template>
  <div class="g-exchange-wrapper" v-loading="isInit">
    <div class="m-sale">{{ $t('FOREXLISTPRICE.CUSTOMER_SELLSONE') }}</div>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-row>
        <el-col>
          <el-form-item
            label-width="398px"
            :label="$t('REMITTANCECONFIRM.CURRENCY') + '：'"
            prop="saleCurrency"
          >
            <el-select v-model="form.saleCurrency" @change="saleCurrency">
              <el-option
                v-for="item in saleCurrencyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :placeholder="$t('COMMON.PLEASE_SELECT')"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label-width="398px"
            :class="form.saleAccount ? 'u-noMargin' : ''"
            :label="$t('REMITTANCECONFIRM.ACCOUNT') + '：'"
            prop="saleAccount"
          >
            <el-select
              v-model="form.saleAccount"
              @change="saleAccount"
              :placeholder="$t('ACCOUNT_MANAGEMENT.PLEASE_SELECT')"
            >
              <el-option
                v-for="item in saleAccountList"
                :key="item.value"
                :label="
                  `${formatAccountNo(item.accountNo)}-${curfilters(item.currencyType)}-${item.accountType}`
                "
                :value="item.value"
                :placeholder="$t('ACCOUNT_MANAGEMENT.PLEASE_SELECT') + '：'"
              ></el-option>
            </el-select>
            <span
              v-if="form.saleAccount || form.saleAccount == '0'"
              class="u-balance"
            >{{$t('REMITTANCECONFIRM.AVAILABLE_BALANCE')}}:</span>
            <span
              v-if="form.saleAccount || form.saleAccount == '0'"
              class="u-balanceone"
            >{{form.balanceqian}}</span>
            <div
              class="mb16"
              v-if="form.saleAccount || form.saleAccount == '0'"
              style="margin-bottom: 16px;"
            >
              {{$t('REMITTANCECONFIRM.ACCOUNT_NAME') + '：'}}
              <span class="mb17">{{form.company}}</span>
              <div>
                <el-tag
                  v-if="form.saleaccountType === $t('ACCOUNT_MANAGEMENT.CURRENT')"
                  type="warning"
                >
                  <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
                </el-tag>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            class="u-noMargin"
            label-width="398px"
            :label="$t('REMITTANCECONFIRM.AMOUNT') + '：'"
            prop="saleMoney"
          >
            <money-input
              :isSaveDot="this.form.saleCurrency !== 'JPY'"
              :maxlength="17"
              v-model="form.saleMoneyone"
              @change="saleMoney()"
              :placeholder="$t('REMITTANCECONFIRM.PLEASE_ENTER_THE_AMOUNT')"
            ></money-input>
            <div
              class="mb16"
              v-if="form.saleMoney&&statustwo"
            >{{ $t('REMITTANCECONFIRM.YOU_HAVE_SELECTED_TO_FIX_THIS_AMOUNT') }}</div>
            <div class="mb16" v-if="form.saleMoney&&statusone">{{ $t('REMITTANCECONFIRM.CHANGED') }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="m-buy">{{ $t('FOREXLISTPRICE.CUSTOMER_BUYSONE') }}</div>
      <el-row>
        <el-col>
          <el-form-item
            label-width="398px"
            :label="$t('REMITTANCECONFIRM.CURRENCY') + '：'"
            prop="buyCurrency"
          >
            <el-select v-model="form.buyCurrency" @change="buyCurrency()">
              <el-option
                v-for="item in buyCurrencyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :placeholder="$t('COMMON.PLEASE_SELECT')"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label-width="398px"
            :label="$t('REMITTANCECONFIRM.ACCOUNT') + '：'"
            prop="buyAccount"
          >
            <el-select v-model="form.buyAccount" @change="buyAccount()">
              <el-option
                v-for="item in buyAccountList"
                :key="item.value"
                :label="
                  `${formatAccountNo(item.accountNo)}-${curfilters(item.currencyType)}-${item.accountType}`
                "
                :value="item.value"
                :placeholder="$t('COMMON.PLEASE_SELECT')"
              ></el-option>
            </el-select>
            <span
              v-if="form.buyAccount || form.buyAccount == '0'"
              class="u-balance"
            >{{$t('REMITTANCECONFIRM.AVAILABLE_BALANCE')}}:</span>
            <span
              v-if="form.buyAccount || form.buyAccount == '0'"
              class="u-balanceone"
            >{{form.balanceoneqian}}</span>
            <div class="mb16" v-if="form.buyAccount || form.buyAccount == '0'">
              {{$t('REMITTANCECONFIRM.ACCOUNT_NAME') + '：'}}
              <span class="mb17">{{form.companyone}}</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label-width="398px"
            :label="$t('REMITTANCECONFIRM.AMOUNT') + '：'"
            prop="buyMoney"
            class="u-noMargin"
          >
            <money-input
              :isSaveDot="this.form.buyCurrency !== 'JPY'"
              :maxlength="17"
              v-model="form.buyMoneyone"
              :placeholder="$t('REMITTANCECONFIRM.PLEASE_ENTER_THE_AMOUNT')"
              @change="buyMoney()"
            ></money-input>
            <span
              class="f-query"
              @click="goForexListPrice"
            >{{$t('REMITTANCECONFIRM.FOREGIN_CURRENCY_QUOTATION_INQUIRY')}}</span>
            <div
              class="tips mb16"
              v-show="form.buyMoney&&statustwo"
            >{{ $t('REMITTANCECONFIRM.CHANGED') }}</div>
            <div
              class="tips mb16"
              v-show="form.buyMoney&&!statustwo"
            >{{ $t('REMITTANCECONFIRM.YOU_HAVE_SELECTED_TO_FIX_THIS_AMOUNT') }}</div>
          </el-form-item>
        </el-col>

        <el-col>
          <div class="m-rate-wrapper" v-show="form.saleCurrency && form.buyCurrency">
            <div class="m-rate-wrapper-top">
              <div style="fontWeight: 500;">{{ $t('REMITTANCECONFIRM.CURRENCY_EXCHANGE') }}</div>
              <div
                style="color: rgba(0,0,0,.25);fontSize: 12px;"
              >{{ $t('REMITTANCECONFIRM.FOR_REFERENCE_ONLY') }}</div>
            </div>
            <div class="m-rate-wrapper-bottom">
              <div>
                <p>{{ saleC }}</p>
                <p>{{ form.sale }}</p>
              </div>
              <img src="@/images/internationalBusiness/duihuan@2x.png" alt />
              <div class="ml32">
                <p>{{ buyC }}</p>
                <p>{{ form.buy }}</p>
              </div>
            </div>
          </div>
        </el-col>
        <el-col>
          <div class="g-btns">
            <v-button size="w160" class="f-reset" @click="reset">
              {{
              $t('REMITTANCECONFIRM.RESET')
              }}
            </v-button>
            <v-button size="w160" type="primary" @click="handleNext('form')">
              {{
              $t('COMMON.NEXT_STEP')
              }}
            </v-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="m-tips-wrapper">
      <p class="tips head">{{ $t('REMITTANCECONFIRM.SERVICE_HOURS') }}</p>
      <div class="u-tips-content">
        <p v-for="(item, index) in $t('REMITTANCECONFIRM.TIME_TIPS')" :key="index">{{ item }}</p>
      </div>
      <p class="tips head">{{ $t('REMITTANCECONFIRM.RISK_DISCLOSURE') }}</p>
      <div class="u-tips-content">
        <!-- <p>{{ $t('REMITTANCECONFIRM.RISK_TIPS') }}</p> -->
      </div>
      <p class="tips head">{{ $t('REMITTANCECONFIRM.NOTE') }}</p>
      <div class="u-tips-content">
        <p v-for="(item, index) in $t('REMITTANCECONFIRM.TIPS')" :key="index">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryExchangeRate,
  getAmountCalculation,
  queryAccountListone,
  currencyExchangeVerify,
  queryUserAcctLimit
} from '@/api/internationalBusiness.js';
import { moneyValidator } from '@/utils/validator';
import { validate } from 'json-schema';
import { queryPayAccountBalance } from '@/api/payService.js';
import mathTools from '@/utils/mathTools.js';
import filters from "@/filters/public.js"
export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var saleMoneyValidate = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('请输入金额'));
      // }
      if (Number(value) === 0 && value) {
        return callback(
          new Error(this.$t('BILLPAYMENT.PLEASE_ENTER_AMOUNTONE'))
        );
      }
      if (Number(value) > Number(this.form.balance) && value) {
        return callback(
          new Error(this.$t('BILLPAYMENT.AVAILABLE_BALANCE_TIP'))
        );
      }
      if (
        this.form.saleCurrency === 'HKD' &&
        Number(value) < this.limitSingleStart &&
        value
      ) {
        let arr = this.$t('REMITTANCECONFIRM.AMOUNT_LIMIT', {
          limit: this.limitSingleStart
        });
        return callback(new Error(arr));
      }
      if (
        this.form.saleCurrency === 'HKD' &&
        Number(value) > this.limitSingleEnd
      ) {
        return callback(
          new Error(
            this.$t('REMITTANCECONFIRM.MORE_THAN_AMOUNT', {
              limit: this.limitSingleEnd
            })
          )
        );
      }

      callback();
    };
    var saleMoneyValidateone = (rule, value, callback) => {
      if (Number(value) === 0 && value) {
        return callback(
          new Error(this.$t('BILLPAYMENT.PLEASE_ENTER_AMOUNTONE'))
        );
      }

      if (
        this.form.buyCurrency === 'HKD' &&
        Number(value) < this.limitSingleStart &&
        value
      ) {
        let arr = this.$t('REMITTANCECONFIRM.AMOUNT_LIMIT', {
          limit: this.limitSingleStart
        });
        return callback(new Error(arr));
      }
      if (
        this.form.buyCurrency === 'HKD' &&
        Number(value) > this.limitSingleEnd
      ) {
        return callback(
          new Error(
            this.$t('REMITTANCECONFIRM.MORE_THAN_AMOUNT', {
              limit: this.limitSingleEnd
            })
          )
        );
      }

      callback();
    };
    var currencyValidate = (rule, value, callback) => {
      if (
        !(this.form.saleCurrency === 'HKD' || this.form.buyCurrency === 'HKD')
      ) {
        return callback(
          new Error(this.$t('REMITTANCECONFIRM.CCY_MAST_BE_HKD'))
        );
      }
      callback();
    };
    return {
      customerRate: '',
      isInit: false,
      limitSingleStart: '',
      limitSingleEnd: '',
      statusone: false,
      statustwo: false,
      saleC: '',
      index: '1',
      buyC: '',
      zhisattus: false,
      saleAccountListone: [],
      saleaccountyu: '',
      buyaccountyu: '',
      accountTypestatus: true,
      form: {
        saleCurrency: 'HKD',
        saleAccount: '',
        saleMoney: '',
        buyCurrency: '',
        buyMoney: '',
        buyAccount: '',
        rate: '',
        rateone: '',
        sale: '',
        buy: '',
        saleaccountType: '',
        buyaccountType: '',
        saleaccountNo: '',
        buyaccountNo: '',
        currencyType: '',
        company: '',
        companyone: '',
        balance: '',
        balanceqian: '',
        balanceone: '',
        balanceoneqian: '',
        buyMoneyone: '',
        saleMoneyone: '',
        one: '',
        two: '',
        sellstatus: false,
        buystatus: false
      },
      balance: '',

      saleCurrencyList: [
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'CHF', label: 'CHF' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'NZD', label: 'NZD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'USD', label: 'USD' },
        { value: 'HKD', label: 'HKD' }
      ],
      saleAccountList: [],
      buyCurrencyList: [
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'CHF', label: 'CHF' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'NZD', label: 'NZD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'USD', label: 'USD' },
        { value: 'HKD', label: 'HKD' }
      ],
      datacopy: [
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'CHF', label: 'CHF' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'NZD', label: 'NZD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'USD', label: 'USD' },
        { value: 'HKD', label: 'HKD' }
      ],
      buyAccountList: [],
      formRules: {
        saleCurrency: [
          {
            required: true,
            message: this.$t('REMITTANCECONFIRM.PLEASE_ENTER_THE_CURRENCY'),
            trigger: 'change'
          }
          // { validator: currencyValidate, trigger: 'change' }
        ],
        saleAccount: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT_TO_SEARCH')
            }),
            trigger: 'blur'
          }
        ],
        saleMoney: [
          {
            required: true,
            message: this.$t('REMITTANCECONFIRM.PLEASE_ENTER_THE_AMOUNT'),
            trigger: 'blur'
          },
          { validator: saleMoneyValidate, trigger: 'change' },
          { validator: moneyValidator, trigger: 'blur' }
        ],
        buyAccount: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT_TO_SEARCH')
            }),
            trigger: 'blur'
          }
        ],
        buyCurrency: [
          {
            required: true,
            message: this.$t('REMITTANCECONFIRM.PLEASE_ENTER_THE_CURRENCY'),
            trigger: 'change'
          }
        ],
        buyMoney: [
          {
            required: true,
            message: this.$t('REMITTANCECONFIRM.PLEASE_ENTER_THE_AMOUNT'),
            trigger: 'blur'
          },
          { validator: saleMoneyValidateone, trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    'form.saleCurrency'(newVal, oldVal) {
      console.log(newVal, oldVal, this.form);
      this.needOneHkdAccount(newVal, oldVal, this.form);
    },
    'form.buyCurrency'(newVal, oldVal) {
      console.log(newVal, oldVal, this.form);
      this.needOneHkdAccount(newVal, oldVal, this.form);
    },
    formData: {
      deep: true,
      immediate: true,
      handler: function() {
        if (JSON.stringify(this.formData) == '{}') return;
        this.form = this.formData;
      }
    }
  },
  filters:{
    ccyFilter:filters.ccyFilter
  },
  created() {
    this.Datalist();
  },

  methods: {
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    curfilters(val){
      return filters.ccyFilter(val)
    },
    //选择卖出账户
    async saleAccount() {
      for (let i = 0; i < this.saleAccountList.length; i++) {
        if (this.saleAccountList[i].value == this.form.saleAccount) {
          this.form.saleaccountType = this.saleAccountList[i].accountType;
          this.form.saleaccountNo = this.saleAccountList[i].accountNo;
          this.form.currencyType = this.saleAccountList[i].currencyType;
        }
      }

      //账户余额接口的调用
      let paramsone = {
        accountNo: this.form.saleaccountNo,
        accountType: this.form.saleaccountType,
        currencyType: this.form.currencyType
      };
      const res = await queryPayAccountBalance(paramsone);
      if (res.avaliableBalance == null || res.avaliableBalance == '') {
        this.form.balance = '0.00';
        this.form.balanceqian = this.form.balance;
      } else {
        this.form.balance = res.avaliableBalance;
        this.form.balanceqian = this.moneyFormat(this.form.balance);
      }
      this.form.company = res.accountName;
      this.saleaccountyu = res;

      //对非活跃状态的卖出账户进行校验
      this.accountType(res, this.$t('REMITTANCECONFIRM.SELECTED_SELE_ACCOUNT'));
      if (this.form.saleMoney) {
        this.$refs.form.validateField('saleMoney');
      }
    },

    //选择买入账户
    async buyAccount() {
      for (let i = 0; i < this.buyAccountList.length; i++) {
        if (this.buyAccountList[i].value == this.form.buyAccount) {
          this.form.buyaccountType = this.buyAccountList[i].accountType;
          this.form.buyaccountNo = this.buyAccountList[i].accountNo;
          this.form.currencyType = this.buyAccountList[i].currencyType;
        }
      }

      //调用账户余额查询接口
      let paramsone = {
        accountNo: this.form.buyaccountNo,
        accountType: this.form.buyaccountType,
        currencyType: this.form.currencyType
      };
      const res = await queryPayAccountBalance(paramsone);
      if (res.avaliableBalance == null || res.avaliableBalance == '') {
        this.form.balanceone = '0.00';
        this.form.balanceoneqian = this.form.balanceone;
      } else {
        this.form.balanceone = res.avaliableBalance;
        this.form.balanceoneqian = this.moneyFormat(this.form.balanceone);
      }
      this.form.companyone = res.accountName;
      this.buyaccountyu = res;

      //对非活跃状态的买入账户进行校验
      this.accountType(res, this.$t('REMITTANCECONFIRM.SELECTED_ACCOUNT'));
    },

    //金额千分位
    moneyFormat(val){
      let arr = val;
      var brr = arr.toString();
      return mathTools.moneyCheck(brr);
    },

    //货币为JPY时,金额不能是小数
    JPYFormat(val){
      let arr = val;
      arr = Number(arr);
      return Math.round(arr);
    },

    //对卖出，买入账户的状态进行校验
    accountType(arr, brr) {
      if (arr.status == 'DORMANT') {
        this.$message({
          type: 'fail',
          message: brr + this.$t('BILLPAYMENT.DORMAN'),
          delay: 3000
        });
        this.accountTypestatus = false;
      } else if (arr.status == 'FROZEN') {
        this.$message({
          type: 'fail',
          message: brr + this.$t('BILLPAYMENT.FOROZEN'),
          delay: 3000
        });
        this.accountTypestatus = false;
      } else if (arr.status == 'CLOSED') {
        this.$message({
          type: 'fail',
          message: brr + this.$t('BILLPAYMENT.CLOSE'),
          delay: 3000
        });
        this.accountTypestatus = false;
      } else {
        this.accountTypestatus = true; //账户为正常状态时才能进行交易,跳转到确认页
      }
    },

    //输入卖出金额
    async saleMoney() {
      this.form.sellstatus = true; //最后一次输入的是卖出金额
      this.form.buystatus = false; 
      this.form.saleMoney = this.form.saleMoneyone;

      this.statustwo = true;  //以卖出金额为准
      this.statusone = false;
      if (this.form.saleCurrency == '' || this.form.buyCurrency == '') {
        //某一货币为空不调用接口

        this.form.saleMoneyone = this.moneyFormat(this.form.saleMoneyone);
        this.form.saleMoneyone = this.form.saleCurrency + ' ' + this.form.saleMoneyone;
      } else {
        if(this.form.saleMoneyone){
          let paramsthree = {
            creditAmount: '',
            creditCurrency: this.form.buyCurrency,
            debitAmount: this.form.saleMoneyone,
            debitCurrency: this.form.saleCurrency
          };
          //查询买入金额
          const restwo = await getAmountCalculation(paramsthree);
          this.form.buyMoney = restwo.creditAmount;
          // if (this.form.buyCurrency == 'JPY') {
          //   //货币为JPY时,金额不能是小数
          //   this.form.buyMoney = this.JPYFormat(this.form.buyMoney);
          // }
          // this.form.saleMoney = this.form.saleMoneyone;
          this.form.buyMoneyone = this.moneyFormat(this.form.buyMoney);
          this.form.buyMoneyone = this.form.buyCurrency + ' ' + this.form.buyMoneyone;
          this.form.saleMoneyone = this.moneyFormat(this.form.saleMoneyone);
          this.form.saleMoneyone = this.form.saleCurrency + ' ' + this.form.saleMoneyone;
        }
      }
    },
    async buyMoney() {
      this.statusone = true;  //以买入金额为准
      this.statustwo = false;
      this.form.sellstatus = false;
      this.form.buystatus = true;  //最后一次输入的是买入金额
      this.form.buyMoney = this.form.buyMoneyone;
      if (this.form.saleCurrency == '' || this.form.buyCurrency == '' ) {
        //某一货币为空不调用接口
        this.form.buyMoneyone = this.moneyFormat(this.form.buyMoneyone);
        this.form.buyMoneyone = this.form.buyCurrency + ' ' + this.form.buyMoneyone;
        
      } else {
        if (this.form.buyMoney) {
          let paramsthree = {
            creditAmount: this.form.buyMoneyone,
            creditCurrency: this.form.buyCurrency,
            debitAmount: '',
            debitCurrency: this.form.saleCurrency
          };
          //金额计算接口
          const restwo = await getAmountCalculation(paramsthree);
          this.form.saleMoney = restwo.debitAmount;
          this.form.saleMoneyone = this.moneyFormat(this.form.saleMoney);
          this.form.saleMoneyone = this.form.saleCurrency + ' ' + this.form.saleMoneyone;
          this.form.buyMoneyone = this.moneyFormat(this.form.buyMoneyone);
          this.form.buyMoneyone = this.form.buyCurrency + ' ' + this.form.buyMoneyone;
        }
      }
    },
    
    //币种选择，卖出选中的币种，买入不能选
    remooveByValue(arr, attr, value) {
      var index = 0;
      for (var i in arr) {
        if (arr[i][attr] == value) {
          index = i;
          break;
        }
      }
      arr.splice(index, 1);
    },

    //选中卖出币种
    async saleCurrency() {
      //卖出币种和买入币种不能相同
      this.buyCurrencyList = [
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'CHF', label: 'CHF' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'NZD', label: 'NZD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'USD', label: 'USD' },
        { value: 'HKD', label: 'HKD' }
      ];
      this.remooveByValue(
        this.buyCurrencyList,
        'value',
        this.form.saleCurrency
      );
      this.saleCurrencyList = this.datacopy;

      //选中币种查询出账户
      let params = {
        currencyType: this.form.saleCurrency
      };
      const resthree = await queryAccountListone(params);
      if (resthree == '' || resthree == null) {
        //接口调用失败
        this.saleAccountList = [];
        this.form.saleAccount = this.$t('COMMON.PLEASE_SELECT');
        this.form.saleAccount = '';
      } else {
        let i = 0;
        for (i; i < resthree.length; i++) {
          if (resthree[i].accountType == 'SAVING') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.SAVING');
          } else if (resthree[i].accountType == 'MULTICURRENCY') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.MULTICURRENCY');
          } else if (resthree[i].accountType == 'CURRENT') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.CURRENT');
          } else if (resthree[i].accountType == 'FIXED') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.FIXED');
          } else if (resthree[i].accountType == 'LOAN') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.LOAN');
          } else if (resthree[i].accountType == 'SECURITIES') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.SECURITIES');
          } else if (resthree[i].accountType == 'INVESTMENT') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.INVESTMENT');
          }
          resthree[i].value = i - 1;
        }
        this.saleAccountList = resthree;
         //清空之前输入框的卖出账户信息
        if (this.form.saleAccount) {
          this.form.saleAccount = '';
        }
      }

      if (this.form.saleCurrency == '' || this.form.buyCurrency == '') {
        //币种为空，不调用接口
      } else if (this.form.saleMoney == '' && this.form.buyMoney == '') {
        //金额为空，不调用接口
      } else if (this.form.saleMoney || this.form.buyMoney) {
        //调用金额计算接口,最后输入的是卖出金额
        if (this.form.saleMoney && this.statustwo) {
          let paramsthree = {
            creditAmount: '',
            creditCurrency: this.form.buyCurrency,
            debitAmount: this.form.saleMoney,
            debitCurrency: this.form.saleCurrency
          };
          const restwo = await getAmountCalculation(paramsthree);
          this.form.buyMoney = restwo.creditAmount;
          this.form.buyMoneyone = this.moneyFormat(this.form.buyMoney);
          this.form.buyMoneyone = this.form.buyCurrency + ' ' + this.form.buyMoneyone;
          // this.form.saleMoneyone = this.form.saleCurrency + ' ' + this.form.saleMoney;
        } else {
          //调用金额计算接口,最后输入的是买入金额
          let paramsone = {
            creditAmount: this.form.buyMoney,
            creditCurrency: this.form.buyCurrency,
            debitAmount: '',
            debitCurrency: this.form.saleCurrency
          };
          const restwoo = await getAmountCalculation(paramsone);
          this.form.saleMoney = restwoo.debitAmount;
          this.form.saleMoneyone = this.moneyFormat(this.form.saleMoney);
          this.form.saleMoneyone =  this.form.saleCurrency + ' ' + this.form.saleMoney;
          
        }
       
      }

      //调用汇率查询接口
      if (this.form.buyCurrency == '' || this.form.saleCurrency == '') {
        //货币为空不调用接口
      } else {
        let paramstwo = {
          creditCurrency: this.form.buyCurrency,
          debitCurrency: this.form.saleCurrency
        };
        const resone = await queryExchangeRate(paramstwo);
        if (this.form.saleCurrency === resone[0].currency) {
          //卖出是外币
          if (resone[0].currency == 'JPY') {
            this.form.buy = resone[0].customersBuy;
            this.form.sale = '100';
            this.saleC = resone[0].currency;
            this.buyC = 'HKD';
          } else {
            this.form.buy = resone[0].customersBuy;
            this.form.sale = '1';
            this.saleC = resone[0].currency;
            this.buyC = 'HKD';
          }
        } else {
          //卖出是港币
          if (resone[0].currency == 'JPY') {
            this.form.buy = resone[0].customersSell;
            this.form.sale = '100';
            this.saleC = resone[0].currency;
            this.buyC = this.form.buyCurrency;
          } else {
            this.form.buy = resone[0].customersSell;
            this.form.sale = '1';
            this.saleC = resone[0].currency;
            this.buyC = this.form.buyCurrency;
          }
        }
      }
    },

    //选中买入币种
    async buyCurrency() {
      //卖出币种和买入币种不能相同
      this.saleCurrencyList = [
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'CHF', label: 'CHF' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'NZD', label: 'NZD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'USD', label: 'USD' },
        { value: 'HKD', label: 'HKD' }
      ];
      this.remooveByValue(
        this.saleCurrencyList,
        'value',
        this.form.buyCurrency
      );
      this.buyCurrencyList = this.datacopy;

      //选中币种查询出账户
      let params = {
        currencyType: this.form.buyCurrency
      };
      const resthree = await queryAccountListone(params);
      if (resthree == '' || resthree == null) {
        //调用接口失败
        this.buyAccountList = [];
        this.form.buyAccount = this.$t('COMMON.PLEASE_SELECT');
        this.form.buyAccount = '';
      } else {
        let i = 0;
        for (i; i < resthree.length; i++) {
          if (resthree[i].accountType == 'SAVING') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.SAVING');
          } else if (resthree[i].accountType == 'MULTICURRENCY') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.MULTICURRENCY');
          } else if (resthree[i].accountType == 'CURRENT') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.CURRENT');
          } else if (resthree[i].accountType == 'FIXED') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.FIXED');
          } else if (resthree[i].accountType == 'LOAN') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.LOAN');
          } else if (resthree[i].accountType == 'SECURITIES') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.SECURITIES');
          } else if (resthree[i].accountType == 'INVESTMENT') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.INVESTMENT');
          }
          resthree[i].value = i - 1;
        }
        this.buyAccountList = resthree;
        //清空之前输入框的买入账户信息
        if (this.form.buyAccount) {
          this.form.buyAccount = '';
        }
      }
    
      if (this.form.saleCurrency == '' || this.form.buyCurrency == '') {
        //币种为空，不调用接口
      } else if (this.form.saleMoney == '' && this.form.buyMoney == '') {
        //金额为空，不调用接口
      } else {
        if (this.form.saleMoney || this.form.buyMoney) {
          //调用金额计算接口,最后输入的是卖出金额
          // let paramsthree = {
          //   creditAmount: this.form.buyMoney,
          //   creditCurrency: this.form.buyCurrency,
          //   debitAmount: '',
          //   debitCurrency: this.form.saleCurrency
          // };
          if (this.form.saleMoney && this.statustwo) {
             let paramsthree = {
                creditAmount: '',
                creditCurrency: this.form.buyCurrency,
                debitAmount: this.form.saleMoney,
                debitCurrency: this.form.saleCurrency
              };
              const restwo = await getAmountCalculation(paramsthree);
              this.form.buyMoney = restwo.creditAmount;
              this.form.buyMoneyone = this.moneyFormat(this.form.buyMoney);
              this.form.buyMoneyone = this.form.buyCurrency + ' ' + this.form.buyMoneyone;
           } else {
              let paramsone = {
                creditAmount: this.form.buyMoney,
                creditCurrency: this.form.buyCurrency,
                debitAmount: '',
                debitCurrency: this.form.saleCurrency
              };
              const restwoo = await getAmountCalculation(paramsone);
              this.form.saleMoney = restwoo.debitAmount;
              this.form.saleMoneyone = this.moneyFormat(this.form.saleMoney);
              this.form.saleMoneyone = this.form.saleCurrency + ' ' + this.form.saleMoneyone;
            }
          } 
      }

      //调用汇率查询接口
      if (this.form.buyCurrency == '' || this.form.saleCurrency == '') {
        //货币为空不调用接口
      } else {
        let paramstwo = {
          creditCurrency: this.form.buyCurrency,
          debitCurrency: this.form.saleCurrency
        };
        const resone = await queryExchangeRate(paramstwo);
        if (this.form.saleCurrency === resone[0].currency) {
          if (resone[0].currency == 'JPY') {
            this.form.buy = resone[0].customersBuy;
            this.form.sale = '100';
            this.saleC = resone[0].currency;
            this.buyC = 'HKD';
          } else {
            this.form.buy = resone[0].customersBuy;
            this.form.sale = '1';
            this.saleC = resone[0].currency;
            this.buyC = 'HKD';
          }
        } else {
          if (resone[0].currency == 'JPY') {
            this.form.buy = resone[0].customersSell;
            this.form.sale = '100';
            this.saleC = resone[0].currency;
            this.buyC = this.form.saleCurrency;
          } else {
            this.form.buy = resone[0].customersSell;
            this.form.sale = '1';
            this.saleC = resone[0].currency;
            this.buyC = this.form.saleCurrency;
          }
        }
      }
    },
    async Datalist() {
      //限额查询接口
      let paramsome = {};
      const Limit = await queryUserAcctLimit(paramsome);
      for (let i = 0; i < Limit.length; i++) {
        if (Limit[i].tradeTypeSmall == '0301') {
          this.limitSingleStart = Limit[i].limitSingleStart;
          this.limitSingleEnd = Limit[i].limitSingleEnd;
        }
      }

      //查询港元账户
      let params = {
        currencyType: 'HKD'
      };
      const resthree = await queryAccountListone(params);
      if (resthree == '' || resthree == null) {
        //接口没返回数据
      } else {
        let i = 0;
        for (; i < resthree.length; i++) {
          if (resthree[i].accountType == 'SAVING') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.SAVING');
          } else if (resthree[i].accountType == 'MULTICURRENCY') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.MULTICURRENCY');
          } else if (resthree[i].accountType == 'CURRENT') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.CURRENT');
          } else if (resthree[i].accountType == 'FIXED') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.FIXED');
          } else if (resthree[i].accountType == 'LOAN') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.LOAN');
          } else if (resthree[i].accountType == 'SECURITIES') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.SECURITIES');
          } else if (resthree[i].accountType == 'INVESTMENT') {
            resthree[i].accountType = this.$t('ACCOUNT_MANAGEMENT.INVESTMENT');
          }
          resthree[i].value = i - 1;
        }
        this.saleAccountList = resthree;
        this.saleAccountListone = this.saleAccountList;
      }
    },
    needOneHkdAccount(newVal, oldVal, data) {
      if (newVal !== oldVal) {
        if (
          this.form.saleCurrency !== 'HKD' &&
          this.form.buyCurrency !== 'HKD' &&
          this.form.saleCurrency !== '' &&
          this.form.buyCurrency !== ''
        ) {
          //  this.$message('货币兑换其中一个账户必须为港币储蓄或往来账户');
          // this.$message({
          //   message: '货币兑换其中一个账户必须为港币储蓄或往来账户',

          // });
          return this.$message({
            type: 'fail',
            message: this.$t('REMITTANCECONFIRM.INVOIVED_ACCOUNTS'),
            delay: 3000
          });
        }
      }
    },
    goForexListPrice() {
      this.$router.push({
        path: '/internationalBusiness/forexListPrice/forexListPrice',
        query: {
          jumpToInter: true
        }
      });
    },
    reset() {
      this.form.buyMoneyone = '';
      this.form.saleMoneyone = '';
      this.form.buyCurrency = '';
      this.form.saleAccount = '';
      this.form.buyAccount = '';
      this.$refs.form.resetFields();
      this.saleCurrencyList = [
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'CHF', label: 'CHF' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'NZD', label: 'NZD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'USD', label: 'USD' },
        { value: 'HKD', label: 'HKD' }
      ];
      this.buyCurrencyList = [
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
        { value: 'CHF', label: 'CHF' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'NZD', label: 'NZD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'USD', label: 'USD' },
        { value: 'HKD', label: 'HKD' }
      ];
      this.buyAccountList = [];
      this.saleAccountList = this.saleAccountListone;
    },
    async handleNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(12345);
          
          //获取汇率
          if (this.form.sale == '1' || this.form.sale == '100') {
            this.customerRate = this.form.buy;
          } else {
            this.customerRate = this.form.sale;
          }

          //遍历卖出账户列表,获取账户类型
          for (let i = 0; i < this.saleAccountList.length; i++) {
            if (this.saleAccountList[i].value == this.form.saleAccount) {
              this.form.saleAccount =
                this.saleAccountList[i].accountNo +
                ' ' +
                this.curfilters(this.saleAccountList[i].currencyType) +
                ' ' +
                this.saleAccountList[i].accountType;
              this.form.saleaccountType = this.saleAccountList[i].accountType;
              this.form.saleaccountNo = this.saleAccountList[i].accountNo;
            }
          }

          for (let i = 0; i < this.buyAccountList.length; i++) {
            if (this.buyAccountList[i].value == this.form.buyAccount) {
              this.form.buyAccount =
                this.buyAccountList[i].accountNo +
                ' ' +
                this.curfilters(this.buyAccountList[i].currencyType) +
                ' ' +
                this.buyAccountList[i].accountType;
              this.form.buyaccountType = this.buyAccountList[i].accountType;
              this.form.buyaccountNo = this.buyAccountList[i].accountNo;
            }
          }

          if (this.form.buyaccountType == this.$t('ACCOUNT_MANAGEMENT.SAVING')) {
            this.form.buyaccountType = 'SAVING';
          } else if (this.form.buyaccountType == this.$t('ACCOUNT_MANAGEMENT.MULTICURRENCY')) {
            this.form.buyaccountType = 'MULTICURRENCY';
            this.form.buyaccountNo = this.form.buyaccountNo + this.form.buyCurrency;
          } else if (this.form.buyaccountType == this.$t('ACCOUNT_MANAGEMENT.CURRENT')) {
            this.form.buyaccountType = 'CURRENT';
          } else if (this.form.buyaccountType == this.$t('ACCOUNT_MANAGEMENT.FIXED')) {
            this.form.buyaccountType = 'FIXED';
          } else if (this.form.buyaccountType == this.$t('ACCOUNT_MANAGEMENT.LOAN')) {
            this.form.buyaccountType = 'LOAN';
          } else if (this.form.buyaccountType == this.$t('ACCOUNT_MANAGEMENT.SECURITIES')) {
            this.form.buyaccountType = 'SECURITIES';
          } else if (this.form.buyaccountType == this.$t('ACCOUNT_MANAGEMENT.INVESTMENT')) {
            this.form.buyaccountType = 'INVESTMENT';
          }
          if (this.form.saleaccountType == this.$t('ACCOUNT_MANAGEMENT.SAVING')) {
            this.form.saleaccountType = 'SAVING';
          } else if (this.form.saleaccountType ==this.$t('ACCOUNT_MANAGEMENT.MULTICURRENCY')) {
            this.form.saleaccountType = 'MULTICURRENCY';
            this.form.saleaccountNo = this.form.saleaccountNo + this.form.saleCurrency;
          } else if (this.form.saleaccountType == this.$t('ACCOUNT_MANAGEMENT.CURRENT')) {
            this.form.saleaccountType = 'CURRENT';
          } else if (this.form.saleaccountType == this.$t('ACCOUNT_MANAGEMENT.FIXED')) {
            this.form.saleaccountType = 'FIXED';
          } else if (this.form.saleaccountType == this.$t('ACCOUNT_MANAGEMENT.LOAN')) {
            this.form.saleaccountType = 'LOAN';
          } else if (this.form.saleaccountType == this.$t('ACCOUNT_MANAGEMENT.SECURITIES')) {
            this.form.saleaccountType = 'SECURITIES';
          } else if (this.form.saleaccountType == this.$t('ACCOUNT_MANAGEMENT.INVESTMENT')) {
            this.form.saleaccountType = 'INVESTMENT';
          }

          // const resthree = await currencyExchangeVerify(params);
          if (
            this.form.saleCurrency == 'JPY' ||
            this.form.buyCurrency == 'JPY'
          ) {
            if (this.form.saleCurrency == 'JPY') {
              this.two = this.form.buyCurrency;
              this.one = '100JPY';
            } else {
              this.two = this.form.saleCurrency;
              this.one = '100JPY';
            }
          } else {
            if (this.form.saleCurrency == 'HKD') {
              this.two = this.form.saleCurrency;
              this.one = '1' + this.form.buyCurrency;
            } else {
              this.two = this.form.buyCurrency;
              this.one = '1' + this.form.saleCurrency;
            }
          }
          this.accountType(
            this.buyaccountyu,
            this.$t('REMITTANCECONFIRM.SELECTED_INCOME_ACCOUNT')
          );
          this.accountType(
            this.saleaccountyu,
            this.$t('REMITTANCECONFIRM.SELECTED_SELE_ACCOUNT')
          );
          this.$refs[formName].validate(valid => {
            if (valid && this.accountTypestatus) {
              if (
                (this.form.buyCurrency.includes('HKD') ||
                  this.form.saleCurrency.includes('HKD')) &&
                this.form.buyCurrency !== this.form.saleCurrency
              ) {
                this.isInit = true;
                let params = {
                  amountCredited: this.form.buystatus ? this.form.buyMoney : '',
                  amountDebited: this.form.sellstatus
                    ? this.form.saleMoney
                    : '',
                  creditAcctNo: this.form.buyaccountNo,
                  creditCurrency: this.form.buyCurrency,
                  debitAcctNo: this.form.saleaccountNo,
                  debitCurrency: this.form.saleCurrency,
                  customerRate: this.customerRate,
                  creditAccountType: '',
                  debitAccountType: ''
                };
                currencyExchangeVerify(params).then(resthree => {
                  if (resthree) {
                    this.isInit = false;
                    this.form.rate = resthree.customerRate;
                    this.form.one = this.one;
                    this.form.two = this.two;
                    this.form.rateone = this.one + '=' + this.form.rate + this.two;
                    this.$emit('next', this.form);
                  } else {
                    this.isInit = false;
                  }
                });
              } else {
                this.$message(this.$t('REMITTANCECONFIRM.INVOIVED_ACCOUNTS'));
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$primaryFont: rgba(0, 0, 0, 0.45);
.g-exchange-wrapper {
  margin-top: 10px;
  font-size: 16px;
}
.m-sale,
.m-buy {
  border-left: 4px solid #f06b00;
  padding-left: 12px;
  margin: 24px 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
.u-noMargin {
  margin-bottom: 0 !important;
}
.f-goForexListPrice {
  padding: 5px 10px;
  border: 2px #eee solid;
  border-radius: 50px;
}
.m-tips-wrapper {
  margin-top: 36px;
}
.tips {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: 0;
  line-height: 22px;
}
.u-tips-content {
  font-size: 14px;
  p {
    line-height: 22px;
    color: rgba(0, 0, 0, 0.45);
  }
}
.g-btns {
  display: flex;
  // justify-content: center;
  margin-left: 390px;
  margin-top: 42px;
  .f-reset {
    margin-right: 24px;
  }
}
.tips-margin-left {
  margin-left: 12px;
}
.u-balance {
  font-size: 12px;
  width: 48px;
  height: 20px;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
  margin-left: 16px;
  color: rgba(0, 0, 0, 0.45);
}
.u-balanceone {
  width: 223px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
  // margin-left: 10px;
}
.reference-exchange {
  height: 50px;
  line-height: 50px;
  font-size: 12px;
  text-align: center;
  width: 230px;
  margin-bottom: 24px;
  border-radius: 5px;
  box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.2);
}
.f-query {
  display: inline-block;
  cursor: pointer;
  margin-left: 18px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #f06b00;
}
.m-rate-wrapper {
  height: 108px;
  width: 400px;
  border-radius: 4px;
  margin: 0 auto;
  margin-left: 358px;
  margin-top: 36px;
  box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.12);
  &-top {
    height: 40px;
    margin: 0 34px 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #fbf8f5;
  }
  &-bottom {
    margin: 10px 34px 0 30px;
    display: flex;
    div {
      width: 145px;
      :first-child {
        color: $primaryFont;
      }
      :last-child {
        margin-top: 4px;
        font-size: 14px;
        color: #f06b00;
      }
    }
    img {
      height: 42px;
      width: 42px;
    }
    .ml32 {
      margin-left: 32px;
    }
  }
}
.mb16 {
  line-height: 20px;
  margin-bottom: 16px;
  font-size: 12px;
  color: $primaryFont;
  margin: 4px 0 0 15px;
}
.mb17 {
  width: 233px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
}
.head {
  margin: 16px 0;
}
</style>
