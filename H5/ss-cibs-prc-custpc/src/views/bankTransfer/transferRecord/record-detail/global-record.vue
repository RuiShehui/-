<template>
  <div class="g-card-detail-wrapper g-remittance-confirmInfo">
    <!-- 付款人信息 -->
    <divider :title="$t('PAYMENT.PAYER_INFO')" />
    <div class="m-confirmlist">
      <!-- 付款账户  :content="acctFormat(detailData.debitAcct,detailData.debitCcy,detailData.debitAcctType)"-->
      <detail-item
        :title="$t('PAYMENT.PAYMENT_ACCOUNT')"
        :content="acctFormat(detailData.debitAcct,detailData.debitCcy,detailData.debitAcctType)"
      ></detail-item>
      <!-- 账户名称 -->
      <detail-item :title="$t('PAYMENT.ACCOUNT_NAME')" :content="detailData.debitAcctName"></detail-item>
      <!-- 费用支付方式 -->
      <detail-item
        :title="$t('PAYMENT.PAYMENT_METHOD')"
        :content="detailData.chargePayWay | processPayType"
      ></detail-item>
      <!-- 费用扣款账户 acctFormat(detailData.chargeAcct,detailData.chargeCcy,detailData.chargeAcctType)-->
      <detail-item
        v-if="detailData.chargePayWay !=='BEN'"
        :title="$t('PAYMENT.FEE_DEBIT_ACCOUNT')"
        :content="acctFormat(detailData.chargeAcct,detailData.chargeCcy,detailData.chargeAcctType)"
      ></detail-item>
      <template v-if="detailData.chargePayWay !=='BEN'">
        <!-- 手续费 -->
        <detail-item
          :title="$t('PAYMENT.CHARGE_CCY')"
          :content="`${detailData.chargeCcy} ${String(detailData.chargeAmt).toMoney()}`"
        ></detail-item>
        <!-- 电报费 -->
        <detail-item :title="$t('PAYMENT.ELEC_FEE')" :content="`HKD ${detailData.commissionAmt}`"></detail-item>
      </template>

      <!-- 银行代理费 -->
      <detail-item
        v-if="detailData.chargePayWay === 'OUR' && this.isShowFee"
        :title="$t('PAYMENT.BANK_PROXY_FEE')"
        :content="`${detailData.ccy} ${
                detailData.ccy === 'USD'
                  ? '28.00'
                  : detailData.ccy === 'CAD'
                  ? '15.00'
                  : detailData.ccy === 'GBP'
                  ? '8.00'
                  : detailData.ccy === 'AUD'
                  ? '15.00'
                  : detailData.ccy === 'EUR'
                  ? '15.00'
                  : '0.00'
              }`"
      ></detail-item>
      <!-- </div> -->
      <detail-item
        :title="$t('PAYMENT.APPOINTMENT_PROCESS')"
        :content="detailData.isScheduleTx | yesOrNo"
      />
      <!-- 预约处理日期 -->
      <detail-item
        :title="$t('PAYMENT.RESPOS_HANDLE_DATE')"
        v-if="detailData.isScheduleTx === 'Y'"
        :content="detailData.sendTime | filterLinkTime"
      />
      <!-- 重试扣账 -->
      <!-- <detail-item
        title="重试扣账"
        v-if="detailData.isScheduleTx === 'Y'"
        :content="detailData.isRetry | yesOrNo"
      />-->
    </div>
    <!-- 收款人信息 -->
    <divider :title="$t('PAYMENT.PAYEE_INFO')" />
    <div class="m-confirmlist">
      <!-- 收款人类型 -->
      <detail-item
        :title="$t('PAYMENT.PAYEE_TYPE')"
        :content="detailData.creditorType | processCreditType"
      ></detail-item>
      <!-- 收款人名称 -->
      <detail-item :title="$t('PAYMENT.PAYEE_NAME')" :content="detailData.creditAcctName"></detail-item>
      <!-- 国家/地区 -->
      <detail-item
        :title="$t('PAYMENT.RECEIVER_COUNTRY')"
        :content="detailData.creditRegion | filterCountry"
      ></detail-item>
      <!-- 地址 -->
      <detail-item :title="$t('PAYMENT.RECEIVER_ADDRESS')" :content="detailData.creditAddress"></detail-item>

      <!-- 账户号码 -->
      <detail-item :title="$t('PAYMENT.ACCT_NO_OR_IBAN')" :content="detailData.creditAcct"></detail-item>
      <template v-if="detailData.chargePayWay === 'BEN'">
        <!-- 手续费 -->
        <detail-item
          :title="$t('PAYMENT.CHARGE_CCY')"
          :content="`${detailData.chargeCcy} ${String(detailData.chargeAmt).toMoney()}`"
        ></detail-item>
        <!-- 电报费 -->
        <detail-item :title="$t('PAYMENT.ELEC_FEE')" :content="`HKD ${detailData.commissionAmt}`"></detail-item>
      </template>
    </div>
    <!-- 收款银行信息 -->
    <divider :title="$t('PAYMENT.RECEIVE_BANK_INFO')" />
    <div class="m-confirmlist">
      <!-- Swift code -->
      <detail-item v-if="detailData.swiftCode" title="SWIFT Code" :content="detailData.swiftCode"></detail-item>
      <!-- 国家地区 -->
      <detail-item
        :title="$t('PAYMENT.PAYEE_COUNTRY_CODE')"
        :content="detailData.creditBankRegion | filterCountry"
      />
      <!-- 银行地址 -->
      <detail-item :title="$t('PAYMENT.BANK_ADDRESS')" :content="detailData.creditBankAddress"></detail-item>
      <!-- 银行名称 -->
      <detail-item :title="$t('PAYMENT.BANK_NAME')" :content="detailData.creditBankName"></detail-item>
      <!-- 附加字段 -->
      <detail-item
        v-if="['US','AU','CA','GB'].includes(detailData.creditBankRegion)"
        :title="codeName"
        :content="detailData.creditBankCode"
      ></detail-item>
      <!-- 汇款目的代码 -->
      <detail-item
        v-if="detailData.ttPurposeCode && detailData.ccy==='CNY' && detailData.creditBankRegion==='CN' "
        :title="$t('AUTHORIZE.ttPurposeCode')"
        :content="ttPurposeCodeFilter(detailData.ttPurposeCode)"
      ></detail-item>
      <!-- 金额 -->
      <detail-item
        :title="$t('PAYMENT.PAYEE_AMOUNT')"
        :content="`${detailData.creditCcy} ${String(detailData.amount).toMoney()}`"
      ></detail-item>
      <!-- 附言（致收款人） -->
      <detail-item :title="$t('PAYMENT.POSTSCRIPT')" :content="detailData.additionalComment"></detail-item>
      <!-- 登记此账户 -->
      <detail-item
        :title="$t('PAYMENT.IS_REGISTERED')"
        :content="detailData.isRegistry === 'N'? $t('COMMON.NO') : $t('COMMON.YES')"
      ></detail-item>
    </div>
  </div>
</template>

<script>
import ccyTool from '@/filters/accountManagement';
import { otpDialog } from '@/components/messageBox';
import filters from '@/filters/public';
import acFilters from '@/filters/accountManagement';
import {
  getIdentifyWay,
  getCreditTypeLabel
} from '@bank-transfer/utils/function';
import { confirm } from '@bank-transfer/mixins';

export default {
  name: 'GlobalRecord',
  mixins: [confirm],
  props: {
    detailItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    codeName() {
      switch (this.detailData.bankCodeType) {
        case 'SC':
          return 'SORT Code';
        case 'CU':
          return 'CHIPS UID';
        case 'FN':
          return 'Fedwire No./ABA No.';
        case 'TC':
          return 'Transit Code';
        case 'BN':
          return 'BSB No.';
        default:
          return '';
      }
    }
  },
  filters: {
    ...filters,
    ...acFilters,
    formatBankNo:filters.formatBankNo,
    filtersType:filters.filtersType,
    getCreditTypeLabel,
    getIdentifyWay
  },
  data() {
    return {
      detailData: {},
      isShowFee: false
    };
  },
  created() {
    this.detailData = this.detailItem;
    console.log(
      'this.detailData----------------------------->详情页',
      this.detailData
    );
    if (
      this.detailData.ccy === 'USD' ||
      this.detailData.ccy === 'CAD' ||
      this.detailData.ccy === 'GBP' ||
      this.detailData.ccy === 'AUD' ||
      this.detailData.ccy === 'EUR'
    ) {
      this.isShowFee = true;
    } else this.isShowFee = false;
  },
  methods: {
    accountFormat(val){
      return filters.formatBankNo(val)
    },
    getType(val,cur){
      return filters.filtersType(val,cur)
    },
    ttPurposeCodeFilter(val) {
      switch (val) {
        case 'GT':
          return this.$t('PAYMENT.GOODS_TRADE');
        case 'ST':
          return this.$t('PAYMENT.SERVICE_TRADE');
        case 'CT':
          return this.$t('PAYMENT.CAPITAL_TRANSFER');
        case 'CAT':
          return this.$t('PAYMENT.CURRENT_ACCOUNT_TRANSCATION');
        case 'CD':
          return this.$t('PAYMENT.CHARITY_DONATION');
        default:
          return val;
      }
    },
    opFilter(val) {
      switch (val) {
        case '0':
          return '修改';
        case '1':
          return '取消';
        default:
          return '';
      }
    },
    acctFormat(val, ccy, type) {
      let str = val;
      if (val) {
        str = `${val.slice(0, 3)}-${val.slice(3, 5)}-${val.slice(
          5
        )} ${ccyTool.ccyFilter(ccy)} ${this.$options.filters['accountType'](
          type
        )}`;
      }
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.g-card-detail-wrapper {
  .m-head {
    border-left: 4px solid #f06b00;
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
    padding-left: 12px;
    margin-bottom: 20px;
  }
  &__top {
    display: flex;
    justify-content: center;
    .m-left,
    .m-right {
      width: 300px;
      height: 160px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      float: left;
      position: relative;
      background-image: url('~@/images/authorizeCenter/banklogo.png');
      background-position: right bottom;
      background-size: 132px 95px;
      background-repeat: no-repeat;
      .u-flag {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 24px;
        background-color: #fdf0e5;
        border-radius: 4px;
        font-size: 12px;
        color: #f06b00;
        line-height: 24px;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 87px;
      padding-left: 24px;
    }
    .m-right {
      margin-right: 87px;
      padding-left: 24px;
    }
    .u-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 4px;
      line-height: 20px;
    }
    .u-accountNo,
    .u-accountName {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 500;
    }
    .u-bankName {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 14px;
    }
    .m-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 200px;
      padding: 0 40px;
      text-align: center;
      .u-currency {
        margin-top: 40.5px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 700;
      }
      img {
        width: 200px;
      }
      // .u-money {
      //   font-size: 12px;
      //   color: rgba(0, 0, 0, 0.65);
      //   line-height: 20px;
      //   margin-top: 4px;
      // }
    }
  }
  &__middle {
    margin-top: 36px;
    .u-content {
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
  &__bottom {
    background-color: #f7f7f7;
    padding: 20px 0 0 62px;
    margin-bottom: 27px;
  }
}
// .u-bg-logo {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   height: 95px;
//   width: 132px;
//   z-index: 0;
// }
.submitter {
  display: flex;
  flex-direction: column;
  .people,
  .date {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .people {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}
.u-name,
.wait,
.agree,
.refuse {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.wait {
  #name {
    display: inline-block;
    margin-right: 14px;
  }
}
.agree {
  color: #f06b00;
}
.refuse {
  color: #f23f47;
}
.opinion {
  height: 66px;
  font-size: 14px;
  line-height: 22px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.reset {
  margin-left: 24px;
}
.people {
  width: 200px;
}
::v-deep .el-steps--horizontal {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
::v-deep .el-step {
  width: 20%;
}
::v-deep .el-step.is-horizontal .el-step__line {
  width: 95%;
}
.showDetail {
  display: flex;
  flex-wrap: wrap;
  margin-left: 36px;
  margin-top: 28px;
  div {
    margin-top: 8px;
  }
  div:nth-of-type(2n) {
    margin-left: 70px;
  }
  div:last-child {
    color: #f06b00;
  }
}
.g-remittance-confirmInfo {
  .divider {
    margin: 8px 0 20px;
  }
  .m-confirmlist {
    width: 940px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    flex-wrap: wrap;
    .detailItem {
      margin-bottom: 16px;
      &:nth-child(2n) {
        margin-left: 52px;
      }
    }
  }
}
</style>
