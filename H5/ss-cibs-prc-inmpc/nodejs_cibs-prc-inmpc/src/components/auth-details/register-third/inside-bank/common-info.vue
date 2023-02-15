<!--
 * @Author: ZhangZhen
 * @Date: 2022-01-25 14:41:43
 * @LastEditTime: 2022-05-17 14:17:11
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\register-third\inside-bank\common-info.vue
-->
<template>
  <section>
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO_LABEL') }}</div>
        <div>{{ commonData.ebankCstmNo }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_NAME') }}</div>
        <div>{{ commonData.contactsName }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.STATUS') }}</div>
        <div>{{ commonData.status }}</div>
      </div>
      <div v-for="(item, index) in cardList" :key="index">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') }}</div>
          <div>{{ item.cardType }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') }}</div>
          <div>{{ item.cardNo }}</div>
        </div>
      </div>

      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.TRANSFER_TYPE') }}</div>
        <div>{{ registerThirdData.transferType }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.COLLECTION_ACCOUNT') }}</div>
        <div>{{ registerThirdData | filterAccount }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE') }}</div>
        <div>{{ registerThirdData.payeeName }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import clientManageFilters from '@/filters/clientManage';

export default {
  name: 'CommonInfo',
  props: {
    commonData: {
      type: Object,
      default: () => ({})
    },
    registerThirdData: {
      type: Object,
      default: () => ({})
    },
    cardList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  filters: {
    ...clientManageFilters,
  },
};
</script>
