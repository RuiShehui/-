<!--
 * @Author: ZhangZhen
 * @Date: 2022-05-30 09:52:17
 * @LastEditTime: 2022-05-30 09:54:31
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\bank-proxy-detail\index.vue
-->
<template v-if="Object.keys(detailItem).length > 0">
  <!-- 银行代理费 -->
  <detail-item
    v-if="detailItem.chargePayWay !== 'SHA'"
    :title="$t('PAYMENT.BANK_PROXY_FEE')"
    :content="
      `${detailItem.ccy} ${
        detailItem.ccy === 'USD'
          ? '28.00'
          : detailItem.ccy === 'CAD'
          ? '15.00'
          : detailItem.ccy === 'GBP'
          ? '8.00'
          : detailItem.ccy === 'AUD'
          ? '15.00'
          : detailItem.ccy === 'EUR'
          ? '15.00'
          : '0.00'
      }`
    "
  />
</template>

<script>
export default {
  name: 'BankProxyDetail',
  props: {
    detailItem: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
