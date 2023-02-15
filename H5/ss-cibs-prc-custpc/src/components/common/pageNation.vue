<template>
  <div class="u-pagenation">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev,pager,next,sizes,jumper"
      :page-sizes="pageSizes"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number
    },
    page_index: {
      type: Number
    }
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 50],
      page: {
        page_index: 1,
        page_limit: 0
      }
    };
  },
  methods: {
    // 每页条数变化
    handleSizeChange(val) {
      this.page.page_limit = val;
      this.$emit('sizeChange', this.page);
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.page.page_index = val;
      this.$emit('pageChange', this.page);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>