<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-05-12 19:41:11
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\common\DetailItem.vue
-->
<template>
  <div class="detailItem">
    <div class="itemContent">
      <div class="itemLeft">{{ title }}</div>
      <div class="itemRight">{{ content }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>

.detailItem {
  box-sizing: border-box;
  padding: 8px 0 0;

  .itemContent {
    display: flex;
    .itemLeft,
    .itemRight {
      line-height: 22px;
      font-size: 14px;
      margin-left: 8px;
    }
    .itemLeft {
      width: 140px;
      text-align: right;
      color: rgba(0, 0, 0, 0.45);
    }
    .itemRight {
      width: 280px;
      margin-left: 8px;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
    }
  }

}
</style>