<!--
 * @Author: zhangcheng
 * @Date: 2022-03-10 14:14:20
 * @LastEditTime: 2022-05-20 15:25:50
 * @LastEditors: zhangcheng
 * @Description: 基金认购
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList050201.vue
-->
<template>
  <!-- 基金认购 -->
  <card-list-left :title="$t('FUND.FUND_SUB')" :state="item.authState">
    <template slot="first">
      <!-- 投资账户 -->
      <div>
        <span>{{ $t('FUND.INVESTMENT_ACCOUNT') }}：</span>
        <span>{{ cardData.invAcctNo }}</span>
      </div>
      <!-- 基金编号/名称/货币 -->
      <div>
        <span>{{ $t('FUND.FOND_NO_NAME_CCY') }}：</span>
        <span>{{ cardData.fundProductCode }}-{{ cardData.fundProductName }}/{{ cardData.fundCCY }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 结算账户 -->
      <div>
        <span>{{ $t('FUND.SETTLEMENT_ACCOUNT') }}：</span>
        <span>{{ cardData.settleAcctNo }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 认购费 -->
      <div>
        <span>{{ $t('FUND.SUBSCRIPTION_FEE') }}：</span>
        <span>{{ cardData.flexChargeDisplay }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';

export default {
  name: 'CardList050201',
  mixins: [cardListMixin]
};
</script>