<!-- 开立普通定期-->
<template>
  <div class="g-openFixed" >
    <steps :stepsList="stepsList" :activeIndex="activeIndex" class="u-steps"></steps>
    <div v-if="activeIndex === 0">
      <formInform :formData.sync="formData" @back="back" @next="next"></formInform>
    </div>

    <!-- 确认信息 -->
    <div v-if="activeIndex === 1">
      <comfirm @next="next" :formData.sync="formData" :message="message" @back="back"></comfirm>
    </div>

    <div v-if="activeIndex === 2">
      <result :message="message" @next="next"></result>
    </div>
  </div>
</template>

<script>
import { newTradeToken } from '@/api/paymentRemittance';
import formInform from './components/formInform.vue';
import comfirm from './components/comfirm.vue';
import result from './components/result.vue';
import { judgeDepositAccount, queryTime } from '@/api/openFixed.js';
export default {
  components: {
    formInform,
    comfirm,
    result
  },
  data() {
    return {
      stepsList: [
        {
          title: this.$t('COMMON.STEPS_FILL_INFORMATION')
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
      formData: {},
      activeIndex: 0,
      message: {},
      acctLoading: false
    };
  },
  created() {
  },
  methods: {
    back(val) {
      if (this.activeIndex === 2) {
        return this.$router.go(-1);
      }
      this.formData = val
      this.activeIndex--;
    },
    // 下一步
    async next(val) {
      if (this.activeIndex === 2) {
        this.formData={}
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 1) {
        // let message = {
        //   status: 'success',
        //   title: '提交成功',
        //   desc: '参考编号: 1231213213213'
        // };
        console.log(val, 'message');
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
    },
   
  }
};
</script>

<style lang="scss" scoped>
.g-openFixed {
  .u-steps {
    width: 512px;
    margin: 24px auto;
    // margin-left: 23%;
  }
  .m-form {
    // margin-top: 24px;
    margin-left: 23%;
  }
}
</style>