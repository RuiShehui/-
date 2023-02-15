<!--
 * @Author: ZhangZhen
 * @Date: 2022-01-25 15:10:52
 * @LastEditTime: 2022-01-25 15:39:04
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\register-third\wire-trans\common-info.vue
-->
<template>
  <section>
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.REMITTEE_NAME') }}</div>
        <div>{{ registerThirdData.payeeName }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.REMITTEE_COURTY') }}</div>
        <div>{{ registerThirdData.payeeCountryCode }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.PAYEE_ADDRESS') }}</div>
        <div>{{ registerThirdData.payeeAddress }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.ACCOUNT_NO') }}</div>
        <div>{{ registerThirdData.accountNo }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.SWIFT_CODE') }}</div>
        <div>{{ wireInfo.swiftCode }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.BANK_COUNTRY') }}</div>
        <div>{{ wireInfo.countryCode }}</div>
      </div>
      <div class="row" v-if="bankFlag">
        <div>{{ $t('CUSTOMER_MANAGEMENT.BANK_NAME') }}</div>
        <div>{{ wireInfo.bankName || registerThirdData.bankName}}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.BANK_ADRESS') }}</div>
        <div>{{ registerThirdData.bankAddress }}</div>
      </div>
      <div class="row" v-if="!bankFlag">
        <div>{{ $t('CUSTOMER_MANAGEMENT.BANK_CODE') }}</div>
        <div>{{ registerThirdData.bankCode }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WireTransCommon',
  props: {
    registerThirdData: {
      type: Object,
      default() {
        return {};
      }
    },
    wireInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    bankFlag: Boolean,
  },
  mounted() {
  }
}
</script>

<style>

</style>