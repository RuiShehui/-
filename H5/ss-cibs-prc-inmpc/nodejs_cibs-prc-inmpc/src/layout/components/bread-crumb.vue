<!--
 * @Author: 徐天宏
 * @Date: 2021-10-27 17:23:35
 * @LastEditTime: 2022-01-26 15:23:22
 * @LastEditors: ZhangZhen
 * @Description: 面包屑
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\layout\components\bread-crumb.vue
-->
<template>
  <el-breadcrumb class="bread-container" separator="/">
    <transition-group name="fade">
      <el-breadcrumb-item v-for="(item, index) of showList" :key="`${index + 1} ${item}`">
        <span v-if="index < 2">
          {{ $t(`${transToHighCamel('MenuPageItems')}.${transToHighCamel(item)}`) }}
        </span>
        <span v-else>
          <!-- {{ item }} -->
          {{ $t(`COMMON.${transToHighCamel(item)}`) }}
        </span>
        <!-- <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >{{item.meta.title}}</span>
        <a v-else @click.prevent="handleLink(item)">{{item.meta.title}}</a> -->
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="crtOpRoute.length > 0" key="self-change-route">
        <span>
          {{ crtOpRoute }}
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { transToHighCamel } from '@/utils/tools';

export default {
  props: {
    crtOpRoute: {
      type: String,
      default: ''
    }
  },
  computed: {
    showList() {
      const { path } = this.$route,
        pathList = path.split('/').filter((item, index) => index > 0)

      return [...pathList]
        .filter(item => item.length > 0);
    }
  },
  watch: {
    $route() {
      
    }
  },
  mounted() {
  },
  methods: {
    transToHighCamel,
  }
};
</script>

<style scoped lang="scss">
.bread-container {

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.75;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}

</style>