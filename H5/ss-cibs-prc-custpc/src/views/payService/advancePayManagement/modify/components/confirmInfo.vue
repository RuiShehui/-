<template>
  <div class="g-payInfo-confirm-wrapper" v-loading="isInit">
    <div class="g-payInfo-confirm-wrapper__middle">
      <div class="m-content">
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.FROM_ACCOUNT')}}</div>
          <div class="m-content__item__right">{{form.pay}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.MERCHANT_CATEGORY')}}</div>
          <div class="m-content__item__right">{{form.businessType}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.MERCHANT_NAME')}}</div>
          <div class="m-content__item__right">{{form.name}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.BILL_TYPE')}}</div>
          <div class="m-content__item__right">{{form.accType}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.BILL_NO')}}</div>
          <div class="m-content__item__right">{{form.phone}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.TRANSACTION_AMOUNT')}}</div>
          <div class="m-content__item__right">{{moneyone}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.PAYMENT_DATE')}}</div>
          <div class="m-content__item__right">{{form.date}}</div>
        </div>
        <!-- <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.A_LEVEL_AUTHORIZED_PERSON')}}</div>
          <div class="m-content__item__right">{{$t('AUTHORIZE.YES')}}</div>
        </div> -->
      </div>
      <div class="g-btns" style="margin-top:20px">
        <v-button class="f-hasMargin" size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
        <v-button size="w160" @click="sure" type="primary">{{$t('BILLPAYMENT.SURE')}}</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { update } from '@/api/payService.js';
import {softToken,choosesWay } from '@/components/messageBox';
import mathTools from '@/utils/mathTools.js';
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  data() {
    return {
      number: {},
      isInit: false,
      moneyone:"",
    };
  },
  created(){
    this.moneyone = String(this.form.money).toMoney();
    let brr = this.moneyone.toString();
    this.moneyone = mathTools.moneyCheck(brr);
  },
  methods: {
    back() {
      this.$emit('back');
    },
    async sure() {
      this.isInit = true;
      let params = {
        authReqInfo: {
          authActionMessage: '',
          authActionType: '',
          bsnCode: '',
          cstmNo: '',
          expiration: '',
          feeAccount: '',
          flowNo: '',
          opType: '',
          payAccount: '',
          totalNum: '',
          transAmount: 0,
          transDetail: '',
          userCode: '',
          userLevel: '',
          userName: ''
        },
        billCode: '',
        merchartType:this.form.merchantType,
        merchartCode:this.form.merchantCode,
        billType:this.form.billType,
        current: 0,
        custNo: '',
        flowNo: this.form.flowNo,
        billNo:this.form.phone,
        payAmt: this.form.money,
        payDate: this.form.date,
        payAccount:this.form.payone,
        currency:this.form.currency,
        queryEndDate: '',
        queryStartDate: '',
        riskFlag: this.form.riskFlag,
        size: 0,
        userCode: ''
      };
      console.log('授权接口参数', params);
      const {cuSoleAuthorizerInd } = JSON.parse(sessionStorage.getItem('userInfo'));
      update(params).then(({body={},head={}},) => {
        if(head.returnCode == "OTP000107" && this.form.riskFlag == '1'){
          const tradeInfo = JSON.stringify(params)
          softToken({
                  softTokenCode:'',
                  otpType:'060103',
                  tradeInfo:tradeInfo
                }).then(() => {
                  this.sure();
              });
        } else if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1' && this.form.riskFlag == '1') {
        const tradeInfo = JSON.stringify(params)
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo
            
          }).then(() => {
            this.sure();
          });
        }
        if (body == null) {
          this.isInit = false;
        }
        if(body){
        this.number = body.authResultInfo;
        this.sendEmail(this.form)
        this.$emit('sure', this.number);
        this.isInit = false;
        }
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
      margin-top: 12px;
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
          // margin-left: 82px;
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
}
.f-hasMargin {
  margin-right: 24px;
}
</style>