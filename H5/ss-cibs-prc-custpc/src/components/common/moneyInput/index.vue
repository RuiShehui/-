<!--
 * @Author: ZhangZhen
 * @Date: 2021-12-07 16:19:41
 * @LastEditTime: 2022-05-24 17:40:59
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\common\moneyInput\index.vue
-->
<template>
  <el-input
    :class="['f-w-150']"
    :value="moneyValue"
    :size="size"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :disabled="disabled"
    @input="onMoneyInput"
    @change.native="onChange"
    @blur="onBlur"
    @copy="() => false"
    @cut="() => false"
    @paste="() => false"
  />
  <!-- .native.capture.prevent -->
</template>

<script>
export default {
  name: 'MoneyInput',
  model: {
    prop: 'moneyValue',
    event: 'onMoneyInput'
  },
  props: {
    /** money-input 's value  */
    moneyValue: {
      type: String,
      default: ''
    },
    /** money-input 's type  */
    type: {
      type: String
      // validator(val) {
      //   return ['text', 'textarea', 'tel', 'email', 'daterange', undefined].includes(val);
      // },
    },
    /** money-input 's maxlength  */
    maxlength: {
      type: [Number, String],
      default: 17
    },
    size: String,
    /** placeholder */
    placeholder: {
      type: String,
      default() {
        return this.$t('COMMON.PLEASE_INPUT');
      }
    },
    // 是否自动添加小数点
    isSaveDot: {
      type: Boolean,
      default: false
    },
    // 限制只能输入整数（不能00开头）
    isFullNumber: {
      type: Boolean,
      default: false
    },
    // disabled
    disabled: Boolean,
    isAllNum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 输入的金额值
      inputMoneyArray: []
    };
  },
  methods: {
    onMoneyInput(value) {
      const filterInput = this.filterInput(value);

      this.$emit('onMoneyInput', filterInput);
    },
    onChange(e) {
      this.$emit('change', e);
    },
    /** filter-input-value */
    filterInput(value) {
      let _val = '';

      const valueList = value.split('');
      /*
        1. amount[0] === '0' && amount[1] !== '.'
        2. '.' -> '0.'
        3. /^\d*(\.?\d{0,2})/g
      */
      if (this.isAllNum) {
        return this.handleAllNumInput(value);
      }
      if (valueList[0] === '0' && valueList[1] !== '.') {
        _val = '0';
        return _val;
      }
      if (this.isFullNumber) {
        _val = value.match(/^\d*/g)[0];
      } else {
        _val = this.handleCommonNumInput(value);
      }
      return _val;
    },
    handleCommonNumInput(value) {
      const valueList = value.split('');
      const validMoney = this.isSaveDot
        ? new RegExp(`\\d{0,${this.maxlength - 3}}(\\.\\d{0,2})?`, 'g')
        : /\d{0,14}/g;

      if (valueList[0] === '.') {
        return '0.';
      }

      return value.match(validMoney)[0];
    },
    handleAllNumInput(value = '') {
      return value.match(/^\d*/g)[0];
    },
    /** on-blur */
    onBlur(e) {
      const inputVal = e.target.value;
      if (this.isSaveDot) {
        if (this.isFullNumber) {
          return;
        }
        if (!inputVal.length) {
          return;
        }
        const inputValArr = inputVal.split('.');
        if (!inputValArr[1]) {
          inputValArr[1] = '00';
        }
        if (inputValArr[1] && inputValArr[1].length === 1) {
          inputValArr[1] = inputValArr[1] + '0';
        }

        const filterInput = inputValArr.join('.');
        this.$emit('onMoneyInput', filterInput);
      } else {
        const filterInput = inputVal.match(/^\d*/g)[0];
        this.$emit('onMoneyInput', filterInput);
      }

      this.$emit('blur');
    }
  }
};
</script>

<style>
.f-w-150 {
  width: 150px;
}
</style>
