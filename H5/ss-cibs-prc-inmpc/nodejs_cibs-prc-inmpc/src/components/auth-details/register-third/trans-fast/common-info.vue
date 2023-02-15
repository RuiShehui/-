<!--
 * @Author: ZhangZhen
 * @Date: 2022-01-25 14:52:46
 * @LastEditTime: 2022-07-18 11:27:40
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\register-third\trans-fast\common-info.vue
-->
<template>
  <section>
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.PAYEE_IDENTIFY_METHOD') }}</div>
        <div>{{ registerThirdData.payeeIdenMethod }}</div>
      </div>
      <div>
        <div class="row">
          <div>{{ registerThirdData.payeeIdenMethod }}</div>
          <div>{{ registerThirdData.mobilePhone || registerThirdData.emailAddress || registerThirdData.fpsId || registerThirdData.payeeAccount }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE') }}</div>
          <div>{{ registerThirdData.payeeName }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INS') }}</div>
          <div>{{ registerThirdData.receivingBank || registerThirdData.payeeBank || '預設收款銀行' }}</div>
        </div>
      </div>
      <!-- <div v-if="payeeIdenMethodFlag === '1'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.COLLECTION_ACCOUNT') }}</div>
          <div>{{ registerThirdData.payeeAccount }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE') }}</div>
          <div>{{ registerThirdData.payeeName }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INS') }}</div>
          <div>{{ registerThirdData.receivingBank }}</div>
        </div>
      </div>
      <div v-if="payeeIdenMethodFlag === '2'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE') }}</div>
          <div>{{ registerThirdData.payeeName }}</div>
        </div>
      </div>
      <div v-if="payeeIdenMethodFlag === '3'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
          <div>{{ registerThirdData.emailAddress }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.DESIGNATED_RECEVING_BANK') }}</div>
          <div>{{ registerThirdData.payeeBank }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE') }}</div>
          <div>{{ registerThirdData.payeeName }}</div>
        </div>
      </div>-->
    </div>
  </section>
</template>

<script>
export default {
  name: 'TransFastCommon',
  props: {
    registerThirdData: {
      type: Object,
      default() {
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
  created() {
    console.log(this.payeeIdenMethodFlag, 'this.payeeIdenMethodFlag');
    console.log(this.registerThirdData, 'this.registerThirdData');
  }
};
</script>

<style>
</style>