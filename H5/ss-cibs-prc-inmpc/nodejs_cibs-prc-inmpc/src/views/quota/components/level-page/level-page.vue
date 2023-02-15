<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-19 09:03:42
 * @LastEditTime: 2022-02-08 15:25:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\quota\components\level-page\level-page.vue
-->
<template>
  <el-form class="g-Clevel">
    <page-desc />
    <page-item
      v-for="(item, index) of tableData"
      :key="`${index + 1} ${item.tradeTypeSmall}`"
      :data-item="item"
      treeId="tradeTypeSmall"
      @getSubmitData="setSubmitData"
    />
    <!-- 转账至创新银行第三者已登记账户
    转账至创新银行第三者未登记账户(占用上述每日累计限额)
    转账(汇款)至其他银行已登记账户
    转账(汇款)及其他银行未登记账户(占用已登记账户)-->

    <!-- 缴付账单
    缴付账单至未登记高风险账户 (占用上述每日累计限额)
    缴付税款-->

    <!-- 外币兑换 -->
  </el-form>
</template>

<script>
import PageDesc from './level-page-desc.vue';
import PageItem from './level-page-item.vue';
import _ from 'lodash';

export default {
  name: 'LevelItem',
  components: {
    PageDesc,
    PageItem
  },
  props: {
    levelType: {
      type: String,
      // validator(val) {
      //   return ['A', 'B', 'C', 'D'].includes(val);
      // }
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    setSubmitData: _.debounce(function(val) {
      const submitData = {
        levelTypeData: {
          ...val
        },
        levelType: this.levelType
      };
      this.$emit('setSubmitData', submitData);
    }, 200)
  }
};
</script>

<style lang='scss' scoped>
.g-Clevel {
  // background: #fff;
  width: 100%;
}
</style>