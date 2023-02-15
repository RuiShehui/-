<!--
 * @Author: your name
 * @Date: 2021-11-29 16:45:08
 * @LastEditTime: 2022-09-16 16:11:56
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\common\stepErrer.vue
-->
<template>
  <div class="stepErrer">
    <div class="tac">
      <p
        :class="
          type == 'success' ? 'el-icon-success cg' : 'el-icon-error cerror'
        "
      ></p>
    </div>
    <p class="tac mb10 f22 bold">
      {{ type == "success" ? this.$t('COMMON.SUBMIT_SUCCESS') : this.$t('COMMON.SUBMIT_FAIL') }}
    </p>
    <p class="tac gray2" style="width: 677px; margin: 0 auto">{{ desc }}</p>
    <!-- <div class="tac mtb56">
      <el-button @click="this.$emit('back')" size="medium">返回</el-button>
      <el-button
        type="primary"
        @click="this.$emit('transClose')"
        size="medium"
        >{{ button }}</el-button
      >
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    button: {
      Type: String,
      default: "重新转账",
    },
    desc: {
      Type: String,
      default: "",
    },
    type: {
      Type: String,
      default: "error",
    },
  },
};
</script>
<style lang="scss" scoped>
.stepErrer {
  div.tac {
    p {
      font-size: 50px;
      margin-bottom: 18px;
    }
  }
}
</style>