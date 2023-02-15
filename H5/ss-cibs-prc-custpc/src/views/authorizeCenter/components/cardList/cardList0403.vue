<!--
 * @Author: zhangcheng
 * @Date: 2022-03-09 19:35:57
 * @LastEditTime: 2022-10-19 10:21:28
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList0403.vue
-->
<template>
<!-- 更改到期指示 -->
  <card-list-left :title="$t('AUTHORIZE.UPDATE_DATE')" :state="item.authState">
    <template slot="first">
      <!-- 定期账户 -->
      <div>
        <span>{{$t('AUTHORIZE.FIXED')}}：</span>
        <span>{{ formatAccountNo(cardData.fixedAccount) }} {{ item.transactionDescribe.depositCurrency | ccyFilter }}</span>
      </div>
      <!-- 下次存款期 -->
      <div>
        <span>{{$t('AUTHORIZE.NEXT_TERM')}}：</span>
        <span>{{ getMonth(item.transactionDescribe.newNextTransferDate)||item.transactionDescribe.dueDate}}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 到期指示 -->
      <div>
        <span>{{$t('AUTHORIZE.DATE_DOWN')}}：</span>
        <span>{{ cardData.newMaturityInstructions | newMaturityInstructionsFilter }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 存款编号 -->
      <div>
        <span>{{$t('AUTHORIZE.DEPOSIT_CODE')}}：</span>
        <span>{{ cardData.altId }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import filters from '@/filters/deposit';
import CONTANTS from '@/utils/contants.js';
import mathTools from '@/utils/mathTools.js';
import filter from "@/filters/accountManagement"
export default {
  name: 'CardList0403',
  mixins: [cardListMixin],
  filters:{
    ...filter,
    ...filters
  },
  created(){
    console.log(this.cardData,'cardData')
  },
  methods:{
    getMonth(value){
         return value
        ? CONTANTS.dateList().find(tpye => tpye.value == value).label
        : '';
    },
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
  }
};
</script>
