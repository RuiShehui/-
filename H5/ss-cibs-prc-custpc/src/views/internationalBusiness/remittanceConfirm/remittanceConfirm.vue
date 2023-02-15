<!--
 * @Author: your name
 * @Date: 2021-12-03 14:13:08
 * @LastEditTime: 2022-09-19 09:43:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\internationalBusiness\remittanceConfirm\remittanceConfirm.vue
-->
<template>
  <div class="g-remittance-confirm-wrapper" v-if="showIndex">
    <div class="m-steps-wrapper">
      <steps :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    </div>
    <exchange :formData="form" @next="handleNext" v-show="steps == 'infoFill'"></exchange>
    <confirm :form="form" v-show="steps == 'infoConfirm'" @back="handleBack" @sure="sure"></confirm>
    <result :status="status" v-show="steps == 'infoResult'" @go="goExchange" :number="number"></result>
  </div>
</template>

<script>
import { judgeCurrExchangeDate } from '@/api/internationalBusiness.js';
import exchange from './components/exchange';
import confirm from './components/confirm';
import result from './components/result';
import { scrollToTop } from './components/index.js';
import { newTradeToken } from '@/api/paymentRemittance';
export default {
  components: {
    exchange,
    confirm,
    result
  },
  data() {
    return {
      stepsList: [
        {
          title: this.$t('FOREXLISTPRICE.FILL_IN_THE_PURCHASE_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('FOREXLISTPRICE.CONFIRM_TRANSACTION_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('FOREXLISTPRICE.TRANSACTION_SUCCESS'),
          description: ''
        }
      ],
      steps: 'infoFill',
      status: 'success',
      form: {},
      number: '',
      showIndex: false
    };
  },
  computed: {
    activeIndex() {
      return this.steps == 'infoFill' ? 0 : this.steps == 'infoConfirm' ? 1 : 2;
    }
  },
  created() {
    this.judgeCurrExchangeDate();
  },
  methods: {
    async judgeCurrExchangeDate() {
      const result = await judgeCurrExchangeDate();
      if (result) {
        this.showBox(result);
      }
    },
    showBox(result) {
      switch (result) {
        case '0':
          return this.$confirm({
            title: this.$t('REMITTANCECONFIRM.TIPSONE'),
            message: this.$t('COMMON.NOT_SEVER_TIME'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          }).then(() => {
            this.$router.replace('/home');
          });
        case '1':
          this.showIndex = true;
          return;
        case '2':
          return this.$confirm({
            title: this.$t('REMITTANCECONFIRM.TIPSONE'),
            message: this.$t('COMMON.SPECIAL_WEATHER'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          }).then(() => {
            this.$router.replace('/home');
          });
      }
    },
    scrollToTop,
    async handleNext(form) {
      const tokResult = await newTradeToken();
      if (tokResult) {
        console.log(tokResult);
        sessionStorage.setItem('tranToken', tokResult.body);
      }
      this.form = form;
      console.log('123344');

      this.steps = 'infoConfirm';
      this.scrollToTop();
    },
    handleBack() {
      this.steps = 'infoFill';
      this.scrollToTop();
    },
    sure(arr) {
      this.steps = 'infoResult';
      this.number = arr.flowNo;
      if (arr.authResultState == '03') this.status = 'wait';
      console.log('我就是流水', this.number);
    },
    goExchange() {
      this.scrollToTop();
      this.steps = 'infoFill';
      this.form = {};
      console.log('返回页的数据', this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-steps-wrapper {
  display: flex;
  justify-content: center;
}
::v-deep .el-input {
  width: 320px !important;
}
</style>