<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-11 10:53:20
 * @LastEditTime: 2022-06-30 17:29:08
 * @LastEditors: zhangcheng
 * @Description: 流动电话输入框
 * @FilePath: \ss-cibs-prc-custpc\src\components\common\phone-input\index.vue
-->
<script>
import _ from 'lodash';
import { defaultRules } from './data';

export default {
  name: 'PhoneInput',
  model: {
    prop: 'value',
    event: 'changeValue'
  },
  props: {
    /**
     * @type {import('vue').PropType<string>} 传入的初始值
     * @example '0755-27535344'
     */
    value: {
      type: String,
      default: ''
    },
    /**
     * @type {import('vue').PropType<string>} 分隔符
     * @example '-' '/'
     */
    separator: {
      type: String,
      default: '-'
    },
    /**
     * @type {{}[]} 规则数组 (对应输入框的索引)
     * @example {defaultRules}
     */
    rules: {
      type: Array,
      default() {
        return defaultRules;
      }
    },
    placeholders: {
      type: Array,
      default() {
        return [
          this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: this.$t('PAYMENT.MOBILE_PHONE_NUMBER')
          }),
          this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: this.$t('PAYMENT.MOBILE_PHONE_NUMBER')
          })
        ];
      }
    }
  },
  data() {
    return {
      inputValue: ''
    };
  },
  computed: {
    valueList() {
      const list = this.inputValue.split(this.separator);

      return list;
    }
  },
  watch: {
    value: {
      handler() {
        this.initInputValue();
      }
      // immediate: true
    }
  },
  mounted() {
    this.initInputValue();
  },
  methods: {
    initInputValue() {
      console.log('this.value', this.value);
      if (this.value.length) {
        this.inputValue = this.value;
      } else {
        this.inputValue = `${this.separator}`;
      }
      console.log('this.inputValue', this.inputValue);
    },
    onFocusInput(inputIndex = 0) {
      setTimeout(() => {
        const crtInput = this.$refs[`phoneInput${inputIndex}`][0];
        if (crtInput && crtInput.hasOwnProperty('focus')) {
          crtInput.focus();
        }
      }, 0);
    },
    validateValue(value, rules) {
      const valueList = value.split(this.separator);
      return !valueList.some((item, index) => {
        const rule = rules[index].pattern;
        if (!rule.test(item)) {
          return true;
        }
      });
    },
    onValueInput: _.debounce(function(inputValue, inputIndex) {
      if (inputValue.includes('-')) {
        return '';
      }

      const valueList = [...this.valueList];

      valueList[inputIndex] = inputValue;

      const value = valueList.join(this.separator);

      this.inputValue = value;

      this.$emit('changeValue', this.inputValue);

      this.onFocusInput(inputIndex);
    }, 50)
  }
};
</script>

<template>
  <div class="phone-input-wrapper">
    <span
      :class="['phone-input-item', valueIdx === 0 ? 'first-item' : '']"
      v-for="(value, valueIdx) of valueList"
      :key="`${valueIdx + 1}-${value}`"
      :style="{
        width: valueIdx === 0 ? '90px' : '110px'
      }"
    >
      <el-input
        v-bind="$attrs"
        v-on="$listeners"
        :class="`phone-input phone-input-${valueIdx}`"
        :ref="`phoneInput${valueIdx}`"
        :value.sync="value"
        :placeholder="placeholders[valueIdx]"
        @input="onValueInput($event, valueIdx)"
      />
      <label
        v-show="valueIdx !== valueList.length - 1"
        :for="`phone-input-${valueIdx}`"
      >{{ separator }}</label>
    </span>
  </div>
</template>

<style scoped lang="scss">
@import '~@/style/mixin.scss';

.phone-input-wrapper {
  width: 320px;
  @include flex();

  .phone-input-item {
    flex: 5;
    &.first-item {
      flex: 2;
    }
    .phone-input {
      &.el-input {
        display: inline-block;
        width: 100%;
        .el-input__inner {
          width: 100%;
          display: inline-block;
        }
      }
      &.phone-input-0 {
        // width: 80px !important;
        &.el-input {
          display: inline-block;
          width: 80px;
        }
      }
    }
    label {
      text-align: center;
    }
  }
}
</style>