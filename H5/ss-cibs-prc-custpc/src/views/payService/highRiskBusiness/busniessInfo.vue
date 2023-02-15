<!--
 * @Author: zhangcheng
 * @Date: 2022-01-27 16:11:32
 * @LastEditTime: 2022-04-21 15:43:31
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\payService\highRiskBusiness\busniessInfo.vue
-->
<template>
  <div class="g-business-wrapper">
    <div class="g-steps-wrapper">
      <steps :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    </div>
    <infoWrite
      :type="type"
      v-if="steps==='infoFill'"
      @next="goConfirm"
      :chuangdate="chuangdate"
      :formData="form"
    ></infoWrite>
    <infoConfirm v-if="steps==='infoConfirm'" @back="goWirte" @sure="next" :form="form"></infoConfirm>
    <result v-if="steps==='result'" :authResultInfo="authResultInfo"></result>
  </div>
</template>

<script>
import infoWrite from './components/infoWrite';
import infoConfirm from './components/infoConfirm';
import result from '../billPayment/components/result';
export default {
  components: {
    infoWrite,
    infoConfirm,
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
      type: '',
      form: {},
      authResultInfo: [],
      chuangdate: {}
    };
  },
  computed: {
    activeIndex() {
      return this.steps == 'infoFill' ? 0 : this.steps == 'infoConfirm' ? 1 : 2;
    }
  },
  created() {
    let paramsObj = JSON.parse(sessionStorage.getItem('paramsObj', paramsObj))
    this.chuangdate = paramsObj
    sessionStorage.removeItem('paramsObj')
    console.log('上个页面得到的数据:', this.chuangdate);
    this.type = this.chuangdate.type;

  },
  methods: {
    goConfirm(form) {
      this.steps = 'infoConfirm';
      this.form = form;
    },
    goWirte() {
      this.steps = 'infoFill';
    },
    next(authResultInfo) {
      this.steps = 'result';
      this.authResultInfo = authResultInfo;
    }
  }
};
</script>

<style lang="scss" scoped>
.g-steps-wrapper {
  display: flex;
  justify-content: center;
}
</style>