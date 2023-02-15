<!--
 * @Author: your name
 * @Date: 2022-10-31 19:01:53
 * @LastEditTime: 2022-11-03 19:39:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList16.vue
-->

<template>

  <card-list-left :title="title" :state="item.authState">
    <template slot="first">
      <div>
        <span>{{$t('USER_COMMON.USER_CODE')}}：</span>
        <span> {{cardData.ebankCstmNo}}</span>
      </div>
    </template>
    <template slot="second">
      <div>
        <span>{{$t('SPECIAL_INSTRUACTION.ENGLISH_NAME')}}：</span>
        <span>{{cardData.linkUserName}}</span>
      </div>
        <span>{{$t('SPECIAL_INSTRUACTION.MOBILE_PHONE_NUMBER')}}：</span>
        <span>{{cardData.mobilePhone}}</span>
      </div>
    </template>
    <template slot="third">
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
  data(){
    return{
      title:this.$t('SPECIAL_INSTRUACTION.SPECIAL_ORDER_APPLICATION')
    }
  },
  created(){
    console.log(this.cardData,'')
  },
  methods:{
     formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  }
};
</script>