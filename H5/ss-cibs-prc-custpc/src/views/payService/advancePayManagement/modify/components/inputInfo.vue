<template>
  <div class="g-info-write-wrapper" v-loading="isInit">
    <!-- 缴付信息 -->
    <div class="u-dotted"></div>

    <span class="u-top">{{$t('BILLPAYMENT.PAYMENT_INFORMATION')}}</span>
    <el-form ref="form" :model="form" :rules="formRules" style="padding-top: 20px">
      <el-row>
        <el-col>
          <el-form-item label-width="414px" :label="$t('BILLPAYMENT.FROM_ACCOUNT')+':'" prop="pay">
            <el-input v-model="form.pay" :disabled="type==='edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label-width="414px"
            :label="$t('BILLPAYMENT.MERCHANT_CATEGORY')+':'"
            prop="businessType"
          >
            <el-input v-model="form.businessType" :disabled="type==='edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label-width="414px"
            class="noMargin"
            :label="$t('BILLPAYMENT.MERCHANT_NAME')+':'"
            prop="name"
          >
            <el-input v-model="form.name" :disabled="type==='edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label-width="414px"
            :label="$t('BILLPAYMENT.BILL_TYPE')+':'"
            prop="accType"
            :rules="[{required:this.billTypeInfostatus,message: this.$t('BILLPAYMENT.PLEASE_ENTER_BILL'),trigger:'blur'}]"
          >
            <el-input v-model="form.accType" :disabled="type==='edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            class="noMargin"
            label-width="414px"
            :label="$t('BILLPAYMENT.BILL_NO')+':'"
            prop="phone"
          >
            <el-input v-model="form.phone" :disabled="type==='edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            class="noMargin"
            label-width="414px"
            :label="$t('BILLPAYMENT.TRANSACTION_AMOUNT')+':'"
            prop="money"
          >
            <div class="g-input">
              <el-input
                v-model="form.currency"
                :placeholder="$t('BILLPAYMENT.ALL')"
                :disabled="type==='edit'"
              ></el-input>
              <!-- <el-input v-model="form.money" style="padding-left:8px;width:160px;"></el-input> -->
              <money-input
                :isSaveDot="this.form.currency !== 'JPY'"
                v-model="form.money"
                :placeholder="$t('REMITTANCECONFIRM.PLEASE_ENTER_THE_AMOUNT')"
                style="padding-left:8px;width:160px;"
              ></money-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            class="noMargin"
            label-width="414px"
            :label="$t('BILLPAYMENT.PAYMENT_DATE')+':'"
            prop="paymentDate"
          >
            <el-date-picker
              :placeholder="$t('BILLPAYMENT.PLEASE_SELECT_THE_PAYMENT_DATE')"
              v-model="form.date"
              value-format="yyyyMMdd"
              format="yyyyMMdd"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 授权提醒 -->

    <div class="auth-check-box" v-if="statustpe">
      <auth-select
        :authInfo="authInfo"
        tradeType="060103"
        :amount="form.tranAmt"
        ref="authorizationSelect"
        labelWidth="160px"
        @checkClick="getAuthInfo"
      />
    </div>
    <div class="g-btns" style="padding-top: 43px;padding-right: 1px;">
      <v-button class="f-hasMargin" size="w160" @click="back">{{$t('BILLPAYMENT.BACK')}}</v-button>
      <v-button size="w160" type="primary" @click="next">{{$t('BILLPAYMENT.NEXT')}}</v-button>
    </div>
    <div class="m-tips-wrapper">
      <p class="tips head">{{ $t('BILLPAYMENT.TIPS') }}</p>
      <div class="u-tips-content">
        <p v-for="(item,index) in $t('BILLPAYMENT.SCHEDULED_PAYMENT_MANAGEMENT_TIPS')" :key="index">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import mathTools from '@/utils/mathTools.js';
import {
  checkMerchantBillNo,
  isHighRiskMerchant,
  orderPayDetails
} from '@/api/payService.js';
import { queryTranIsAuth } from '@/api/authorizeCenter';
import { transWrite } from '@bank-transfer/mixins';
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    chuangdate: {
      type: Object,
      default: () => {}
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [transWrite],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let oneDay = 180 * 24 * 3600 * 1000;
          let threeMonths = curDate + oneDay;
          return time.getTime() < Date.now() || time.getTime() > threeMonths;
        }
      },
      radio: '',
      statustpe: false,
      status: false,
      billTypeInfostatus: true,
      isInit: false,
      form: {
        date: '',
        billType: '',
        pay: '',
        name: '',
        businessType: '',
        accType: '',
        phone: '',
        money: '',
        paymentDate: '',
        currency: 'HKD',
        radio1: '',
        radio2: '',
        radio3: '',
        flowNo: '',
        merchantCode: '',
        riskFlag: '',
        merchantType: '',
        payone: ''
      },
      nameList: [{ value: 'AUD', label: 'AUD' }],
      businessTypeList: [{ value: 'AUD', label: 'AUD' }],
      accountTypeList: [{ value: 'AUD', label: 'AUD' }],
      formRules: {
        pay: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_ACCOUNT'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_NAME'),
            trigger: 'blur'
          }
        ],
        businessType: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_CATEGORY'),
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_BILL_NO'),
            trigger: 'blur'
          }
        ],

        money: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_AMOUNT'),
            trigger: 'blur'
          }
        ],
        date: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_SELECT_THE_PAYMENT_DATE'),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.demo();
    if (this.chuangdate.payAccount) {
      let paramsdetail = {
        id: this.chuangdate.flowNo,
        langFlag:
          localStorage.getItem('lang') == 'zh-CN'
            ? '0'
            : localStorage.getItem('lang') == 'zh-HK'
            ? '1'
            : '2'
      };
      orderPayDetails(paramsdetail).then(res => {
        this.form.pay = this.formatAccountNo(res.payAccount);
        this.form.payone = res.payAccount;
        this.form.businessType = res.merchantTypeInfo;
        this.form.merchantType = res.merchantType;
        this.form.name = res.merchantName;
        this.form.date = res.payDate;
        this.form.flowNo = res.flowNo;
        this.form.currency = res.currency;
        this.form.phone = res.billNo;
        this.form.accType = res.billTypeInfo;
        this.form.money = res.tranAmt + '';
        this.form.merchantCode = res.merchantCode;
        this.form.billType = res.billType;
        this.form.subscribeFlag = res.subscribeFlag;
      });

      if (this.form.accType) {
        this.billTypeInfostatus = true;
      } else {
        this.billTypeInfostatus = false;
      }
    } else {
      this.form = this.formData;
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler: function() {
        if (JSON.stringify(this.formData) == '{}') return;
        this.form = this.formData;
      }
    }
  },
  methods: {
    init() {},
    async demo() {
      //查询个人客户信息-判断是否需要授权
      const ressix = await queryTranIsAuth({ businessCode: '060103' });
      this.statustpe = ressix;
    },
    back() {
      this.$router.go(-1);
    },
    getAuthInfo(data) {
      console.log('授权信息', data);
      this.$set(this.form, 'authInfo', data);
      console.log('选择之后的授权人数据', this.form);
    },
    isHighRiskMerchant() {
      this.isInit = true;
      if (this.form.merchantType && this.form.merchantCode && this.form.phone) {
        let params = {
          merchantType: this.form.merchantType,
          merchantCode: this.form.merchantCode,
          billType: this.form.billType,
          billNo: this.form.phone
        };
        isHighRiskMerchant(params).then(res => {
          console.log('后端返回的数据', res);
          this.form.riskFlag = res;
          // this.isInit = false
          let params = {
            tranAmount: this.form.money,
            merchantCode: this.form.merchantCode,
            billType: this.form.billType,
            billNo: this.form.phone,
            subscribeFlag: this.form.subscribeFlag,
            account: this.form.payone,
            currency: this.form.currency
          };
          checkMerchantBillNo(params).then(resone => {
            if (resone && this.form.riskFlag) {
              this.$refs.form.validate(valid => {
                if (valid) {
                  this.$emit('next', this.form);
                }
              });
            }
          });
          this.isInit = false;
        });
      }
    },
    next() {
      this.isHighRiskMerchant();
    },
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-btns {
  display: flex;
  justify-content: center;
}
.f-hasMargin {
  margin-right: 24px;
}
.query {
  display: inline-block;
  margin-left: 8px;
  height: 24px;
  line-height: 32px;
  font-size: 14px;
  padding: 0 5px;
  border: 2px #eee solid;
  border-radius: 12px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
}
.u-dotted {
  float: left;
  width: 4px;
  height: 18px;
  background: #f06b00;
  margin-top: 3.5px;
}
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
.g-tip {
  height: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
  font-weight: 400;
  padding-left: 10px;
}
.g-input {
  /deep/.el-input--suffix {
    width: 152px;
  }
  /deep/.el-input__inner {
    width: 155px;
  }
  /deep/.el-input {
    width: auto;
  }
}
// /deep/.el-form .el-input {
//     width: 320px;
// }
/deep/.el-input {
  width: 320px;
}
/deep/.el-dialog__wrapper .el-dialog__body {
  overflow-y: auto;
  padding: 0 32px;
  height: 400px;
  line-height: normal;
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
</style>