<template>
  <div class="g-payInfo-confirm-wrapper">
    <div class="g-payInfo-confirm-wrapper__middle">
      <div class="m-content">
        <!-- 付款账户 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.FROM_ACCOUNT') }}</div>
          <div class="m-content__item__right">{{ formatAccountNo(form.payAccount) }}</div>
        </div>
        <!-- 商户类别 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.MERCHANT_CATEGORY') }}</div>
          <div class="m-content__item__right">{{ form.merchantTypeInfo }}</div>
        </div>
        <!-- 商户名称 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.MERCHANT_NAME') }}</div>
          <div class="m-content__item__right">{{ form.merchantName }}</div>
        </div>
        <!-- 账单类别 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.BILL_TYPE') }}</div>
          <div class="m-content__item__right">{{ form.billTypeInfo }}</div>
        </div>
        <!-- 账单号码 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.BILL_NO') }}</div>
          <div class="m-content__item__right">{{ form.billNo }}</div>
        </div>
        <!-- 交易金额 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.TRANSACTION_AMOUNT') }}</div>
          <div class="m-content__item__right">{{ form.currency }} {{ tranAmtone }}</div>
        </div>
        <!-- 预约处理日期 -->
        <div class="m-content__item" v-if="form.subscribeFlag">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.PAYMENT_DATE') }}</div>
          <div class="m-content__item__right">{{ form.payDate }}</div>
        </div>
        <!-- 是否加入我的商户清单标识 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.SAVE_TO_MY_PAYEE_LIST') }}</div>
          <div class="m-content__item__right">{{ form.addMerchantFlag?$t('AUTHORIZE.YES'):$t('AUTHORIZE.NO') }}</div>
        </div>
        <!-- 商户别名 -->
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.PAYEE_NICKNAME') }}</div>
          <div class="m-content__item__right">{{ form.merchantAlias }}</div>
        </div>
        <!-- A级授权人 -->
        <div class="m-content__item" v-if="this.form.list">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.A_LEVEL_AUTHORIZED_PERSON') }}</div>
          <div class="m-content__item__right">{{ 'peopleA' }}</div>
        </div>
        <!-- B级授权人 -->
        <div class="m-content__item" v-if="this.form.list">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.B_LEVEL_AUTHORIZED_PERSON') }}</div>
          <div class="m-content__item__right">{{ 'peopleB' }}</div>
        </div>
        <!-- C级授权人 -->
        <div class="m-content__item" v-if="this.form.list">
          <div class="m-content__item__left">{{ $t('BILLPAYMENT.C_LEVEL_AUTHORIZED_PERSON') }}</div>
          <div class="m-content__item__right">{{ 'peopleC' }}</div>
        </div>
      </div>
      <div class="g-btns">
        <v-button class="f-hasMargin" size="w160" @click="back">{{ $t('COMMON.PREVIOUS_STEP') }}</v-button>
        <v-button size="w160" @click="submitData" type="primary">{{ $t('BILLPAYMENT.SURE') }}</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { orderPayConfirmStep } from '@/api/payService.js';
import { sendEmail } from '@/api/sendMsg';
import { softToken, choosesWay } from '@/components/messageBox';
import mathTools from '@/utils/mathTools.js';
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  created() {
    this.tranAmtone = this.moneyFormat(this.form.tranAmt);
  },
  data() {
    return {
      account: '',
      tranAmtone: ''
    };
  },
  methods: {
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    //金额格式化
    moneyFormat(val){
      let arr = String(val).toMoney();
      let brr = arr.toString();
      return mathTools.moneyCheck(brr);
    },
    back() {
      this.$emit('back');
    },
    async submitData() {
      const { adminEmpower,cuSoleAuthorizerInd,entType } = JSON.parse(sessionStorage.getItem('userInfo'));

      let params = {
        ...this.form,
        subscribeFlag: this.form.subscribeFlag ? '1' : '0',
        addMerchantFlag: this.form.addMerchantFlag ? '1' : '0',
        list: [
          {
            level: 'A',
            list: [
              {
                name: 'testA1'
              },
              {
                name: 'testA2'
              }
            ]
          }
        ]
      };
      orderPayConfirmStep(params).then(({body={},head={}},) => {
        if(head.returnCode == "OTP000107" && params.riskFlag == '1' && entType == '1'){
        const tradeInfo = JSON.stringify(params)
        softToken({
                softTokenCode:'',
                otpType:'060101',
                tradeInfo:tradeInfo
                
              }).then(() => {
                this.submitData()
              
            });
      } else if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1' && params.riskFlag == '1') {
        const tradeInfo = JSON.stringify(params)
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo
            
          }).then(() => {
             this.submitData()
            
          });
        }
        if (body) this.sendEmail(this.form);
        this.$emit('sure', body.authResultInfo);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.g-payInfo-confirm-wrapper {
  &__middle {
    margin-top: 12px;
    .m-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      
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
          
        }
        &__right {
          flex: 1;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          line-height: 22px;
          margin-left: 24px;
        }
      }
    }
  }
}
.g-btns {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
.f-hasMargin {
  margin-right: 24px;
}
/deep/.mb24 {
  margin-bottom: 0px;
}
</style>