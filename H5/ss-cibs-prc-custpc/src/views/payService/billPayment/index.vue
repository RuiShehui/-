<!--
 * @Author: zhangcheng
 * @Date: 2022-01-27 16:11:32
 * @LastEditTime: 2022-04-21 15:06:05
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\payService\billPayment\index.vue
-->
<template>
  <div class="g-billpayment-wrapper" v-loading="requestLoading">
    <div class="m-steps-wrapper">
      <steps :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    </div>
    <payInfoWrite :formData="form" v-show="steps==='infoFill'" @next="next"></payInfoWrite>
    <payInfoConfirm :form="form" v-if="steps==='infoConfirm'" @back="back" @sure="sure"></payInfoConfirm>
    <result v-if="steps==='result'" :authResultInfo="authResultInfo"></result>
  </div>
</template>

<script>
import payInfoWrite from './components/payInfoWrite';
import payInfoConfirm from './components/payInfoConfirm';
import result from './components/result';
import { mapState } from 'vuex';
export default {
  components: {
    payInfoWrite,
    payInfoConfirm,
    result
  },
  data() {
    return {
      stepsList: [
        {
          title: this.$t('COMMON.STEPS_FILL_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('COMMON.STEPS_COMFIRM_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('COMMON.STEPS_RESULT_INFORMATION'),
          description: ''
        }
      ],
      steps: 'infoFill',
      status: 'success',
      authResultInfo: {},
      form: {}
    };
  },
  computed: {
    activeIndex() {
      return this.steps == 'infoFill' ? 0 : this.steps == 'infoConfirm' ? 1 : 2;
    },
    ...mapState('app', ['requestLoading'])
  },
  methods: {
    next(form) {
      this.form = form;
      this.steps = 'infoConfirm';
    },
    back() {
      this.steps = 'infoFill';
    },
    sure(authResultInfo) {
      this.authResultInfo = authResultInfo;
      this.steps = 'result';
    }
  }
};
</script>

<style lang="scss" scoped>
.m-steps-wrapper {
  display: flex;
  justify-content: center;
}
</style>