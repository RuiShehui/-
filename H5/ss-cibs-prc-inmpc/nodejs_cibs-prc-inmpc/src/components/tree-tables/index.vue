<!--
 * @Autor: 朱涛
 * @Date: 2021-11-11 09:49:36
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-06-08 15:26:36
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\tree-tables\index.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="tree-table">
    <el-table
      tripe="false"
      v-if="origin.length > 0"
      :data="tableData"
      :row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column
        v-for="(col, colIdx) of columns"
        :key="`${colIdx + 1} : ${col.prop || ''}`"
        v-bind="col"
      >
        <template v-if="treeProps.includes(col.prop)" v-slot="{ row }">
          <child-item
            :prop="col.prop"
            :value="row[col.prop]"
            :disabled="row.disabled || false"
            @on-change="changeValue(row, $event)"
          ></child-item>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ChildItem from './tree-table-item.vue';
import { formatTreeData } from '@/utils/tools';

export default {
  components: { ChildItem },
  props: {
    /** 原始的数组值 */
    origin: {
      type: Array,
      default: () => []
    },
    /** 当前id标识 */
    id: {
      type: String,
      default: 'id'
    },
    /** 父节点id */
    pid: {
      type: String,
      default: 'pid'
    },
    /** 渲染的列数组 */
    columns: {
      type: Array,
      default: () => []
    },
    /** 需要渲染树形结构的字段 */
    treeProps: {
      type: Array,
      default: () => [],
      validator(value) {
        if (!Array.isArray(value)) {
          return false;
        }
        if (value.some(val => typeof val !== 'string')) {
          return false;
        }
        return true;
      }
    }
  },
  data() {
    return {
      originData: []
    };
  },

  computed: {
    /**
     * 依赖于原始数据的树形表格数据
     */
    tableData() {
      const tableData = formatTreeData(
        [].slice.call(this.originData),
        this.id,
        this.pid
      );
      return tableData || [];
    },

    /**
     * 根据treeProps判断选择的数据集合
     */
    checkedData() {
      const checkedData = {};
      this.treeProps.forEach(prop => {
        const idList = this.originData
          .filter(item => item[prop])
          .map(item => item[this.id]);
        checkedData[prop] = idList;
      });
      return checkedData;
    }
  },
  watch: {
    checkedData: {
      deep: true,
      immediate: true,
      handler(newVal) {
        // console.log('打印newVal', newVal);
        this.$emit('on-change', newVal);
      }
    },
    origin() {
      this.setOrigin();
    }
  },
  mounted() {
    this.setOrigin();
  },
  methods: {
    setOrigin() {
      this.$nextTick(() => {
        this.originData = [];
        const _origin = [].slice.call(this.origin);
        this.$set(this, 'originData', _origin);
        // console.log(this.originData, 'this.originData');
      });
    },
    changeValue(rowItem, { prop, value }) {
      const crtItem = this.originData.find(
        item => item[this.id] === rowItem[this.id]
      );
      if (crtItem) {
        /**
         * 1、先设置自己的checked值
         * 2、观察自己是否含有子元素：有的话当前节点的子元素随着父元素一起变化
         * 3、观察自己的父元素：如果父元素中的子元素值有为true，则父元素的checked的值为true，否则为false
         */
        this.$set(crtItem, prop, value);

        this.setChildrenValue(crtItem, { prop, value });

        this.setParentValue(crtItem, { prop, value });
      }
    },
    setChildrenValue(crtItem, { prop, value }) {
      const hasChildren = this.originData.some(
        item => item[this.pid] === crtItem[this.id]
      );
      if (hasChildren) {
        this.originData.forEach(cItem => {
          if (cItem[this.pid] === crtItem[this.id]) {
            if (
              this.originData.some(item => item[this.pid] === cItem[this.id])
            ) {
              this.setChildrenValue(cItem, { prop, value });
            }
            this.$set(cItem, prop, value);
          }
        });
      }
    },
    /**
     * 观察子节点后设置父节点的值
     */
    setParentValue(crtItem, { prop }) {
      const pItem = this.originData.find(
        item => item[this.id] === crtItem[this.pid]
      );
      if (pItem) {
        const children = this.originData.filter(
          item => item[this.pid] === pItem[this.id]
        );
        const checkedSome = children.some(item => item[prop]);
        if (checkedSome) {
          this.$set(pItem, prop, true);
        } else {
          this.$set(pItem, prop, false);
        }
        if (this.originData.some(item => item[this.id] === pItem[this.pid])) {
          this.setParentValue(pItem, { prop });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
