<!--
 * @Author: 朱涛
 * @Date: 2022-01-27 16:11:32
 * @LastEditTime: 2022-03-28 16:56:13
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\serviceSetting\edda\elePayment\modify\components\confirmInfo.vue
-->
<template>
  <div class="confirmInfo">
    <div class="confirmContent mt36">
      <detail-item :title="$t('USER_MANAGERMENT.PAY_TYPE')" :content="confirmInfo.supportType | supporyType" />
      <detail-item :title="$t('AUTHORIZE.AUTH_SERVICENUMBER')" :content="confirmInfo.paymentCode" />
      <detail-item :title="$t('AUTHORIZE.CREDITNAME')" :content="confirmInfo.remitteeName" />
      <detail-item :title="$t('ACCOUNT_MAINTENACE.ACCOUNT_NUMBER')" :content="confirmInfo.accountNo" />
      <detail-item :title="$t('AUTHORIZE.AUTH_FREQUENCY')" :content="confirmInfo.paymentFreq" />
      <detail-item :title="$t('ACCOUNT_MANAGEMENT.START_DATE')" :content="confirmInfo.startDate" />
      <detail-item :title="$t('ACCOUNT_MANAGEMENT.END_DATE')" :content="confirmInfo.endDate" />
      <detail-item :title="$t('AUTHORIZE.AUTH_LIMIT')" :content="confirmInfo.transLimit" />
    </div>
    <div class="flexc mt36">
      <v-button class="mr16" @click="$emit('back')">{{$t('COMMON.CANCEL')}}</v-button>
      <v-button type="primary" @click="$emit('confirm',confirmInfo)">{{$t('COMMON.DETERMINE')}}</v-button>
    </div>
  </div>
</template>
<script>
import business from '@/filters/business.js';
export default {
  props: {
    confirmInfo: {
      type: Object,
      default: () => {}
    }
  },
    filters: {
    supporyType:business.supporyType,
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.confirmContent {
  width: 940px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 100px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
.flexc {
  margin-bottom: 56px;
}
</style>