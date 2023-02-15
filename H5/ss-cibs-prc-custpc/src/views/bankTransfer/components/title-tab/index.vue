<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-05-27 10:30:29
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\titleTab.vue
-->
<!-- tab样式的标题 -->
<template>
  <div class="title-tabs mb20">
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' }
  }
};
</script>

<style lang="scss" scoped>
.title-tabs {
  width: 100%;
  border-bottom: solid 1px #f0f0f0;
  span {
    position: relative;
    display: inline-block;
    color: #f06b00;
    line-height: 26px;
    font-size: 18px;
    font-weight: 500;
    padding: 0 16px 12px;
    &::after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: #f06b00;
    }
  }
}
</style>
