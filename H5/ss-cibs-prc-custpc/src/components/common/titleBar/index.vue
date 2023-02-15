<template>
  <div class="nav-bar">
    <p class="nav-title">{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
</style>