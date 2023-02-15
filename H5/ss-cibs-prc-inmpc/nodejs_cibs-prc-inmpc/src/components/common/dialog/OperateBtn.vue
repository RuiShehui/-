<!--
 * @Author: your name
 * @Date: 2022-06-23 10:42:58
 * @LastEditTime: 2022-10-17 14:37:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\components\common\dialog\OperateBtn.vue
-->
<template>
  <el-button class="btn" @click="handleClick">
    <slot />
  </el-button>
</template>

<script>
export default {
  name: 'OperateBtn',
  methods: {
    handleClick() {
      this.$emit('click')
    }
  },
}
</script>

<style lang="scss" scoped>
.btn {
  box-sizing: border-box;
  padding: 0.5em 1.5em !important;
  font-size: 18px;
  width: 160px;
  height: 40px;
  border-radius: 3px;
  border: 1px solid #fff;
  color: #fff;
  background-image: linear-gradient(180deg, #fabe35 0%, #f48918 100%);
}

.el-button.btn:focus {
  color: #fff;
}

.el-button.btn:hover {
  background-color: #fff;
  background-image: none;
  border: 1px solid #f48918;
  color: #f48918;
}

.el-button.btn:active {
  // color: green;
  // background-color: darken(#f48918, 10%);
  background-color: lighten(#f4b335, 5%);
}
</style>