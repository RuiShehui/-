<!--
 * @Author: ZhangZhen
 * @Date: 2022-01-25 15:00:00
 * @LastEditTime: 2022-01-25 15:01:30
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\register-third\local-fast\common-info.vue
-->
<template>
  <section>
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.COLLECTION_ACCOUNT') }}</div>
        <div>{{ registerThirdData.payeeAccount }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE') }}</div>
        <div>{{ registerThirdData.payeeName }}</div>
      </div>
      <div class="row" v-if="payeeIdenMethodFlag === '1'">
        <div>{{ $t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INS') }}</div>
        <!-- <div>{{ registerThirdData.receivingBank }}</div> -->
        <div>{{ registerThirdData.payeeBank }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LocalFastCommon',
  props: {
    registerThirdData: {
      type: Object,
      default () {
        return {};
      }
    },
    payeeIdenMethodFlag: {
      type: String,
      validator(val) {
        return ['0', '1', '2', '3'].includes(val);
      }
    }
  },
}
</script>

<style>

</style>