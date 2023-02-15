<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-22 09:35:32
 * @LastEditTime: 2022-09-02 15:04:30
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\quota\components\level-page\level-page-item.vue
-->
<template>
  <el-table
    class="g-level-page-item"
    :data="[submitData]"
    :show-header="false"
    :tree-props="{ children:'children',haChildren:'hasChildren' }"
    :row-key="treeId"
    stripe
    :default-expand-all="true"
    :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
  >
    <el-table-column :prop="descProp" min-width="333px" />
    <el-table-column :prop="secondInputProp" min-width="333px">
      <template v-slot="{ row }">
        <!-- <money-input
          v-show="parseInt(row.viewFlag) === 2"
          v-model="row.limitSingleStart"
          class="g-main-input"
          :placeholder="$t('header.PLEASE_INPUT', { property: $t(`BUSINESS_MANAGEMENT.LIMIT_SINGLE_START`) })"
          maxlength="300"
        />-->
        <!-- 已废弃 -->
        <!-- <span v-show="parseInt(row.viewFlag) === 2">
          {{ row.limitSingleStart }}
        </span>-->
        <section v-show="parseInt(row.viewFlag) === 3">
          <money-input
            v-model="row.limitSingleStart"
            :disabled="row.customerClazz!=='0'"
            class="g-child-input"
            :placeholder="$t('header.PLEASE_INPUT', { property: $t(`BUSINESS_MANAGEMENT.LIMIT_SINGLE_START`) })"
            maxlength="300"
          />
          <span>-</span>
          <money-input
            v-model="row.limitSingleEnd"
            class="g-child-input"
            :placeholder="$t('header.PLEASE_INPUT', { property: $t(`BUSINESS_MANAGEMENT.LIMIT_SINGLE_END`) })"
            maxlength="300"
          />
        </section>
      </template>
    </el-table-column>
    <el-table-column :prop="firstInputProp" min-width="333px">
      <template v-slot="{ row }">
        <money-input
          v-show="parseInt(row.viewFlag) > 0"
          v-model="row.limitDaily"
          class="g-main-input"
          :placeholder="$t('header.PLEASE_INPUT', { property: $t(`BUSINESS_MANAGEMENT.LIMIT_DALIY`) })"
          maxlength="300"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import hideIcon from '@/directives/hide-icon';

export default {
  name: 'LevelPageItem',
  props: {
    /**
     * data-item 当前单行列表的渲染值
     */
    dataItem: {
      type: Object,
      default: () => ({
        tradeTypeName: 'null-type-name'
      })
    },
    /**
     * desc-prop 当前单行列表的说明字段
     */
    descProp: {
      type: String,
      default: 'tradeTypeName'
    },
    /**
     * table-item-align 表格显示方式
     */
    align: {
      type: String,
      validator(val) {
        return ['left', 'right', 'center'].includes(val);
      },
      default: 'center'
    },
    /**
     * first-input-property 第一个输入框对应的属性
     */
    firstInputProp: {
      type: String,
      default: 'limitDaily'
    },
    /**
     * second-input-property
     */
    secondInputProp: {
      type: String,
      default: 'limitSingleStart'
    },
    /**
     * tree-id 树形结构id
     */
    treeId: {
      type: String,
      default: 'tradeTypeSmall'
    }
  },
  directives: {
    hideIcon
  },
  data() {
    return {
      submitData: []
    };
  },
  watch: {
    submitData: {
      deep: true,
      handler(newVal) {
        this.$emit('getSubmitData', newVal);
        // this.$parent.$emit('getSubmit')
      }
    },
    dataItem() {
      this.initSubmit();
    }
  },
  mounted() {
    this.initSubmit();
  },
  methods: {
    /**
     * init-submit-data
     */
    initSubmit() {
      this.$set(this, 'submitData', this.dataItem);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-level-page-item {
  background-color: #fff;
  padding: 0 150x;
  text-align: center;
  .g-main-input {
    display: inline-block;
    width: 250px;
  }
  .g-child-input {
    display: inline-block;
    width: 160px;
  }
}
</style>
