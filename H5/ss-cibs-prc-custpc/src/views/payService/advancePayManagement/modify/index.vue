<template>
  <div class="g-modify">
    <div class="m-steps-wrapper">
      <steps :stepsList="stepsList" :activeIndex="activeIndex" />
    </div>
    <inputInfo v-if="steps==='infoFill'" @next="next" :chuangdate="chuangdate" :type="type" :formData="form"></inputInfo>
    <confirmInfo v-if="steps==='infoConfirm'"  @back="back" @sure="sure" :form="form"></confirmInfo>
    <result v-if="steps==='result'" :number="number"></result>
  </div>
</template>
<script>
import inputInfo from './components/inputInfo';
import confirmInfo from './components/confirmInfo';
import result from './components/result'
export default {
  components: {
    confirmInfo,
    inputInfo,
    result
  },
  data() {
    return {
      // 步骤条1
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
      chuangdate:{},
      number:"",
      type:"",
      form:{}

    };
  },
  computed: {
    activeIndex() {
      return this.steps == 'infoFill' ? 0 : this.steps == 'infoConfirm' ? 1 : 2;
    }
  },
   created(){
      this.chuangdate = this.$route.query
      console.log("上个页面得到的数据:",this.chuangdate);
      this.type = this.$route.query.type
  },
  methods: {
    next(form) {
      this.steps = 'infoConfirm'
      this.form = form
    },
    back() {
      this.steps = 'infoFill'
      this.chuangdate = this.form
    },
    sure(number){
      this.steps = 'result'
      this.number = number
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