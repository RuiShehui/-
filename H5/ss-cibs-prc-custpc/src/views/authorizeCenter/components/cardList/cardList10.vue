<!--
 * @Author: zhangcheng
 * @Date: 2022-03-11 16:10:49
 * @LastEditTime: 2022-09-24 15:33:04
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList10.vue
-->
<template>
<!-- 申领支票簿 -->
  <card-list-left :title="$t('AUTHORIZE.CHHECK_BOOK')" :state="item.authState">
    <template slot="first">
      <!-- 往来账户 -->
      <div>
        <!-- 往来账户 -->
        <span>{{$t('AUTHORIZE.CURRENT')}}：</span>
        <span>{{ formatAccountNo(cardData.accountNo) }} {{ cardData.currency | ccyFilter }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 领取方式 -->
      <div>
        <!-- 领取方式 -->
        <span>{{$t('AUTHORIZE.Delivery_Method')}}：</span>
        <!-- 平邮邮寄 -->
        <span>{{$t('AUTHORIZE.Surface_Mail')}}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import mathTools from '@/utils/mathTools.js';
import filters from '@/filters/accountManagement';
export default {
  name: 'CardList0402',
  mixins: [cardListMixin],
  filters,
  methods:{
     formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  }
};
</script>