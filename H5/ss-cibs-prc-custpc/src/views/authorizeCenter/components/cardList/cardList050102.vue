<!--
 * @Author: zhangcheng
 * @Date: 2022-03-29 18:49:40
 * @LastEditTime: 2022-09-28 16:55:03
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList050102.vue
-->
<template>
  <card-list-left :title="$t('AUTHORIZE.CURRCY')" :state="item.authState">
    <template slot="first">
      <!-- 卖出账户 -->
      <div>
        <span>{{$t('AUTHORIZE.SELL_ACCOUNT')+'：'}}</span>
        <span>{{ formatAccountNo(saleAcct) }}</span>
      </div>
      <!-- 卖出币种 -->
      <div>
        <span>{{$t('AUTHORIZE.SELL_CCY')+'：'}}</span>
        <span>{{ cardData.debitCurrency | ccyFilter }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 买入账户 -->
      <div>
        <span>{{$t('AUTHORIZE.SELL_IN_ACCOUNT')+'：'}}</span>
        <span>{{ formatAccountNo(buyAcct) }}</span>
      </div>
      <!-- 买入币种 -->
      <div>
        <span>{{$t('AUTHORIZE.SELL_IN_CCY')+'：'}}</span>
        <span>{{ cardData.creditCurrency  | ccyFilter }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 参考汇率 -->
      <div>
        <span>{{$t('AUTHORIZE.C_RATE')+'：'}}</span>
        <span>{{ rate }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import filters from '@/filters/accountManagement';
import filter from '@/filters/public.js';
import { cardListMixin } from '@auth/service/mixins';
import mathTools from '@/utils/mathTools.js';
const { accountType } = filters;

export default {
  name: 'CardList050102',
  mixins: [cardListMixin],
  filters:{
    ...filters,
    ccyFilter:filters.ccyFilter,
    filtersType:filter.filtersType,
  },
  computed: {
    // 货币兑换规则：1.兑换日元，100JPY其他为1,
    //2.返回汇率都为其他货币兑换HKD
    rate() {
      let amount = 1,
        ccy = '';
      if (
        this.cardData.debitCurrency === 'JPY' ||
        this.cardData.creditCurrency === 'JPY'
      ) {
        amount = 100;
      }
      ccy =
        this.cardData.debitCurrency === 'HKD'
          ? this.cardData.creditCurrency
          : this.cardData.debitCurrency;
      return `${amount}${ccy} = ${this.cardData.customerRate}HKD`;
    },
    saleAcct() {
      return `${this.cardData.debitAcctNo} ${
        this.filterType(this.cardData.debitAccountType,this.cardData.debitCurrency)
      } ${accountType(this.cardData.debitAccountType)}`;
    },
    buyAcct() {
      return `${this.cardData.creditAcctNo} ${
       this.filterType(this.cardData.debitAccountType,this.cardData.creditCurrency)
      } ${accountType(this.cardData.debitAccountType)}`;
    },
    
  },
  methods:{
     formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    curFilters(val){
      return filters.ccyFilter(val)
    },
    filterType(type,cur){
      return filter.filtersType(type,cur)
    }
  }
};
</script>