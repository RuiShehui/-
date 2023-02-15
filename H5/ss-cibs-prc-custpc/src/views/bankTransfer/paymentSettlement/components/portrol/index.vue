<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 16:10:50
 * @LastEditTime: 2022-09-26 11:49:11
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\paymentSettlement\components\Portrol.vue
-->
<template>
  <div class="portrol-wrapper">
    <article class="default-content">
      <slot></slot>
      <!-- v-show="isShowDefaultContent" -->
      <p
        class="content-item"
        v-show="isShowDefaultContent"
        v-for="(content, contentIdx) of contentList"
        :key="`${contentIdx + 1} - ${content}`"
        v-html="content"
      ></p>
    </article>
  </div>
</template>

<script>
export default {
  name: 'Portrol',
  data() {
    return {
      contentList: [ ]
    };
  },
  computed: {
    isShowDefaultContent() {
      const slots = this.$slots;
      if (Object.getOwnPropertyNames(slots).length) {
        return false;
      }
      return true;
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.portrol-wrapper {
  width: 100%;
  max-height: 600px;
  overflow-y: auto;

  .default-content {
    font-size: 16px;

    .content-item {
      padding: 5px 0;
    }
  }

  .m-delay-tip {
    padding: 10px 0;
  }
}
</style>