<!--
 * @Author: zhangcheng
 * @Date: 2022-03-10 14:14:20
 * @LastEditTime: 2022-05-20 15:51:42
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList050202.vue
-->
<template>
  <!-- 基金转换、赎回 -->
  <card-list-left
    :title="cardData.tranType === '2' ? $t('FUND.FUND_CON') : $t('FUND.FUND_RED')"
    :state="item.authState"
  >
    <template slot="first">
      <!-- 投资账户 -->
      <div>
        <span>{{ $t('FUND.INVESTMENT_ACCOUNT') }}：</span>
        <span>{{ cardData.invAcctNo }}</span>
      </div>
      <!-- 基金名称/类别/货币（转入） -->
      <div v-if="formData.tranType==='2'">
        <span>{{ $t('FUND.FUND_CODE_TYPE_CCY_IN') }}：</span>
        <span>{{ formData.switchInFundProductCode }}-{{ formData.inFundName }}/{{ formData.inFundCCY }}</span>
      </div>
      <!-- 基金编号/名称/货币 -->
      <div v-if="formData.tranType==='3'">
        <span>{{ $t('FUND.FOND_NO_NAME_CCY') }}：</span>
        <span>{{ formData.fundProductCode }}-{{ formData.fundName }}/{{ formData.fundCCY }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 结算账户 -->
      <div v-if="formData.tranType==='3'">
        <span>{{ $t('FUND.SETTLEMENT_ACCOUNT') }}：</span>
        <span>{{ cardData.settleAcctNo }}</span>
      </div>
      <!-- 基金名称/类别/货币（转出） -->
      <div v-if="formData.tranType === '2'">
        <span>{{ $t('FUND.FUND_NAME_TYPE_CCY_OUT') }}：</span>
        <span>{{ formData.outFundName }}-{{ formData.outAssetTypeCode | assetTypeCodeFilter }}/{{ formData.outFundCCY }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 转换费 -->
      <div v-if="formData.tranType==='2'">
        <span>{{ $t('FUND.REDEMPTION_FEE') }}：</span>
        <span>{{ formData.switchFeeDisplay }}</span>
      </div>
      <!-- 赎回费 -->
      <div v-if="formData.tranType==='3'">
        <span>{{ $t('FUND.SWITCHING_FEE') }}：</span>
        <span>{{ formData.redemptFeeDisplay }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import filters from '@/filters/fund.js';

export default {
  name: 'CardList050202',
  mixins: [cardListMixin],
  filters
};
</script>