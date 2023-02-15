<!--
 * @Author: your name
 * @Date: 2022-10-25 15:28:44
 * @LastEditTime: 2022-11-03 11:09:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\specialInstruction\index.vue
-->
<template>
  <div class="u-special">
    <div class="u-steps">
      <steps :stepsList="stepsList" :activeIndex="activeIndex" class="u-step"></steps>
    </div>

    <div v-if="activeIndex===0">
      <stepOne @next="next" :formData="fomData"></stepOne>
    </div>
    <div v-if="activeIndex===1">
      <stepTwo @next="next" @back="back" :confirm="confirm"></stepTwo>
    </div>
    <div v-if="activeIndex===2">
      <result @next="next" @back="back" :message="message"></result>
    </div>
  </div>
</template>

<script>
import stepOne from './components/stepOne.vue';
import stepTwo from './components/stepTwo.vue';
import result from './components/result.vue';
export default {
  components: {
    stepOne,
    stepTwo,
    result
  },
  data() {
    return {
      activeIndex: 0,
      fomData: {},
      confirm: {},
      message: {}
    };
  },
  computed: {
    // 步骤条
    stepsList() {
      const self = this;
      return [
        {
          title: this.$t('SPECIAL_INSTRUACTION.STEP_ONE'),
          description: ''
        },
        {
          title: this.$t('SPECIAL_INSTRUACTION.STEP_TWO'),
          description: ''
        },
        {
          title: this.$t('SPECIAL_INSTRUACTION.STEP_THREE'),
          description: ''
        }
      ];
    }
  },
  methods: {
    next(val) {
      if (this.activeIndex == '0') {
        this.confirm = val;
        console.log(this.confirm, 'val');
        this.activeIndex++;
      } else if (this.activeIndex == '1') {
        console.log(val,'112515')
        this.message = val;
        this.activeIndex++;
      }else{
        this.activeIndex = 0
      }
    },
    back(val) {
      if (this.activeIndex == '2') {
        this.activeIndex = 0;
      } else if (this.activeIndex == '1') {
        this.formData = val;
        this.activeIndex--;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.u-step {
  margin-top: 36px;
  margin-bottom: 36px;
}
</style>