<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-18 19:00:28
 * @LastEditTime: 2021-11-27 11:31:55
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\src\components\row-table-column\index.vue
-->
<template>
  <el-table-column class="g-col-span">
    <el-table-column
      class="g-col-span-label"
      :label="`${prop}-label`"
      :align="align"
      :width="width"
    >
      {{ label }}
    </el-table-column>
    <el-table-column :prop="prop" :align="align">
      <template v-slot="{ row }">
        <!-- <span
          v-if="prop === 'contactType'"
        >{{ CONTACT_TYPE_LIST.find(item => item.value === row[prop]) ? CONTACT_TYPE_LIST.find(item => item.value === row[prop]).label : '' }}</span>
        <span v-else-if="prop === 'fixedDate'">
          {{ SELECT_DATE_LIST.find(item => item.value === row[prop]) ? SELECT_DATE_LIST.find(item => item.value === row[prop]).label : '' }}
        </span> -->
        <span v-html="row[prop]"></span>
      </template>
    </el-table-column>
  </el-table-column>
</template>

<script>
import { transToHighCamel } from '@/utils/tools';
import constant from '@/utils/constant';

const { CONTACT_TYPE_LIST, SELECT_DATE_LIST } = constant;

export default {
  name: 'RowTableColumn',
  // inject: ['CONTACT_TYPE_LIST', 'SELECT_DATE_LIST'],
  props: {
    prop: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: '180'
    },
    align: {
      type: String,
      default: 'center',
      validator(val) {
        return ['left', 'center', 'right'].includes(val);
      }
    }
  },
  data() {
    return {
      CONTACT_TYPE_LIST,
      SELECT_DATE_LIST
    };
  },
  methods: {
    transToHighCamel
  }
};
</script>

<style scoped lang="scss">
.g-col-span {
  .g-col-span-label {
    background-color: rgba(200, 200, 255, 0.8);
  }
}
</style>
