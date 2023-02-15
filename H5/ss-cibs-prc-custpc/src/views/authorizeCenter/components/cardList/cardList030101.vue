<!--
 * @Author: zhangcheng
 * @Date: 2022-03-08 16:40:39
 * @LastEditTime: 2022-09-24 10:30:50
 * @LastEditors: Please set LastEditors
 * @Description: 行内转账
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList030101.vue
-->
<template>
  <card-list-left :title="$t('PAYMENT.INNER_TRANSFER')" :state="item.authState">
    <template slot="first">
      <!-- 收款人名称 -->
      <div>
        <span>{{ $t('PAYMENT.PAYEE_NAME') }}：</span>
        <span>{{ cardData.creditAcctName }}</span>
      </div>
      <!-- 收款账号 -->
      <div>
        <span>{{ $t('PAYMENT.RECEIVE_ACCOUNT') }}：</span>
        <span>{{ formatAccountNo(cardData.creditAcct) }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 收款银行 -->
      <div>
        <span>{{ $t('PAYMENT.PAYEE_BANK') }}：</span>
        <span>{{ $t('PAYMENT.CHUANGXING_BANK') }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 预约处理日期 -->
      <div v-if="cardData.isScheduleTx === 'Y'">
        <span>{{ $t('PAYMENT.APPOINTMENT_DATE') }}：</span>
        <span>{{ cardData.scheduleDate }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import mathTools from '@/utils/mathTools.js';
export default {
  name: 'CardList030101',
  mixins: [cardListMixin],
  methods:{
     formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
  }
};
</script>
