<!--
 * @Author: zhangcheng
 * @Date: 2022-04-11 14:27:33
 * @LastEditTime: 2022-09-24 10:57:13
 * @LastEditors: Please set LastEditors
 * @Description: 预约缴付管理-缴付账单
 * @FilePath: \webbank-pc\src\views\authorizeCenter\components\cardList\cardList060103.vue
-->
<template>
<!-- 预约缴付管理-缴付账单 -->
  <card-list-left :title="$t('AUTHORIZE.YU_CHECK_DAN')" :state="item.authState">
    <template slot="first">
      <!-- 付款账户 -->
      <div>
        <span>{{$t('AUTHORIZE.debitAcctName')}}：</span>
        <span>{{ formatAccountNo(cardData.payAccount) }}{{ cardData.currency }}</span>
      </div>
      <!-- 商户类别 -->
      <div>
        <span>{{$t('AUTHORIZE.merchantTypeInfo')}}：</span>
        <span>{{ cardData.merchantTypeInfo }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 商户名称 -->
      <div>
        <span>{{$t('AUTHORIZE.merchantName')}}：</span>
        <span>{{ cardData.merchantName }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 操作类型 -->
      <div>
        <span>{{$t('AUTHORIZE.operation')}}：</span>
        <span>{{ item.operationType | operationTypeFilter }}</span>
      </div>
      <!-- 缴付日期 -->
      <div>
        <span>{{$t('AUTHORIZE.payDate')}}: </span>
        <span>{{ cardData.payDate }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import filters from '@/filters/public'
import mathTools from '@/utils/mathTools.js';
export default {
  name: 'CardList060103',
  mixins: [cardListMixin],
  created() {
    if (this.item.operationType !== '1') {
      this.cardData = this.item.origDataVO;
    }
     this.cardData.payDate = this.cardData.payDate.slice(0, 4) +'-' + this.cardData.payDate.slice(4, 6) + '-' + this.cardData.payDate.slice(6, 8);
     const lang = localStorage.getItem('lang');
     let detail = this.item.transactionDescribe;
    this.cardData.merchantTypeInfo = lang=='zh-CN'?detail.merchantTypeInfo:lang=='zh-HK'
    ?detail.merchantTypeInfoZht:detail.merchantTypeInfoEn;
    this.cardData.merchantName = lang=='zh-CN'?detail.merchantName:lang=='zh-HK'
    ?detail.merchantNameZht:detail.merchantNameEn;
  },
  filters: {
    ...filters,
  },
  methods:{
     formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  }
};
</script>