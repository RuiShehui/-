<!--
 * @Author: zhangcheng
 * @Date: 2022-03-08 16:40:39
 * @LastEditTime: 2022-09-24 14:19:03
 * @LastEditors: Please set LastEditors
 * @Description: 电汇
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList030103.vue
-->
<template>
  <card-list-left :title="title" :state="item.authState">
    <template slot="first">
      <!-- 收款人名称 -->
      <div>
        <span>{{ $t('PAYMENT.PAYEE_NAME') }}：</span>
        <span>{{ cardData.creditAcctName }}</span>
      </div>
      <!-- 收款账号 -->
      <div>
        <span>{{ $t('PAYMENT.RECEIVE_ACCOUNT') }}：</span>
        <span>{{ cardData.creditAcct }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 收款银行 -->
      <div>
        <span>{{ $t('PAYMENT.PAYEE_BANK') }}：</span>
        <span>{{ payeeBank }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 预约处理日期 -->
      <div v-if="cardData.isScheduleTx === 'Y'">
        <span>{{ $t('PAYMENT.APPOINTMENT_DATE') }}：</span>
        <span>{{ item.expiration ? item.expiration.slice(0,10) : '--'}}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';

export default {
  name: 'CardList030103',
  mixins: [cardListMixin],
  data(){
    return{
      title:''
    }
  },
  computed: {
    payeeBank() {
      // 9214缺陷去掉银行国家、地址 20220829 ${this.filterCountry(this.cardData.creditBankRegion)} ${this.cardData.creditBankAddress}
      return `${this.cardData.creditBankName}`;
    }
  },
  created(){
    this.filterType()
  },
  methods: {
    filterType(){
      if(this.item.businessCode==='0303'){
        this.title = this.$t('AUTHORIZE.APPOINT_TRANS_MANAGE')+'-'+this.$t('PAYMENT.REMMITANCE')
      }else{
        this.title = this.$t('PAYMENT.REMMITANCE')
      }
    },
    filterCountry(val) {
      const countryInfoList =
        JSON.parse(localStorage.getItem('COUNTRY_INFOS_KEY')) || [];
      const tarItem = countryInfoList.find(item => item.value === val);
      if (tarItem) {
        return tarItem.label;
      }
      return '';
    }
  }
};
</script>
