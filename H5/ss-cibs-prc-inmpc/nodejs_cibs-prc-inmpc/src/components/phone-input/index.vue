<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-11 10:53:20
 * @LastEditTime: 2022-02-11 11:08:35
 * @LastEditors: ZhangZhen
 * @Description: 流动电话输入框
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\phone-input\index.vue
-->
<template>
  <div class="phone-input-wrapper">
    <span
      class="phone-input-item"
      v-for="(value, valueIdx) of valueList"
      :key="`${valueIdx + 1}-${value}`"
    >
      <el-input
        :class="`phone-input-${valueIdx}`"
        :value="value"
        :data-index="valueIdx"
        @input="onValueChange"
      />
      <label
        v-show="valueIdx === valueList.length - 1"
        :for="`phone-input-${valueIdx}`"
      >
        {{ separator }}
      </label>
  </span>
  </div>
</template>

<script>
export default {
  name: 'PhoneInput',
  model: {
    prop: 'value',
    event: 'changeValue'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    separator: {
      type: String,
      default: '-'
    }
  },
  computed: {
    valueList() {
      const list = this.value.split(this.separator);

      return list;
    }
  },
  methods: {
    onValueChange: function(e) {
      const tar = e.target,
        { dataset } = tar,
        inputValue = tar.value,
        inputIndex = Number(dataset.index);
      
      const valueList = [...this.valueList];

      valueList[inputIndex] = inputValue;

      this.$emit('changeValue', valueList.join(this.separator));
    }
  }
}
</script>

<style>

</style>