<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-05-24 16:40:41
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\layout\index.vue
-->

<template>
  <div class="layout-wrapper">
    <!--头部-->
    <bankHeader></bankHeader>
    <!--内容-->
    <bankMain></bankMain>
    <!--页脚-->
    <bankFooter colour="white"></bankFooter>
  </div>
</template>

<script>
import BankHeader from '../bankHeader';
import BankMain from '../bankMain';
import BankFooter from '../home/Footer.vue';

export default {
  name: 'Layout',
  data() {
    return {
      isFixed: false
    }
  },
  components: {
    BankHeader,
    BankMain,
    BankFooter
  },
  mounted() {
    window.addEventListener('click', this.hasScrollbar, false)
  },
  methods: {
    hasScrollbar() {
      this.isFixed = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
    }
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hasScrollbar)
  }
}
</script>

<style lang="scss" scoped>
</style>
