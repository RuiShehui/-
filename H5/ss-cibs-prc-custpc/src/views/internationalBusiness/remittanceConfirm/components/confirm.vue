<!--
 * @Author: your name
 * @Date: 2021-12-04 15:34:41
 * @LastEditTime: 2022-10-24 17:13:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\internationalBusiness\remittanceConfirm\components\confirm.vue
-->
<template>
  <div class="g-confirm-wrapper" v-loading="isInit">
    <div class="g-confirm-wrapper__middle">
      <div class="m-head">{{$t('FOREXLISTPRICE.CUSTOMER_SELLSONE')}}</div>
      <div class="m-content">
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.CURRENCY')}}</div>
          <div class="m-content__item__right">{{form.saleCurrency}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.ACCOUNT')}}</div>
          <div class="m-content__item__right">{{formatAccountNo(form.saleAccount)}}</div>
        </div>
        <div class="m-content__item" style="margin-bottom: 24px;">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.ACCOUNT_NAME')}}</div>
          <div class="m-content__item__right">{{form.company}}</div>
        </div>
        <div class="m-content__item" style="margin-bottom: 24px;">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.AMOUNT')}}</div>
          <div class="m-content__item__right" style>{{form.saleMoneyone}}</div>
        </div>
      </div>
      <div class="m-head">{{$t('FOREXLISTPRICE.CUSTOMER_BUYSONE')}}</div>
      <div class="m-content">
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.CURRENCY')}}</div>
          <div class="m-content__item__right">{{form.buyCurrency}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.ACCOUNT')}}</div>
          <div class="m-content__item__right">{{formatAccountNo(form.buyAccount)}}</div>
        </div>
        <div class="m-content__item" style="margin-bottom: 24px;">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.ACCOUNT_NAME')}}</div>
          <div class="m-content__item__right">{{form.companyone}}</div>
        </div>
        <div class="m-content__item" style="margin-bottom: 24px;">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.AMOUNT')}}</div>
          <div class="m-content__item__right">
            {{form.buyMoneyone}}
            <span
              v-if="statusone"
              style="color:red"
            >({{$t('REMITTANCECONFIRM.AMOUNT_UPDATED')}})</span>
          </div>
        </div>
      </div>
      <div class="m-head">{{$t('REMITTANCECONFIRM.EXCHANGE_RATE')}}</div>
      <div class="m-content">
        <div class="m-content__item" style="margin-bottom: 24px;">
          <div class="m-content__item__left">{{$t('REMITTANCECONFIRM.CURRENCY_EXCHANGE')}}</div>
          <div
            class="m-content__item__right"
          >{{form.rateone}} ({{$t('REMITTANCECONFIRM.FOR_REFERENCE_ONLY')}})</div>
        </div>
      </div>
    </div>
    <div class="g-btns">
      <v-button size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
      <v-button
        size="w160"
        type="primary"
        class="u-confirm"
        @click="sure"
      >{{$t('COMMON.DETERMINE')}}</v-button>
    </div>
    <div class="g-confirm-wrapper__bottom">
      <div class="m-tips">{{$t('REMITTANCECONFIRM.TIPSONE')}}</div>
      <p>{{$t('REMITTANCECONFIRM.NOTEONE')}}</p>
    </div>
  </div>
</template>

<script>
import { currencyExchange } from '@/api/internationalBusiness.js';
import { currencyExchangeVerify } from '@/api/internationalBusiness.js';
import mathTools from '@/utils/mathTools.js';
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      status: true,
      statusone: false,
      isInit: false,
      accountNo: '12345',
      number: '',
      one: '',
      two: ''
    };
  },
  created() {},
  methods: {
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    back() {
      this.$emit('back');
    },
    async sure() {
      this.isInit = true;
      let params = {
        amountCredited: this.form.buystatus ? this.form.buyMoney : '',
        amountDebited: this.form.sellstatus ? this.form.saleMoney : '',
        creditAcctNo: this.form.buyaccountNo,
        creditCurrency: this.form.buyCurrency,
        debitAcctNo: this.form.saleaccountNo,
        debitCurrency: this.form.saleCurrency,
        customerRate: this.form.rate,
        creditAccountType: '',
        debitAccountType: ''
      };
      const resthree = await currencyExchangeVerify(params);
      if (resthree == null) {
        this.isInit = false;
      } else {
        if (this.form.rate != resthree.customerRate) {
          this.form.buyMoney = this.form.buyMoney;
          this.form.rate = resthree.customerRate;
          this.form.rateone =
            this.form.one + '=' + this.form.rate + this.form.two;
          let arr = resthree.amountCredited;
          var wrr = arr.toString();
          resthree.amountCredited = mathTools.moneyCheck(wrr);
          this.form.buyMoneyone =
            this.form.buyCurrency + resthree.amountCredited;
          this.statusone = true;
          this.isInit = false;
        } else {
          this.submitData();
        }
      }
    },
    async submitData(confirm = 'false') {
      let paramsone = {
        confirm,
        amountCredited: this.form.buystatus ? this.form.buyMoney : '',
        amountDebited: this.form.sellstatus ? this.form.saleMoney : '',
        creditAcctNo: this.form.buyaccountNo,
        creditCurrency: this.form.buyCurrency,
        debitAcctNo: this.form.saleaccountNo,
        debitCurrency: this.form.saleCurrency,
        customerRate: this.form.rate,
        creditAccountType: this.form.buyaccountType,
        debitAccountType: this.form.saleaccountType,
        creditAcctName: this.form.company,
        debitAcctName: this.form.companyone
      };
      const result = await currencyExchange(paramsone);
      if (result.head.returnCode == 'COC009970') {
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
            this.submitData('true');
          })
          .catch(() => {
            this.isComit = false;
            this.isInit = false;
          });
      } else if (result.body == null) {
        this.isInit = false;
      } else {
        let arr = {};
        arr = result.body.authResultInfo;
        this.number = arr.flowNo;
        if (this.number) {
          this.isInit = false;
        }
        this.$emit('sure', arr);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-confirm-wrapper {
  &__top {
    display: flex;
    justify-content: center;
    align-items: center;
    .left,
    .right {
      width: 250px;
      height: 144px;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      margin-top: 54px;
      float: left;
    }
    .left {
      margin-left: 87px;
      padding-left: 24px;
    }
    .right {
      margin-right: 87px;
      padding-left: 24px;
    }
    .name {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      margin-top: 24px;
      line-height: 20px;
    }
    .accountNo {
      font-size: 16px;
      color: #333333;
      line-height: 16px;
      margin-top: 12px;
    }
    .accountName {
      font-size: 12px;
      line-height: 16px;
      color: #333333;
      margin-top: 12px;
    }
    .middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 144px;
      width: 180px;
      margin-top: 54px;
      padding: 0 30px;
      .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .top-left,
        .top-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          .currency {
            font-size: 14px;
            color: #999999;
          }
          .money {
            font-size: 16px;
            color: #f57e00;
            line-height: 20px;
            font-weight: 600;
          }
          .big {
            font-size: 12px;
            color: #333333;
            line-height: 16px;
            font-weight: 600;
          }
        }
      }
      .bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
          font-size: 12px;
          line-height: 16px;
        }
      }
    }
  }
  &__middle {
    .middle-content {
      .middle-content-item {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-top: 36px;
        div {
          flex: 50%;
          display: flex;
          span {
            font-weight: 500;
          }
          span:first-child {
            color: #999999;
            width: 56px;
            text-align: right;
            font-size: 14px;
            margin-right: 10px;
            margin-left: 124px;
          }
        }
      }
    }
  }
  &__bottom {
    margin-top: 36px;
    .m-tips {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 16px;
    }
    p {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
.g-btns {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
.m-head {
  color: rgba(0, 0, 0, 0.85);
  font-size: 18px;
  padding-left: 16px;
  border-left: 4px solid #f06b00;
}
.g-confirm-wrapper__middle {
  // margin-top: 24px;
  .m-content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    color: pink;
    margin-top: 20px;
    &__item {
      width: 50%;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      height: 22px;
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
      .status {
        color: #f06b00;
      }
    }
  }
}
.u-confirm {
  margin-left: 24px;
}
</style>