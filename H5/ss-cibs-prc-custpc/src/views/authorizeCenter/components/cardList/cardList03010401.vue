<!--
 * @Author: zhangcheng
 * @Date: 2022-03-29 10:12:47
 * @LastEditTime: 2022-09-24 15:28:03
 * @LastEditors: Please set LastEditors
 * @Description: 批量转账
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList03010401.vue
-->
<template>
  <!-- 批量转账 -->
  <card-list-left :title="title" :state="item.authState">
    <template slot="first">
      <!-- 付款账户 -->
      <div>
        <span>{{$t('AUTHORIZE.debitAcctName')}}:</span>
        <span>{{ formatAccountNo(cardData.creditAcct) }} {{ cardData.cur | ccyFilter}}{{ cardData.creditAcctType | accountType }}</span>
      </div>
      <!-- 总笔数 -->
      <div>
        <span>{{$t('AUTHORIZE.tradeNumber')}}:</span>
        <span>{{ cardData.tradeNumber }}{{$t('AUTHORIZE.PANS')}}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 手续费扣款账户 -->
      <div>
        <span>{{$t('AUTHORIZE.feeAcct')}}:</span>
        <span>{{ formatAccountNo(cardData.feeAcct) }} {{ cardData.cur }}{{ cardData.feeAcctType | accountType }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 手续费 -->
      <div>
        <span>{{$t('AUTHORIZE.amount')}}:</span>
        <span>{{ cardData.serviceCharge }} {{ cardData.cur }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import filters from '@/filters/accountManagement';
import mathTools from '@/utils/mathTools.js';
export default {
  name: 'CardList03010401',
  mixins: [cardListMixin],
  filters,
  data() {
    return {
      title: ''
    };
  },
  created() {
    this.filterType();
  },
  methods: {
    filterType() {
      if (this.item.businessCode === '0303') {
        this.title =
          this.$t('AUTHORIZE.APPOINT_TRANS_MANAGE') +
          '-' +
          this.$t('AUTHORIZE.ALL_TRANSFER');
      } else {
        this.title = this.$t('AUTHORIZE.ALL_TRANSFER');
      }
    },
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  }
};
</script>
