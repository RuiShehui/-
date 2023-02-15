<!--
 * @Author: zhangcheng
 * @Date: 2021-11-26 11:07:50
 * @LastEditTime: 2021-12-08 16:35:28
 * @LastEditors: 朱涛
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\src\components\common\TablePagination.vue
-->
<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :page-sizes="[10, 20, 30, 40, 50]"
    layout="total,sizes,prev,pager,next,jumper"
    :current-page.sync="currentPage"
    :page-size="limit"
    :total="total"
  ></el-pagination>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 每页显示多少条
    limit: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-pager li.active {
  color: #fff;
  cursor: default;
  background: #f06b00;
}
/deep/.el-pager li {
  font-size: 14px;
  border-radius: 3px;
}
</style>
