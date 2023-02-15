<template>
  <div class="oButton">
    <el-button class="orangeBtn" @click="handleClick">
      <slot />
    </el-button>
  </div>
</template>

<script>
export default {
  name: "orangeBtn",
  data() {
    return {};
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.oButton {
  .orangeBtn {
    width: auto;
    height: 36px;
    background-image: linear-gradient(270deg, #ee881b 0%, #feaf03 100%);
    border-radius: 3px;
    font-size: 18px;
    color: #ffffff;
    box-shadow: unset;
    padding: 5px 30px;
  }
}
</style>
