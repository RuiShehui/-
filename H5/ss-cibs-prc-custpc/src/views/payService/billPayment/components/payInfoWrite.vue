<template>
  <div class="g-content-wrapper">
    <div class="g-payInfo-write-wrapper">
      <div class="u-dotted"></div>
      <span class="u-top">{{ $t('BILLPAYMENT.PAYMENT_INFORMATION') }}</span>
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        style="padding-top:20px;"
        label-width="calc(50% - 160px)"
      >
        <el-row>
          <el-col>
            <!-- 付款账户 -->
            <el-form-item
              :label="$t('BILLPAYMENT.FROM_ACCOUNT')+ '：'"
              class="u-noMargin"
              prop="payAccount"
            >
              <el-select v-model="form.payAccount" @change="payAccountChange">
                <el-option
                  v-for="item in payNoList"
                  :key="item.accountNo"
                  :label="`${formatAccountNo(item.accountNo)} ${curfilter(item.currencyType) } ${processAccountType(item.accountTypeLabel)}`"
                  :value="item.accountNo"
                  :placeholder="$t('COMMON.PLEASE_SELECT')"
                ></el-option>
              </el-select>
              <span
                v-if="form.payAccount"
                class="u-balance"
              >{{ $t('REMITTANCECONFIRM.AVAILABLE_BALANCE') }}：</span>
              <span v-if="form.payAccount" class="u-balanceone">{{ formatMoneyNew(form.useMoney) }}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="form.payAccount">
            <!-- 账户名称 -->
            <el-form-item class="u-noMarginone">
              {{ $t('REMITTANCECONFIRM.ACCOUNT_NAME') }}：
              {{ form.company }}
            </el-form-item>
          </el-col>
          <el-col :style="form.payAccount?'':'padding-top:16px;'">
            <!-- 商户类别 -->
            <el-form-item :label="$t('BILLPAYMENT.MERCHANT_CATEGORY')+ '：'" prop="merchantTypeInfo">
              <el-select v-model="form.merchantTypeInfo" filterable @change="chooseBusinessType">
                <el-option
                  v-for="item in businessTypeList"
                  :key="item.merchartTypeCode"
                  :label="item.lang=='zh-CN'?item.merchartTypeName:item.lang=='zh-HK'?item.merchartTypeNameZht:item.merchartTypeNameEn"
                  :value="item.lang=='zh-CN'?item.merchartTypeName:item.lang=='zh-HK'?item.merchartTypeNameZht:item.merchartTypeNameEn"
                  :placeholder="$t('COMMON.PLEASE_SELECT')"
                ></el-option>
              </el-select>
              <span class="u-query" @click="showMyBusList">{{ $t('BILLPAYMENT.MY_PAYEE_LIST') }}</span>
            </el-form-item>
          </el-col>
          <el-col>
            <!-- 商户名称 -->
            <el-form-item :label="$t('BILLPAYMENT.MERCHANT_NAME')+ '：'" prop="merchantName">
              <el-select v-model="form.merchantName" filterable @change="chooseBusinessName">
                <el-option
                  v-for="item in businessNameList"
                  :key="item.value"
                  :label="item.lang=='zh-CN'?item.merchartName:item.lang=='zh-HK'?item.merchartNameZht:item.merchartNameEn"
                  :value="item.lang=='zh-CN'?item.merchartName:item.lang=='zh-HK'?item.merchartNameZht:item.merchartNameEn"
                  :placeholder="$t('COMMON.PLEASE_SELECT')"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <!-- 账单类别 -->
            <el-form-item
              :label="$t('BILLPAYMENT.BILL_TYPE')+ '：'"
              prop="billTypeInfo"
              :rules="[{required:this.billTypeInfostatus,message: this.$t('BILLPAYMENT.PLEASE_ENTER_BILL'),trigger:'change'}]"
            >
              <el-select
                v-model="form.billTypeInfo"
                @change="billTypeName"
                :disabled="!billTypeInfostatus"
              >
                <el-option
                  v-for="item in accountTypeList"
                  :key="item.value"
                  :label="item.lang=='zh-CN'?item.billTypeInfo:item.lang=='zh-HK'?item.billTypeInfoZht:item.billTypeInfoEn"
                  :value="item.lang=='zh-CN'?item.billTypeInfo:item.lang=='zh-HK'?item.billTypeInfoZht:item.billTypeInfoEn"
                  :placeholder="$t('COMMON.PLEASE_SELECT')"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <!-- 账单号码 -->
            <el-form-item :label="$t('BILLPAYMENT.BILL_NO')+ '：'" prop="billNo">
              <el-input
                v-model="form.billNo"
                :placeholder="$t('BILLPAYMENT.PLEASE_ENTER_BILL_NO')"
                @change="isHighRiskMerchant()"
              ></el-input>

              <span
                class="u-query"
                v-if="form.merchantName==this.$t('BILLPAYMENT.TAX')"
                @click="revenue"
              >{{ $t('BILLPAYMENT.PAY_TAX_TIPS') }}</span>
            </el-form-item>
          </el-col>
          <el-col>
            <!-- 交易金额 -->
            <el-form-item :label="$t('BILLPAYMENT.TRANSACTION_AMOUNT')+ '：'" prop="tranAmt">
              <div class="g-input">
                <el-input v-model="form.currency" :placeholder="$t('BILLPAYMENT.ALL')" disabled></el-input>
                <money-input
                  :isSaveDot="this.form.currency !== 'JPY'"
                  v-model="form.tranAmt"
                  :placeholder="$t('BILLPAYMENT.PLEASE_ENTER_AMOUNT')"
                  @blur="initAuthSelect"
                  style="padding-left:8px;width:160px;"
                ></money-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col>
            <!-- 预约处理选项 -->
            <el-form-item :label="$t('BILLPAYMENT.PROESS_APPOINTMENT')+ '：'">
              <div class="u-yu" style="margin-top: -12px;padding-left: 15px;">
                <el-checkbox v-model="form.subscribeFlag"></el-checkbox>
              </div>
            </el-form-item>
          </el-col>
          <el-col v-if="form.subscribeFlag">
            <!-- 预约处理时间 -->
            <el-form-item :label="$t('BILLPAYMENT.PAYMENT_DATE')+ '：'" prop="payDate">
              <el-date-picker
                v-model="form.payDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :style="form.merchantTypeInfo?'':'margin-bottom: 35px;margin-top: 6px;'">
            <!-- 加入我的商户清单 -->
            <el-form-item
              :label="$t('BILLPAYMENT.SAVE_TO_MY_PAYEE_LIST')+ '：'"
              v-if="form.merchantTypeInfo && form.riskFlag =='1'"
            >
              <div class="u-addlist">
                <el-checkbox v-model="form.addMerchantFlag"></el-checkbox>
                <span
                  class="u-merchant"
                  :style="form.merchantTypeInfo?'padding-left: 45px;':''"
                  @click="allBusiness"
                >{{ $t('BILLPAYMENT.VIEW_FULL_MERCHANT_LIST') }}</span>
              </div>
            </el-form-item>
            <span
              class="u-merchant"
              v-if="!form.merchantTypeInfo || form.riskFlag =='0'"
              style="padding-left: 330px;"
              @click="allBusiness"
            >{{ $t('BILLPAYMENT.VIEW_FULL_MERCHANT_LIST') }}</span>
          </el-col>
          <el-col
            v-if="form.merchantTypeInfo"
            :style="form.merchantTypeInfo && form.riskFlag =='1'?'padding-bottom:11px;':'padding-top:20px'"
          >
            <!-- 商户别名 -->
            <el-form-item :label="$t('BILLPAYMENT.PAYEE_NICKNAME')+ '：'">
              <el-input v-model="form.merchantAlias"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="auth-check-box" v-if="statustpe">
        <auth-select
          v-if="entType !== 1"
          :authInfo="authInfo"
          tradeType="060101"
          :acctNo="form.payAccount"
          :amount="form.tranAmt"
          ref="authorizationSelect"
          labelWidth="160px"
          @checkClick="getAuthInfo"
        />
      </div>
      <div class="u-btns u-hasMargin">
        <v-button
          v-if="showReset"
          class="f-reset"
          size="w160"
          @click="reset"
        >{{ $t('BILLPAYMENT.RESET') }}</v-button>
        <v-button
          v-if="!showReset"
          class="f-reset"
          size="w160"
          @click="back"
        >{{ $t('BILLPAYMENT.BACK') }}</v-button>
        <v-button size="w160" type="primary" @click="next">{{ $t('BILLPAYMENT.NEXT') }}</v-button>
      </div>
    </div>
    <!-- 我的商户清单弹窗 -->
    <el-dialog class="dialog HeightStyle" :visible.sync="showAllBusiness" width="980px" top="0vh">
      <div class="u-head">{{ $t('BILLPAYMENT.LIST_OF_REGISTERED_MERCHANTS') }}</div>
      <el-table :data="tableData" style="width: 100%;" stripe>
        <el-table-column width="80" :label="$t('BILLPAYMENT.SELECT')">
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="select" @change="change"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="merchantAlias"
          :label="$t('BILLPAYMENT.PAYEE_NICKNAME')"
          width="180px"
        ></el-table-column>
        <el-table-column
          prop="merchantTypeInfo"
          :label="$t('BILLPAYMENT.MERCHANT_CATEGORY')"
          width="180px"
        ></el-table-column>
        <el-table-column prop="merchantName" :label="$t('BILLPAYMENT.MERCHANT_NAME')"></el-table-column>
        <el-table-column prop="billTypeInfo" :label="$t('BILLPAYMENT.BILL_TYPE')"></el-table-column>
        <el-table-column prop="billNo" :label="$t('BILLPAYMENT.BILL_NO')"></el-table-column>
      </el-table>

      <div class="u-btns sure">
        <v-button size="w210" type="primary" @click="sure">{{ $t('BILLPAYMENT.SURE') }}</v-button>
      </div>
    </el-dialog>
    <!-- 全部商户清单弹窗 -->
    <el-dialog :visible.sync="showPopup" width="980px" top="0vh">
      <div class="u-head">{{ $t('BILLPAYMENT.FULL_MERCHANT_LIST') }}</div>
      <div class="u-form">
        <el-form>
          <div style="display: flex;">
            <el-col :span="6">
              <!--  商户类别 -->
              <el-form-item
                :label="$t('BILLPAYMENT.MERCHANT_CATEGORY')+':'"
                prop="payAccount"
                label-width="150px"
              >
                <el-select v-model="form.businessTypeone" filterable>
                  <el-option
                    v-for="item in businessTypeList"
                    :key="item.value"
                    :label="item.lang=='zh-CN'?item.merchartTypeName:item.lang=='zh-HK'?item.merchartTypeNameZht:item.merchartTypeNameEn"
                    :value="item.merchartTypeName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :push="6" style="margin-left: 41px;">
              <v-button
                size="w70"
                type="primary"
                @click="inquire"
                style="margin-top: 2px;"
              >{{ $t('BILLPAYMENT.INQUIRE') }}</v-button>
            </el-col>
          </div>
        </el-form>
      </div>
      <el-table max-height="300" :data="businessTable" style="width: 100%;" stripe>
        <el-table-column prop="merchartName" :label="$t('BILLPAYMENT.MERCHANT_NAME')"></el-table-column>
        <el-table-column prop="billNumberInfo" :label="$t('BILLPAYMENT.BILL_ACCOUNT_DESCRIPTION')"></el-table-column>
        <el-table-column prop="billType" :label="$t('BILLPAYMENT.BILL_TYPE')" width="200px"></el-table-column>
        <el-table-column
          prop="billTypeInfo"
          :label="$t('BILLPAYMENT.BILL_TYPE_DESCRIPTION')"
          style="float: right;text-align: end;margin-right: 45px;"
        ></el-table-column>
      </el-table>
      <div style="width:916px;height:46px;"></div>
    </el-dialog>
    <div class="m-tips-wrapper">
      <p class="tips head">{{ $t('BILLPAYMENT.TIPS') }}</p>
      <div class="u-tips-content">
        <p v-for="(item,index) in $t('BILLPAYMENT.BILL_PAYMENT_TIPS')" :key="index">{{ item }}</p>
      </div>
    </div>
    <div class="g-jiaosui" v-if="revenueStatus">
      <el-dialog :visible.sync="revenueStatus" width="980px" top="0vh">
        <div class="u-headtwo">{{ $t('BILLPAYMENT.PAY_TAX_TIPS') }}</div>
        <div class="span-one">{{ $t('BILLPAYMENT.TAX_PAYMENT') }}</div>

        <div class="span-two">{{ $t('BILLPAYMENT.STEP_ONE') }}</div>
        <div class="u-headone" v-if="revenueStatus">
          <img src="@/images/internationalBusiness/one.png" style="width: 916px;height: 431px;" />
        </div>
        <div class="span-three">{{ $t('BILLPAYMENT.STEP_TWO') }}</div>
        <div class="u-headone" v-if="revenueStatus">
          <img src="@/images/internationalBusiness/two.png" style="width: 916px;height: 431px;" />
        </div>
        <v-button size="w210" type="primary" @click="sureone">{{ $t('BILLPAYMENT.CONFIRM') }}</v-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mathTools from '@/utils/mathTools.js';
import {
  account,
  queryMerchantTypeList,
  queryMerchantList,
  myMerchantList,
  alllist,
  queryPayAccountBalance,
  orderPayConfirmDetails,
  orderPayTranAuth,
  queryCstMessage,
  isHighRiskMerchant,
  checkMerchantBillNo,
  myMerchantDetail
} from '@/api/payService.js';
import { queryTranIsAuth } from '@/api/authorizeCenter';
import filters from '@/filters/public.js';
import tool from '@/dataTools/tools/moneyTools.js';
import business from '@/filters/business.js';
import { formatMoneyNew } from '@/utils/tools';
import { transWrite } from '@bank-transfer/mixins';
export default {
  name: 'PayInfoWrite',
  props: {
    formData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mixins: [transWrite],
  filters: {
    ccyFilter: filters.ccyFilter
  },
  computed: {
    merchantT() {
      return this.form.merchantType;
    },
    merchantC() {
      return this.form.merchantCode;
    },
    billT() {
      return this.form.billType;
    }
  },
  data() {
    const validateMoney = (rule, value, callback) => {
      if (Number(value) === 0) {
        return this.$message({
          type: 'fail',
          message: this.$t('BILLPAYMENT.PLEASE_ENTER_AMOUNTONE')
        });
      } else if (Number(value) > this.form.useMoney * 1) {
        const currentHours = new Date().getHours();
        //选择预约处理，余额不足不可以进行交易
        if (!this.form.subscribeFlag) {
          this.nextstatus = false;
          return this.$message({
            type: 'fail',
            message: this.$t('BILLPAYMENT.AVAILABLE_BALANCE_TIP')
          });
        }
        //选择预约处理，余额不足可以进行交易
        if (this.form.subscribeFlag) {
          this.nextstatus = true;
          return this.$message({
            type: 'fail',
            message: this.$t('BILLPAYMENT.AVAILABLE_BALANCE_DATE')
          });
        }
      } else {
        this.nextstatus = true;
        callback();
      }
    };
    const date = new Date(new Date().getTime() + 86400000);
    return {
      //预约处理时间只能选择当天之后
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let oneDay = 180 * 24 * 3600 * 1000;
          let threeMonths = curDate + oneDay;
          return time.getTime() < Date.now() || time.getTime() > threeMonths;
        }
      },
      showReset: true,
      nextstatus: true,
      form: {
        riskFlag: '0', // 高风险账户标识（已登记为低风险）
        billNo: '',
        payAccount: '',
        accountType: '',
        merchantType: '',
        merchantTypeInfo: '',
        businessTypeone: '',
        merchantName: '',
        billType: '',
        tranAmt: '',
        payDate: '',
        currency: 'HKD',
        merchantAlias: '',
        addMerchantFlag: '',
        yustatus: '',
        payNol: '',
        accountName: '',
        accountTypeone: '',
        subscribeFlag: false,
        useMoney: '',
        company: '',
        merchantTypeCode: '',
        merchantCode: '',
        billTypeInfo: '',
        accountTypeName: '',
        acctNo: '12131323232'
      },
      payNoList: [],
      businessTypeList: [],
      businessNameList: [],
      accountTypeList: [],
      formRules: {
        payAccount: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_ACCOUNT'),
            trigger: 'change'
          }
        ],
        billNo: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_BILL_NO'),
            trigger: 'change'
          },
          {
            pattern: /(^[0-9]([0-9]+)?(\.[0-9]{1,2})$)|(^[0-9]([0-9]*)$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('BILLPAYMENT.SURE_BILLNO_FORMAT')
            }),
            trigger: 'change'
          }
        ],
        merchantTypeInfo: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_CATEGORY'),
            trigger: 'change'
          }
        ],
        merchantName: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_NAME'),
            trigger: 'change'
          }
        ],

        tranAmt: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_AMOUNT'),
            trigger: 'blur'
          },
          { required: true, validator: validateMoney, trigger: 'blur' }
        ],
        payDate: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_SELECT_THE_PAYMENT_DATE'),
            trigger: 'blur'
          }
        ]
      },
      radio: '',
      showPopup: false,
      billTypeInfostatus: true,
      tableData: [],
      total: '',
      currentPage: '',
      pageSize: '',
      total2: '',
      currentPage2: '',
      pageSize2: '',
      select: '',
      businessTable: [],
      showAllBusiness: false,
      revenueStatus: false,
      statustpe: false,
      arrone: '',
      arrtwo: '',
      billType: '',
      langstatus: ''
    };
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler: function() {
        if (JSON.stringify(this.formData) == '{}') return;
        this.form = this.formData;
      }
    },

    merchantT(val) {
      if (val && this.form.merchantCode && this.form.billNo) {
        this.isHighRiskMerchant();
      }
    },
    merchantC(val) {
      if (this.form.merchantType && val && this.form.billNo) {
        this.isHighRiskMerchant();
      }
    },
    billT(val) {
      if (
        this.form.merchantType &&
        this.form.merchantCode &&
        this.form.billNo
      ) {
        this.isHighRiskMerchant();
      }
    }
  },
  created() {
    this.datalist();
  },

  methods: {
    formatMoneyNew,
    init() {},
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    curfilter(val, type) {
      return filters.ccyFilter(val, type);
    },
    processAccountType(val) {
      return business.processAccountType(val);
    },
    async payAccountChange(val) {
      this.form.payNol = this.form.payAccount;
      for (let i = 0; i < this.payNoList.length; i++) {
        if (this.payNoList[i].accountNo == this.form.payAccount) {
          this.form.payAccount = this.payNoList[i].accountNo;
          this.form.accountTypeName = this.payNoList[i].accountTypeName;
          this.form.currency = this.payNoList[i].currencyType;
          this.form.accountName = this.payNoList[i].accountName;
          this.form.accountType = this.payNoList[i].accountType;
        }
      }
      let params = {
        accountNo: this.form.payNol,
        category: '',
        currencyType: this.form.currency,
        accountType: this.form.accountType
      };
      const res = await queryPayAccountBalance(params);
      if (res) {
        this.$set(this.form, 'useMoney', res.avaliableBalance);
        this.$set(this.form, 'company', res.accountName);
        //对非活跃状态的账户进行校验
        this.accountType(res, this.$t('BILLPAYMENT.SELECT_ACCOUNTONE'));
      }
    },

    //对账户的状态进行校验
    accountType(arr, brr) {
      if (arr.status == 'DORMANT') {
        this.$message({
          type: 'fail',
          message: brr + this.$t('ACCOUNT_MAINTENACE.DORMANT'),
          delay: 3000
        });
        this.accountTypestatus = false;
      } else if (arr.status == 'FROZEN') {
        this.$message({
          type: 'fail',
          message: brr + this.$t('ACCOUNT_MAINTENACE.FROZEN'),
          delay: 3000
        });
        this.accountTypestatus = false;
      } else if (arr.status == 'CLOSED') {
        this.$message({
          type: 'fail',
          message: brr + this.$t('ACCOUNT_MAINTENACE.STATUS_CLOSE'),
          delay: 3000
        });
        this.accountTypestatus = false;
      } else {
        this.accountTypestatus = true;
      }
    },
    revenue() {
      this.revenueStatus = true;
    },
    async datalist() {
      this.langstatus = localStorage.getItem('lang');
      let paramsthree = {
        langFlag:
          this.langstatus == 'zh-CN'
            ? '0'
            : this.langstatus == 'zh-HK'
            ? '1'
            : '2'
      };
      //付款账户查询
      const res = await account({});
      this.payNoList = res;

      //查询商户类别
      const resone = await queryMerchantTypeList({});
      if (resone) {
        this.businessTypeList = resone;
        for (let i = 0; i < this.businessTypeList.length; i++) {
          const lang = localStorage.getItem('lang');
          this.businessTypeList[i].lang = lang;
        }
      }

      //我的商户清单
      const resfour = await myMerchantList(paramsthree);
      this.tableData = resfour;

      //查询个人客户信息-判断是否需要授权
      const ressix = await queryTranIsAuth({ businessCode: '060101' });
      this.statustpe = ressix;

      //从我的商户清单页面跳转过来,调用详情接口
      let paramsObj = JSON.parse(
        sessionStorage.getItem('paramsObj', paramsObj)
      );
      sessionStorage.removeItem('paramsObj');
      if (paramsObj && paramsObj.type == 'edit') {
        this.showReset = false; //从我的商户清单页面跳转过来，重设按钮变为上一步按钮
        let paramsdetail = {
          id: paramsObj.billCode,
          langFlag:
            localStorage.getItem('lang') == 'zh-CN'
              ? '0'
              : localStorage.getItem('lang') == 'zh-HK'
              ? '1'
              : '2'
        };
        const res = await myMerchantDetail(paramsdetail);
        this.form = res;

        let paramstwo = {
          merchartTypeCode: this.form.merchantType
        };
        const restwo = await queryMerchantList(paramstwo);
        this.businessNameList = restwo;
        for (let i = 0; i < this.businessNameList.length; i++) {
          const lang = localStorage.getItem('lang');
          this.businessNameList[i].lang = lang;
        }
        for (let i = 0; i < this.businessNameList.length; i++) {
          if (
            this.form.merchantName == this.businessNameList[i].merchartName ||
            this.form.merchantName ==
              this.businessNameList[i].merchartNameZht ||
            this.form.merchantName == this.businessNameList[i].merchartNameEn
          ) {
            this.accountTypeList = this.businessNameList[
              i
            ].commEpsMerchantBills;
            this.form.merchantCode = this.businessNameList[i].merchartCode;

            if (this.accountTypeList[0].billTypeInfo == null) {
              //没有账单类别,账单类别为非必输且输入框置灰
              this.billTypeInfostatus = false;
            } else {
              this.billTypeInfostatus = true;
            }
            for (let i = 0; i < this.accountTypeList.length; i++) {
              const lang = localStorage.getItem('lang');
              this.accountTypeList[i].lang = lang;
            }
          }
        }
        setTimeout(() => {
          this.$refs['form'].clearValidate();
        }, 0);
      }
    },

    //查询账单类别详情
    chooseBusinessName() {
      this.form.billTypeInfo = '';
      for (let i = 0; i < this.businessNameList.length; i++) {
        if (
          this.form.merchantName == this.businessNameList[i].merchartName ||
          this.form.merchantName == this.businessNameList[i].merchartNameZht ||
          this.form.merchantName == this.businessNameList[i].merchartNameEn
        ) {
          this.accountTypeList = this.businessNameList[i].commEpsMerchantBills;
          this.form.merchantCode = this.businessNameList[i].merchartCode;

          if (this.accountTypeList[0].billTypeInfo == null) {
            //没有账单类别,账单类别为非必输且输入框置灰
            this.billTypeInfostatus = false;
          } else {
            this.billTypeInfostatus = true;
          }
          for (let i = 0; i < this.accountTypeList.length; i++) {
            const lang = localStorage.getItem('lang');
            this.accountTypeList[i].lang = lang;
          }
        }
      }
    },

    //查询账单类别编号code
    billTypeName() {
      for (let i = 0; i < this.accountTypeList.length; i++) {
        if (
          this.form.billTypeInfo == this.accountTypeList[i].billTypeInfo ||
          this.form.billTypeInfo == this.accountTypeList[i].billTypeInfoZht ||
          this.form.billTypeInfo == this.accountTypeList[i].billTypeInfoEn
        ) {
          this.form.billType = this.accountTypeList[i].billType;
        }
      }
    },

    //查询商户名称
    async chooseBusinessType() {
      this.form.merchantName = '';
      this.form.billTypeInfo = '';
      for (let i = 0; i < this.businessTypeList.length; i++) {
        if (
          this.form.merchantTypeInfo ==
            this.businessTypeList[i].merchartTypeName ||
          this.form.merchantTypeInfo ==
            this.businessTypeList[i].merchartTypeNameZht ||
          this.form.merchantTypeInfo ==
            this.businessTypeList[i].merchartTypeNameEn
        ) {
          this.arrone = this.businessTypeList[i].merchartTypeCode;
        }
      }
      this.form.merchantType = this.arrone;
      let paramstwo = {
        merchartTypeCode: this.arrone
      };
      const restwo = await queryMerchantList(paramstwo);
      this.businessNameList = restwo;
      for (let i = 0; i < this.businessNameList.length; i++) {
        const lang = localStorage.getItem('lang');
        this.businessNameList[i].lang = lang;
      }
    },

    //全部商户名单弹窗查询
    inquire() {
      for (let i = 0; i < this.businessTypeList.length; i++) {
        if (
          this.form.businessTypeone == this.businessTypeList[i].merchartTypeName
        ) {
          this.arrone = this.businessTypeList[i].merchartTypeCode;
        }
      }
      let paramsthree = {
        merchartTypeCode: this.arrone,
        langFlag:
          this.langstatus == 'zh-CN'
            ? '0'
            : this.langstatus == 'zh-HK'
            ? '1'
            : '2'
      };
      alllist(paramsthree).then(res => {
        this.businessTable = res;
        for (let i in this.businessTable) {
          if (this.langstatus == 'zh-HK') {
            this.businessTable[i].billNumberInfo = this.businessTable[
              i
            ].billNumberInfoZht;
            this.businessTable[i].merchartName = this.businessTable[
              i
            ].merchartNameZht;
            this.businessTable[i].billTypeInfo = this.businessTable[
              i
            ].billTypeInfoZht;
          }
          if (this.langstatus == 'en') {
            this.businessTable[i].billNumberInfo = this.businessTable[
              i
            ].billNumberInfoEn;
            this.businessTable[i].merchartName = this.businessTable[
              i
            ].merchartNameEn;
            this.businessTable[i].billTypeInfo = this.businessTable[
              i
            ].billTypeInfoEn;
          }
        }
      });
    },

    //点击全部商户清单触发事件
    async allBusiness() {
      this.showPopup = true;
      this.form.businessTypeone = '';
      let paramsthree = {
        merchartTypeCode: '',
        langFlag:
          this.langstatus == 'zh-CN'
            ? '0'
            : this.langstatus == 'zh-HK'
            ? '1'
            : '2'
      };
      const resfive = await alllist(paramsthree);
      this.businessTable = resfive;
    },

    //显示我的商户清单弹窗
    showMyBusList() {
      this.showAllBusiness = true;
    },

    //我的商户清单弹窗确定事件
    sure() {
      this.form.billTypeInfo = '';
      console.log(this.tableData[this.select]);
      if (typeof this.tableData[this.select] === 'undefined')
        return this.$message({
          type: 'fail',
          message: this.$t('BILLPAYMENT.PLEASE_ENTER_CATEGORYONE'),
          delay: 3000
        });
      const {
        merchantAlias,
        merchantName,
        billTypeInfo,
        billNo,
        merchantCode,
        merchantType,
        merchantTypeInfo,
        billType
      } = this.tableData[this.select];
      this.form.merchantTypeInfo = merchantTypeInfo;
      this.form.merchantAlias = merchantAlias;
      this.form.merchantName = merchantName;
      this.form.billTypeInfo = billTypeInfo;
      this.form.billNo = billNo;
      this.form.merchantCode = merchantCode;
      this.form.merchantType = merchantType;
      this.form.billType = billType;
      this.showAllBusiness = false;
      if (this.form.billTypeInfo == '' || this.form.billTypeInfo == null) {
        this.billTypeInfostatus = false;
      } else {
        this.billTypeInfostatus = true;
      }
    },

    //关闭全部商户清单弹窗
    sureone() {
      this.revenueStatus = false;
    },
    getAuthInfo(data) {
      this.$set(this.form, 'authInfo', data);
    },
    change(val) {
      console.log(this.select, val);
    },

    //重置数据
    reset() {
      this.form.payAccount = '';
      this.form.merchantTypeInfo = '';
      this.form.merchantName = '';
      this.form.billTypeInfo = '';
      this.form.billNo = '';
      this.form.tranAmt = '';
      this.form.payDate = '';
      this.form.addMerchantFlag = '';
      this.form.subscribeFlag = '';
      this.form.merchantAlias = '';
    },
    back() {
      this.$router.go(-1);
    },

    //判断选择的商户类别是否是高风险
    isHighRiskMerchant() {
      if (
        this.form.merchantType &&
        this.form.merchantCode &&
        this.form.billNo
      ) {
        let params = {
          merchantType: this.form.merchantType,
          merchantCode: this.form.merchantCode,
          billType: this.form.billType,
          billNo: this.form.billNo
        };
        isHighRiskMerchant(params).then(res => {
          this.form.riskFlag = res;
        });
      }
    },
    next() {
      let params = {
        tranAmount: this.form.tranAmt,
        merchantType: this.form.merchantType,
        merchantCode: this.form.merchantCode,
        billType: this.form.billType,
        subscribeFlag: this.form.subscribeFlag ? '1' : '0',
        billNo: this.form.billNo,
        account: this.form.payAccount,
        currency: this.form.currency,
        riskFlag: this.form.riskFlag
      };
      this.$refs.form.validate(valid => {
        if (valid && this.nextstatus) {
          checkMerchantBillNo(params).then(res => {
            if (res) {
              this.$emit('next', this.form);
            }
          });
        }
      });
    },

    handleSelect() {},
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleSizeChange2(size) {
      this.pageSize2 = size;
    },
    handleCurrentChange2(currentPage) {
      this.currentPage2 = currentPage;
    }
  }
};
</script>

<style lang="scss" scoped>
.g-content-wrapper {
  .u-top {
    width: 72px;
    height: 26px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    line-height: 26px;
    font-weight: 500;
    padding-left: 16px;
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
  .g-tip {
    height: 20px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    letter-spacing: 0;
    font-weight: 400;
    padding-left: 10px;
  }
  .u-head {
    text-align: center;
    letter-spacing: 0;
    width: 916px;
    height: 26px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 26px;
    font-weight: 500;
    padding-bottom: 24px;
  }
  .u-headone {
    text-align: center;
    letter-spacing: 0;
    width: 980px;
    height: 431px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 26px;
    font-weight: 500;
    padding-bottom: 24px;
  }
  .u-headtwo {
    letter-spacing: 0;
    height: 26px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 26px;
    font-weight: 500;
    padding-bottom: 12px;
    padding-top: 12px;
    text-align: left;
    padding-left: 32px;
    background-color: #feaf03;
  }
  .u-btns {
    display: flex;
    justify-content: center;
  }
  .sure {
    margin-bottom: 24px;
    margin-top: 24px;
  }
  .u-hasMargin {
    margin-top: 36px;
    margin-bottom: 20px;
  }
  .u-link {
    display: inline-block;
    margin-top: 8px;
    letter-spacing: 1px;
  }
  .f-reset {
    margin-right: 20px;
  }
  .u-query {
    width: 84px;
    height: 22px;
    color: #f06b00;
    letter-spacing: 0;
    font-weight: 400;
    line-height: 22px;
    font-size: 14px;
    padding-left: 16px;
  }
  .u-noMargin {
    margin: 0;
  }
  .u-noMarginone {
    /deep/.el-form-item__content {
      line-height: 20px;
      position: relative;
      margin-left: 80px;
      margin: 4px 0 0 15px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
    }
    color: rgba(0, 0, 0, 0.45);
    margin-left: 15px;
    font-size: 12px;
    margin-right: 12px;
  }
  .u-addlist {
    /deep/.el-checkbox {
      padding-top: 0px;
      padding-left: 15px;
    }
  }
  /deep/.el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  .g-input {
    /deep/.el-input__inner {
      width: 155px;
    }
    /deep/.el-input {
      width: auto;
    }
    //   /deep/.el-input--suffix {
    //     width: 110px;
    // }
  }
  .u-merchant {
    width: 112px;
    height: 22px;
    font-size: 14px;
    color: #f06b00;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
    padding-left: 42px;
  }
  .u-list {
    float: left;
    height: 22px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
    padding-bottom: 23px;
    margin-top: -10px;
  }
  .u-dotted {
    float: left;
    width: 4px;
    height: 18px;
    background: #f06b00;
    margin-top: 3.5px;
  }
  .u-yu {
    /deep/.el-checkbox {
      padding-top: -10px;
      padding-top: 10px;
      margin-right: 32px;
    }
  }
  .u-form {
    /deep/.el-input__inner {
      width: 230px;
    }
    /deep/.el-input {
      width: auto;
    }
  }
  /deep/.el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    margin-left: 133px;
  }
  /deep/.el-col-push-6 {
    position: relative;
    left: 13%;
  }

  /deep/.el-input {
    width: 320px;
  }
  /deep/.el-radio__inner {
    border: 1px solid #d9d9d9;
    border-radius: 100%;
    width: 16px;
    height: 16px;
    background-color: #ffffff;
    position: relative;
    cursor: pointer;
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: -2px;
  }
  /deep/.el-dialog__headerbtn {
    top: 32px;
    right: 32px;
  }
  /deep/.el-dialog__wrapper .el-dialog__header {
    padding-top: 32px;
  }
  /deep/.el-dialog__header {
    padding: 0px;
    padding-bottom: 0px;
  }
  /deep/.el-form-item__error {
    color: #f23f47;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 15px;
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
  .head {
    margin: 16px 0;
  }
  /deep/.el-table_1_column_4 {
    /deep/.cell {
      width: 140px;
      margin-left: 60px;
    }
  }
  /deep/.el-dialog__headerbtn .el-icon-close:before {
    content: '\E79D';
    content: '\E6DB';
    font-size: 20px;
  }
}
/deep/.el-table .cell {
  padding-left: 24px !important;
  padding-right: 12px !important;
}
.g-jiaosui {
  /deep/.el-dialog__wrapper .el-dialog__header {
    padding-top: 0px;
  }
  /deep/.el-dialog__body {
    padding: 30px 20px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    color: #666666;
    font-size: 14px;
    word-break: break-all;
    height: 800px;
  }
  /deep/.el-dialog__headerbtn {
    top: 19px;
    right: 32px;
  }
  .span-one {
    padding-left: 32px;
    font-size: 18px;
    font-weight: 500;
    height: 26px;
    line-height: 26px;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .span-two {
    padding-left: 36px;
    font-size: 14px;
    padding-bottom: 16px;
  }
  .span-three {
    padding-left: 32px;
    font-size: 14px;
    font-weight: 400;
    height: 22px;
  }
  /deep/.common-button {
    padding-left: 385px;
  }
}
.auth-check-box {
  ::v-deep .el-checkbox-group {
    height: 36px;
  }
  ::v-deep .el-checkbox {
    padding-top: 0px;
    height: 36px;
    line-height: 36px;
  }
}
.HeightStyle {
  /deep/.el-dialog__body {
    height: 650px;
  }
}
</style>