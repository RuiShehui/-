<template>
  <div class="g-info-confirm-wrapper">
    <div class="g-payInfo-confirm-wrapper__middle">
      <div class="m-content">
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.PAYEE_NICKNAME')}}</div>
          <div class="m-content__item__right">{{form.alias}}</div>
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
          <div class="m-content__item__right">{{form.billTypeInfo}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('BILLPAYMENT.BILL_NO')}}</div>
          <div class="m-content__item__right">{{form.phone}}</div>
        </div>
      </div>
      <div class="g-btns">
        <v-button class="f-hasMargin" size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
        <v-button size="w160" @click="confirm" type="primary">{{$t('BILLPAYMENT.SURE')}}</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateMyMerchantSubmit } from '@/api/payService.js';
import { saveMyMerchantSubmit } from '@/api/payService.js';
import {softToken } from '@/components/messageBox';
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['scrollToTop','entType', 'sendEmail'],
  data() {
    return {};
  },
  created() {},
  methods: {
    back() {
      this.$emit('back');
    },
    async confirm() {
      let params = {
        billCode: this.form.billCode,
        billNo: this.form.phone,
        billType: this.form.billType,
        billTypeInfo:this.form.billTypeInfo,
        merchantAlias: this.form.alias,
        merchantName: this.form.name,
        merchantCode:this.form.mertchantCode,
        merchantType: this.form.mertchartTypeCode,
        merchantTypeInfo:this.form.businessType
      };
      console.log(this.form,'form')
      if (this.form.status == 'edit') {
          updateMyMerchantSubmit(params).then(({body={},head={}},) => {
          if(head.returnCode == "OTP000107"){
          const tradeInfo = JSON.stringify({...params, type: '2'})
          softToken({
                  softTokenCode:'',
                  otpType:'060102',
                  tradeInfo:tradeInfo
                  
                }).then(() => {
                  this.confirm()
                
              });
        }
        if(body){
          this.sendEmail(this.form)
          this.$emit('sure', body.authResultInfo);
        }
        })
        
      } else {
        saveMyMerchantSubmit(params).then(({body={},head={}},) => {
          if(head.returnCode == "OTP000107"){
          const tradeInfo = JSON.stringify({...params, type: '1'})
          softToken({
                  softTokenCode:'',
                  otpType:'060102',
                  tradeInfo:tradeInfo
                  
                }).then(() => {
                  this.confirm()
                
              });
        }
        if(body){
          this.$emit('sure', body.authResultInfo);
        }
        })
        
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.g-payInfo-confirm-wrapper {
  &__middle {
    margin-top: 36px;
    .m-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      margin-top: 36px;
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
}
.f-hasMargin {
  margin-right: 24px;
}
</style>