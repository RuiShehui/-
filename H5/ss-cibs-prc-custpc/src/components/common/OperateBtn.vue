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
  padding: 6px 16px;
  font-size: 16px;
  width: auto;
  height: 36px;
  border-radius: 3px;
  border: 1px solid #fff;
  color: #fff;
  background-image: linear-gradient(180deg, #fabe35 0%, #f06b00 100%);
}

.el-button.btn:focus {
  color: #fff;
}

.el-button.btn:hover {
  background-color: #fff;
  background-image: none;
  border: 1px solid #f06b00;
  color: #f06b00;
}

.el-button.btn:active {
  background-color: lighten(#f4b335, 5%);
}
</style>