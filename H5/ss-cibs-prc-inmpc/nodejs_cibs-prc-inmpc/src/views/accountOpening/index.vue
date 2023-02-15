<template>
  <div class="contain">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'AccountOpening',
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {},
  data() {
    return {
      isRouterAlive: true
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
};
</script>

<style lang='scss' scoped>
.contain {
  padding: 32px 24px;
  box-sizing: border-box;
  min-height: 100%;
  background: #fff;
}
</style>