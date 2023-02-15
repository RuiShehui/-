<!--
 * @Author: zhangcheng
 * @Date: 2022-03-09 17:43:31
 * @LastEditTime: 2022-11-16 09:10:50
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList0402.vue
-->
<template>
  <!-- 开立定期存款 -->
  <card-list-left :title="$t('AUTHORIZE.FIEXD')" :state="item.authState">
    <template slot="first">
      <!-- 定期账户 -->
      <div>
        <!-- 定期账户 -->
        <span>{{$t('AUTHORIZE.FIXED')}}：</span>
        <span>{{ formatAccountNo(cardData.fixedAccount)}} {{cardData.fixedAccountCur | ccyFilter}} {{cardData.fixedAccountType | accountType}}</span>
      </div>
      <!-- 存款期 -->
      <div v-if="cardData.fixedTerm">
        <!-- 存款期 -->
        <span>{{$t('AUTHORIZE.FIXEDTERM')}}：</span>
        <span>{{ cardData.fixedTerm?forMatDate(cardData.fixedTerm):''}}</span>
      </div>
    </template>)
    <template slot="second">
      <!-- 付款账户 -->
      <div>
        <span>{{$t('AUTHORIZE.debitAcctName')}}：</span>
        <span>{{ cardData.paymentAccount}} {{cardData.paymentAccountCur| ccyFilter }} {{cardData.paymentAccountType | accountType}}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 利率 -->
      <div>
        <span>{{$t('AUTHORIZE.T_RATE')}}：</span>
        <span>{{ cardData.rate }}%</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import CONTANTS from '@/utils/contants.js';
import mathTools from '@/utils/mathTools.js';
import filter from '@/filters/accountManagement';
import depositFilter from '@/filters/deposit.js';
export default {
  name: 'CardList0402',
  mixins: [cardListMixin],
  created() {
    console.log(this.cardData.fixedTerm, 'cardData');
    // this.getDay();
  },
  filters: {
    ...filter,
    depositFilter:depositFilter.getDay
  },
  methods: {
    getMonth(value) {
      return value
        ? CONTANTS.dateList().find(tpye => tpye.value == value).label
        : '';
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    forMatDate(val){
      return depositFilter.getDay(val)
    }
  }
};
</script>