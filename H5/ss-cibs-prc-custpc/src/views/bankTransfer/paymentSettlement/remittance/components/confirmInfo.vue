<!--电汇-信息确认-->
<template>
  <div class="g-remittance-confirmInfo">
    <div class="pdf-wrapper" ref="pdf">
      <!-- 付款人信息 -->
      <divider :title="$t('PAYMENT.PAYER_INFO')" />
      <div class="m-confirmlist">
        <!-- 付款账户 -->
        <detail-item
          :title="$t('PAYMENT.PAYMENT_ACCOUNT')"
          :content="
            `${formatAcctNo(confirmData.debitAcct)} ${
              ccyFilter(confirmData.debitCcy)
            } ${getProcessType(confirmData.debitAcctLabel)}`
          "
        ></detail-item>
        <!-- 账户名称 -->
        <detail-item :title="$t('PAYMENT.ACCOUNT_NAME')" :content="confirmData.debitAcctName"></detail-item>
        <!-- 手续费-费用支付方式 -->
        <detail-item
          :title="$t('PAYMENT.PAYMENT_METHOD')"
          :content="confirmData.chargePayWay | processPayType"
        ></detail-item>
        <!-- 费用扣款账户 -->
        <detail-item
          v-show="confirmData.chargePayWay !== 'BEN' "
          :title="$t('PAYMENT.FEE_DEBIT_ACCOUNT')"
          :content="
            `${formatAcctNo(confirmData.chargeAcct)} ${
              ccyFilter(confirmData.chargeCcy)
            } ${getProcessType(confirmData.deductAcctType)}`
          "
        />
        <template v-if="confirmData.chargePayWay !== 'BEN'">
          <!-- 手续费 -->
          <detail-item
            :title="$t('PAYMENT.CHARGE_CCY')"
            :content="`${confirmData.chargeCcy} ${confirmData.chargeAmount}`"
          />
          <!-- 电报费 -->
          <detail-item
            :title="$t('PAYMENT.ELEC_FEE')"
            :content="`HKD ${confirmData.commissionAmt}`"
          />
        </template>
        <!-- 银行代理费 -->
        <detail-item
          v-show="confirmData.chargePayWay === 'OUR' && (
      confirmData.ccy === 'USD' ||
      confirmData.ccy === 'CAD' ||
      confirmData.ccy === 'GBP' ||
      confirmData.ccy === 'AUD' ||
      confirmData.ccy === 'EUR'
    )"
          :title="$t('PAYMENT.BANK_PROXY_FEE')"
          :content="
              `${confirmData.ccy} ${
                confirmData.ccy === 'USD'
                  ? '28.00'
                  : confirmData.ccy === 'CAD'
                  ? '15.00'
                  : confirmData.ccy === 'GBP'
                  ? '8.00'
                  : confirmData.ccy === 'AUD'
                  ? '15.00'
                  : confirmData.ccy === 'EUR'
                  ? '15.00'
                  : '0.00'
              }`
            "
        />
        <!-- 预约处理日期 -->
        <detail-item
          v-show="confirmData.isScheduleTx === 'Y'"
          :title="$t('PAYMENT.APPOINTMENT_DATE')"
          :content="confirmData.scheduleDate"
        ></detail-item>
        <!-- 重试扣账 -->
        <!-- <detail-item :title="$t('PAYMENT.RETRY_DEDUCTION')" :content="'是'"></detail-item> -->
      </div>

      <!-- 收款人信息 -->
      <divider :title="$t('PAYMENT.PAYEE_INFO')" />
      <div class="m-confirmlist">
        <detail-item
          :title="$t('PAYMENT.PAYEE_TYPE')"
          :content="confirmData.creditorType | processCreditType"
        />
        <detail-item :title="$t('PAYMENT.PAYEE_NAME')" :content="confirmData.creditAcctName" />
        <detail-item
          :title="$t('PAYMENT.RECEIVER_COUNTRY')"
          :content="confirmData.creditRegion | filterCountry"
        />
        <detail-item :title="$t('PAYMENT.RECEIVER_ADDRESS')" :content="confirmData.creditAddress" />

        <detail-item :title="$t('PAYMENT.ACCT_NO_OR_IBAN')" :content="confirmData.creditAcct" />
        <template v-if="confirmData.chargePayWay === 'BEN'">
          <!-- 手续费 -->
          <detail-item
            :title="$t('PAYMENT.CHARGE_CCY')"
            :content="`${confirmData.chargeCcy} ${confirmData.chargeAmount}`"
          />
          <!-- 电报费 -->
          <detail-item
            :title="$t('PAYMENT.ELEC_FEE')"
            :content="`HKD ${confirmData.commissionAmt}`"
          />
        </template>
      </div>

      <!-- 收款银行信息 -->
      <divider :title="$t('PAYMENT.RECEIVE_BANK_INFO')" />
      <div class="m-confirmlist">
        <detail-item
          v-if="confirmData.isSwiftCode"
          :title="'SWIFT Code'"
          :content="confirmData.swiftCode"
        ></detail-item>

        <detail-item
          :title="$t('PAYMENT.PAYEE_COUNTRY_CODE')"
          :content="confirmData.creditBankRegion | filterCountry"
        />
        <detail-item :title="$t('PAYMENT.BANK_ADDRESS')" :content="confirmData.creditBankAddress"></detail-item>
        <detail-item :title="$t('PAYMENT.BANK_NAME')" :content="confirmData.creditBankName"></detail-item>
        <template
          v-if="
            confirmData.ccy === 'CNY' && confirmData.creditBankRegion === 'CN'
          "
        >
          <detail-item
            :title="$t('PAYMENT.TT_PURPOSE_CODE')"
            :content="
              chinaTTList.some(item => item.value === confirmData.ttPurposeCode)
                ? chinaTTList.find(
                    item => item.value === confirmData.ttPurposeCode
                  ).label
                : ''
            "
          />
        </template>
        <template v-if="['US', 'GB', 'CA', 'AU'].includes(confirmData.creditBankRegion)">
          <template>
            <detail-item
              v-if="confirmData.creditBankRegion === 'US'"
              :title="confirmData.bankCodeType | filterBankCode"
              :content="confirmData.creditBankCode"
            />
            <detail-item
              v-else
              :title="confirmData.creditBankRegion | filterBankCode"
              :content="confirmData.creditBankCode"
            />
          </template>
        </template>
        <!-- 汇款金额 -->
        <detail-item
          :title="$t('PAYMENT.PAYEE_AMOUNT')"
          :content="`${confirmData.ccy} ${confirmData.amount}`"
        ></detail-item>
        <!-- confirmData.locAmtCredited -->
        <!-- 附言（致收款人） -->
        <detail-item :title="$t('PAYMENT.POSTSCRIPT')" :content="confirmData.additionalComment"></detail-item>
        <!-- 登记此账户 -->
        <detail-item
          :title="$t('PAYMENT.IS_REGISTERED')"
          :content="
            confirmData.isRegistry === 'Y' ? $t('COMMON.YES') : $t('COMMON.NO')
          "
        />
        <!-- 备注 -->
        <!-- <detail-item :title="$t('PAYMENT.REMARKS')" :content="confirmData.remark"></detail-item> -->
        <!-- 授权人列表 -->
        <!-- <template v-if="authInfo && authInfo.AlevelList">
          <detail-item
            v-if="authInfo.AlevelList.length > 0"
            :title="$t('PAYMENT.A_LEVEL_AUTHOR')"
            :content="authInfo.AlevelList | getAuthName"
          />
          <detail-item
            v-if="authInfo.BlevelList.length > 0"
            :title="$t('PAYMENT.B_LEVEL_AUTHOR')"
            :content="authInfo.BlevelList | getAuthName"
          />
          <detail-item
            v-if="authInfo.ClevelList.length > 0"
            :title="$t('PAYMENT.C_LEVEL_AUTHOR')"
            :content="authInfo.ClevelList | getAuthName"
          />
        </template>-->
        <!-- <detail-item title="A级授权人" :content="'******'"></detail-item> -->
      </div>
    </div>
    <div class="flexc mt20">
      <!-- 上一步 -->
      <v-button @click="$emit('back')" class="mr16">{{ $t('COMMON.PREVIOUS_STEP') }}</v-button>
      <!-- 确定 -->
      <v-button type="primary" @click="onConfirm">{{ $t('COMMON.DETERMINE') }}</v-button>
    </div>
  </div>
</template>

<script>
import { confirm } from '@bank-transfer/mixins';

export default {
  components: {},
  mixins: [confirm],
  methods: {
    onConfirm() {
      this.$emit('next');
    }
  }
};
</script>

<style lang="scss" scoped>
.g-remittance-confirmInfo {
  width: 100%;
  height: 100%;
}

.pdf-wrapper {
  // width: 1050px;
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

.detailItem {
  box-sizing: border-box;
  padding: 8px 0 0;

  .itemContent {
    display: flex;
    .itemLeft,
    .itemRight {
      line-height: 22px;
      font-size: 14px;
      margin-left: 8px;
    }
    .itemLeft {
      width: 140px;
      text-align: right;
      color: rgba(0, 0, 0, 0.45);
    }
    .itemRight {
      width: 280px;
      margin-left: 8px;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
</style>
