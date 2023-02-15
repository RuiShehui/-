<!--
 * @Author: 赵霖
 * @Date: 2021-12-15 09:55:42
 * @LastEditTime: 2022-10-24 17:34:09
 * @LastEditors: Please set LastEditors
 * @Description: 已预约利率
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\openFixed\components\interestRate\index.vue
-->

<template>
  <div class="g-interestRate">
    <steps :stepsList="stepsList" :activeIndex="activeIndex" class="u-steps"></steps>
    <div v-if="activeIndex === 0">
      <formInfo :formData="formData" @next="next"></formInfo>
    </div>

    <!-- 确认信息 -->
    <div v-if="activeIndex === 1">
      <comfirm @next="next" :formData="formData" :message="message" @back="back"></comfirm>
    </div>

    <div v-if="activeIndex === 2">
      <result :message="message" @next="next"></result>
    </div>
  </div>
</template>

<script>
import { newTradeToken } from '@/api/paymentRemittance';
import formInfo from './components/formInfo.vue';
import comfirm from './components/comfirm.vue';
import result from './components/result.vue';
export default {
  components: {
    formInfo,
    comfirm,
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
      activeIndex: 0,
      formData: {},
      message: {}
    };
  },
  methods: {
    back() {
      if (this.activeIndex === 2) {
        return this.$router.go(-1);
      }
      this.activeIndex--;
    },
    // 下一步
    async next(val) {
      if (this.activeIndex === 2) {
        this.formData={}
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 1) {
   
        this.message = val;

        return this.activeIndex++;
      } else {
        const tokResult = await newTradeToken();
        if (tokResult) {
          console.log(tokResult);
          sessionStorage.setItem('tranToken', tokResult.body);
        }
        this.formData = val;
        return this.activeIndex++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-steps {
  // margin-left: 23%;
  width: 512px;

  margin: 24px auto;
}
</style>