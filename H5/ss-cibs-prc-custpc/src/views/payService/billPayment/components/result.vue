<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:47
 * @LastEditTime: 2022-04-22 10:03:37
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\payService\billPayment\components\result.vue
-->
<template>
  <div class="g-result-wrapper">
    <img
      v-if="successArr.includes(authResultInfo.authResultState)"
      src="@/images/common/success.png"
      alt
    />
    <img v-else src="@/images/paymentSettlement/wrong.png" alt />
    <div
      v-if="successArr.includes(authResultInfo.authResultState)"
      class="success"
    >{{$t('BILLPAYMENT.SUBMITTED_SUCCESSSFULLY')}}</div>
    <div v-else class="success">{{$t('BILLPAYMENT.SUBMITTED_FAILED')}}</div>
    <div class="num">{{$t('BILLPAYMENT.ONLINE_BANKING_SERIAL_NUMBER')}}：{{authResultInfo.flowNo}}</div>
    <div
      v-if="failArr.includes(authResultInfo.authResultState)"
      class="fail"
    >{{$t('BILLPAYMENT.REASON_FOR_FAILURE')}}：{{authResultInfo.hostMessage}}</div>
    <div class="wait" v-if="authResultInfo.authResultState === '03'">{{ $t('PAYMENT.TO_AUTH_TIP') }}</div>
    <v-button size="w210" class="u-btn" @click="goPayInfo">{{$t('COMMON.BACK')}}</v-button>
  </div>
</template>

<script>
export default {
  props: {
    authResultInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      failArr: ['91'],
      successArr: ['90', '03', '12', '13','60']
    };
  },
  methods: {
    goPayInfo() {
      window.location.reload()
    }
  }
};
</script>

<style lang="scss" scoped>
.g-result-wrapper {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
}
.u-btn {
  margin-top: 56px;
}
.success {
  margin-top: 24px;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  line-height: 28px;
  font-weight: 500;
}
.num {
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
}
.wait {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  margin: 24px auto 0;
}
</style>