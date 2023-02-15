<template>
    <div class="g-result-wrapper">
        <img src="@/images/internationalBusiness/bianzu.png" alt="">
        <div v-if="status === 'success'" class="success">{{$t('BILLPAYMENT.SUBMITTED_SUCCESSSFULLY')}}</div>
        <div v-else class="success">{{$t('BILLPAYMENT.SUBMITTED_FAILED')}}</div>
        <div class="num">{{$t('BILLPAYMENT.ONLINE_BANKING_SERIAL_NUMBER')}}：{{number.flowNo}}</div>
        <div class="wait" v-if="number.authResultState === '03'">{{ $t('PAYMENT.TO_AUTH_TIP') }}</div>
        <div v-if="status === 'fail'" class="fail">{{$t('BILLPAYMENT.REASON_FOR_FAILURE')}}：sfshdj</div>
        <v-button size="w210" class="g-btn" @click="goPayInfo">{{$t('COMMON.BACK')}}</v-button>
    </div>
</template>

<script>
export default {
props: {
    number: {
      type: Object,
      default() {
        return {};
      }
    }
  },
    data() {
        return {
            status: 'success'
        }
    },
    methods: {
        goPayInfo() {
            this.$router.push('/payService/advancePayManagement')
        }
    },
    created(){
        console.log("輸出的數據",this.body)
    }
}
</script>

<style lang="scss" scoped>
.g-result-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.g-btn {
    margin-top: 54px;
}
.success {
  margin-top: 24px;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  line-height: 28px;
  font-weight: 500;
}
.wait {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  margin: 24px auto 0;
}
.num {
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
}
</style>