<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-21 11:31:25
 * @LastEditTime: 2022-03-07 16:27:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\authorizationSelect\levels-selector.vue
-->
<template>
  <el-form-item :label="label" :label-width="labelWidth">
    <el-checkbox-group v-model="checkedList">
      <el-checkbox
        v-for="item of origin"
        :key="item.value"
        :label="item.value"
      >
        {{ item.label }}
        <slot name="extra"></slot>
        <span v-show="item.reminders > 0">
          {{ formatFn(item.reminders) }}
        </span>
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
/** 選擇提醒人級別 */
export default {
  name: 'LevelsSelector',
  model: {
    prop: 'propList',
    event: 'setPropList'
  },
  props: {
    /** 表单显示标签内容 */
    label: {
      type: String,
      default() {
        return `${this.$t('BILLPAYMENT.REMINDER')}:`;
      }
    },
    /** 表单显示标签长度 */
    labelWidth: {
      type: String,
      default: '160px'
    },
    /** 已选择的列表 */
    propList: {
      type: Array,
      default() {
        return [
          /*
            'A', 'B', 'C'
          */
        ]
      }
    },
    /** 选项源数据 */
    origin: {
      type: Array,
      default() {
        return [
          // {
          //   label: 'A level',
          //   value: 'A',
          //   reminders: 0,
          // },
          // {
          //   label: 'A level',
          //   value: 'A',
          //   reminders: 0,
          // },
          // {
          //   label: 'A level',
          //   value: 'A',
          //   reminders: 0,
          // },
        ];
      },
    },
    formatFn: {
      type: Function,
      default() {
        return function (val = '') {
          return val;
        }
      }
    }
  },
  data() {
    return {
      checkedList: []
    };
  },
  watch: {
    checkedList(newVal) {
      this.setPropList(newVal);
    },
  },
  mounted() {
    this.initCheckedList();
  },
  methods: {
    initCheckedList() {
      this.checkedList = [...this.propList];
    },
    setPropList(value) {
      this.$emit('setPropList', value);
    }
  }
}
</script>
