1
<!--
 * @Author: zhangcheng
 * @Date: 2022-03-30 10:24:02
 * @LastEditTime: 2022-09-26 09:42:42
 * @LastEditors: Please set LastEditors
 * @Description: 外币转账
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList03010202.vue
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
      </div>)
    </template>
    <template slot="second">
      <!-- 收款银行 -->
      <div>
        <span>{{ $t('PAYMENT.PAYEE_BANK') }}：</span>
        <span>{{ filterBankInfo(cardData.creditBankCode) }}</span>
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
        <span>{{ $t('PAYMENT.CHARGE_CCY') }}：</span>
        <span>{{ cardData.chargeCcy }} {{ cardData.chargeAmt ? cardData.chargeAmt.toMoney() : '0.00' }}</span>
      </div>
      <!-- 预约处理日期 -->
      <div v-if="cardData.isScheduleTx ==='Y'">
        <span>{{ $t('PAYMENT.APPOINTMENT_DATE') }}：</span>
        <span>{{ item.transactionDescribe.scheduleDate }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { bankInfos } from '@/mixins';
import { cardListMixin } from '@auth/service/mixins';
import mathTools from '@/utils/mathTools.js';
export default {
  name: 'CardList03010202',
  mixins: [cardListMixin, bankInfos],
  data(){
    return{
      title:''
    }
  },
  created(){
    this.filterType()
  },
  methods:{
     filterType(){
      if(this.item.businessCode==='0303'){
        this.title = this.$t('AUTHORIZE.APPOINT_TRANS_MANAGE')+'-'+this.$t('PAYMENT.LOCAL_TRANSFER')
      }else{
        this.title = this.$t('PAYMENT.LOCAL_TRANSFER')
      }
    },
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  }
};
</script>
