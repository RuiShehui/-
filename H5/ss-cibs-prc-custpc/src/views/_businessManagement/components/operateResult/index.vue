<!--
 * @Author: your name
 * @Date: 2021-12-08 15:05:22
 * @LastEditTime: 2022-09-20 10:36:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\components\operateResult\index.vue
-->
<template>
  <div class="resultWapper">
    <div class="desc">
      <div class="img" v-if="status==='success'">
        <img src="@/images/common/success.png" />
      </div>
      <div class="img" v-if="status==='fail'">
        <img src="@/images/common/success.png" />
      </div>
      <p>{{title}}</p>
    </div>
    <p>{{desc}}</p>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      default: 'success'
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.resultWapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .desc {
    p {
      text-align: center;
    }
  }
}
</style>