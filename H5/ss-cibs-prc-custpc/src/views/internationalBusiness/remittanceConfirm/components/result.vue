<!--
 * @Author: your name
 * @Date: 2021-12-06 09:13:48
 * @LastEditTime: 2021-12-14 10:42:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\internationalBusiness\remittanceConfirm\components\result.vue
-->
<template>
    <div class="g-result-wrapper">
        <img src="@/images/internationalBusiness/bianzu.png" alt="">
        <div v-if="status === 'success'|| status === 'wait'" class="m-success">{{$t('COMMON.TRANSACTION_SUCCESS')}}</div>
        <div v-else class="m-success">{{$t('REMITTANCECONFIRM.SUBMISSION_FAILED')}}</div>
        <div class="m-num">{{$t('REMITTANCECONFIRM.ONLINE_BANKING_SERIAL_NUMBER')}}：{{number}}</div>
        <div v-if="status === 'fail'" class="fail">{{$t('REMITTANCECONFIRM.REASON_FOR_FAILURE')}}：sfshdj</div>
        <!-- <div v-if="status === 'wait'" class="u-result">{{$t('REMITTANCECONFIRM.TRANSACTION_RESULT')}}：{{ $t('PAYMENT.TO_AUTH_TIP') }}</div> -->
        <div v-if="status === 'wait'" class="wait">{{ $t('PAYMENT.TO_AUTH_TIP') }}</div>
        <v-button size="w210" class="m-btn" @click="goExchange">{{$t('COMMON.BACK')}}</v-button>
    </div>
</template>

<script>
export default {
    props: {
        status: {
            type: String,
            default: 'success',
        },
        number:{
            type:String,
            default: ''
        }
    },
    methods: {
        goExchange() {
            // this.$emit('go')
            this.$router.go(0);
        }
    }
}
</script>

<style lang="scss" scoped>
.g-result-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    img {
        width: 76px;
        height: 76px;
        padding-top: 36px;
    }
}
.m-success {
    font-size: 20px;
    color: rgba(0, 0, 0, .85)
}
.m-btn {
    margin-top: 56px;
}
.m-num {
    margin-top: 12px;
    font-size: 14px;
    color: rgba(0, 0, 0, .45);
}
.wait {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  margin: 24px auto 0;
}
</style>