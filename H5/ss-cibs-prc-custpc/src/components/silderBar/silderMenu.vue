<template>
  <div class="silder-menu">
    <template v-for="item in menuList">
      <el-submenu
        :key="item.id"
        v-if="item.children && !!item.children.length"
        :index="item.id"
      >
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item[menuName] }}</span>
        </template>
        <silderMenu :menuList="item.children"></silderMenu>
      </el-submenu>
      <el-menu-item v-else :key="item.id" :index="item.id">
        <i :class="item.icon"></i>
        <span>{{ item[menuName] }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'silderMenu',
  props: ['menuList'],
  computed: {
    ...mapGetters('app', ['getLang']),
    menuName() {
      return this.getLang === 'zh-CN' ? 'menuNameSC' : this.getLang === 'zh-HK' ? 'menuNameTC' : 'menuNameEN'
    }
  }
}
</script>

<style lang="scss" scoped></style>
