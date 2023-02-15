<template>
  <!-- <transition-group class="nav-item"> -->
  <component :key="item.id" :index="item.id" :is="name">
    <span slot="title">{{ item.name }}</span>
  </component>

  <!-- <nav-menu
      v-for="child of children"
      :item="child"
      :menuItem="getMenuItem(child)"
      :children="child.children"
  />-->
  <!-- </transition-group> -->
</template>

<script>
// import { mapGetters } from 'vuex';

export default {
  name: "NavMenuItem",
  props: {
    children: {
      type: Array,
      default: () => [],
    },
    // children中的一项
    item: {
      type: Object,
      default: () => ({}),
    },
    // v-bind:is 绑定的组件名称
    name: {
      type: String,
      default: "el-item-item",
    },
  },
  computed: {
    // ...mapGetters(['getUserMenus'])
  },
  methods: {
    getMenuItem(menu) {
      return menu.children.length > 0 ? "el-submenu" : "el-menu-item";
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-item {
}
</style>