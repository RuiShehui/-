<!--
 * @Autor: 朱涛
 * @Date: 2021-11-30 10:44:24
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-05-19 09:27:00
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\tree-tables\tree-table-item.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <span>
    <el-checkbox
      :value="value"
      :disabled="disabled"
      @change="changeValue"
    />
    <!--
      // TODO
      indeterminate:
        1.当子节点没有被全部选择时 (选了但是没有全选), 使用此状态控制checkbox
    -->
  </span>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: false
    };
  },
  created() {},
  mounted() {
    // console.log('disabled:', this.disabled);
    this.currentValue = this.value;
  },
  methods: {
    changeValue(value) {
      this.$emit('on-change', {
        prop: this.prop,
        value
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
