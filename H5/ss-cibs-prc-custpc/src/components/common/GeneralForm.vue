<template>
  <el-form class="form" ref="form" :model="form">
    <el-form-item
      v-for="(item, index) of itemList"
      :key="index"
      :prop="item.prop"
      :label="item.label"
    ></el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "GeneralForm",
  props: {
    itemList: {
      type: Array,
    },
  },
  data() {
    return {
      form: {},
    };
  },
};
</script>

<style lang="scss" scoped>
.form {
}
</style>