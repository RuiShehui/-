<!--
 * @Author: zhangcheng
 * @Date: 2022-03-31 10:21:48
 * @LastEditTime: 2022-09-24 15:30:57
 * @LastEditors: Please set LastEditors
 * @Description: 缴付账单
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList060101.vue
-->
<template>
  <card-list-left :title="$t('AUTHORIZE.CHECK_DAN')" :state="item.authState">
    <template slot="first">
      <!-- 付款账户 -->
      <div>
        <span>{{$t('AUTHORIZE.debitAcctName')+'：'}}</span>
        <span>{{ formatAccountNo(cardData.payAccount) }}{{ cardData.currency  | ccyFilter }}</span>
      </div>
      <!-- 商户类别 -->
      <div>
        <span>{{$t('AUTHORIZE.merchantTypeInfo')+'：'}}</span>
        <span>{{ cardData.merchantTypeInfo }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 商户名称 -->
      <div>
        <span>{{$t('AUTHORIZE.merchantName')+'：'}}</span>
        <span>{{ cardData.merchantName }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 缴付日期 -->
      <div v-if="cardData.subscribeFlag === '1'">
        <span>{{$t('AUTHORIZE.payDate')+'：'}}</span>
        <span>{{ cardData.payDate.substring(0, 4)+'-'+cardData.payDate.substring(4, 6)+'-'+cardData.payDate.substring(6, 8) }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import mathTools from '@/utils/mathTools.js';
import filters from '@/filters/accountManagement';
export default {
  name: 'CardList060101',
  mixins: [cardListMixin],
  filters:{
    ...filters
  },
  methods:{
     formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  },
  created(){
    const lang = localStorage.getItem('lang');
    this.cardData.merchantTypeInfo = lang=='zh-CN'?this.cardData.merchantTypeInfo:lang=='zh-HK'
    ?this.cardData.merchantTypeInfoZht:this.cardData.merchantTypeInfoEn;
    this.cardData.merchantName = lang=='zh-CN'?this.cardData.merchantName:lang=='zh-HK'
    ?this.cardData.merchantNameZht:this.cardData.merchantNameEn
  },
};
</script>