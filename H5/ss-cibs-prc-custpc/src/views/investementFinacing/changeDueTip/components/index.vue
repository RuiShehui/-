<!--
 * @Author: your name
 * @Date: 2021-12-16 09:45:06
 * @LastEditTime: 2022-09-19 09:52:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\changeDueTip\components\index.vue
-->
<template>
  <div class="g-change">
    <steps :stepsList="stepsList" :activeIndex="activeIndex" class="u-steps"></steps>
    <div v-if="activeIndex===0">
      <changeInfo @next="next" :fromData="formData"></changeInfo>
    </div>
    <div v-if="activeIndex === 1">
      <comfirm @next="next" :comfirmData='comfirmData' :message="message" @back="back"></comfirm>
    </div>
    <div v-if="activeIndex === 2">
      <result @next="next" :message="message"></result>
    </div>
  </div>
</template>

<script>
import changeInfo from './changeInfo.vue';
import comfirm from './comfirm.vue';
import result   from './result.vue'
export default {
  components: {
    changeInfo,
    comfirm,
    result
  },
  data() {
    return {
      stepsList: [
        {
          title: this.$t("COMMON.STEPS_FILL_INFORMATION")
        },
        {
          title: this.$t("COMMON.STEPS_COMFIRM_INFORMATION")
        },
        {
          title: this.$t("COMMON.STEPS_RESULT_INFORMATION")
        }
      ],
      activeIndex: 0,
      formData:{},
      message:{},
      comfirmData:{}
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
    next(val) {
      if (this.activeIndex === 2) {
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 1) {
        // 调用接口
        // 接口状态返 回正常
        console.log(1233)
        this.message = val;

        return this.activeIndex++;
      } else {
        this.comfirmData =val
        return this.activeIndex++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-steps {
  margin-left: 22%;
}
.u-tips{
  font-size: 14px;
  color: rgba($color: #000000, $alpha: 0.85);
  background: rgba($color: #fffbe6, $alpha: 1.0);
  height:40px;
  line-height: 40px;
  padding-left: 24px;
  margin-bottom: 24px;
}
</style>