<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 17:05:42
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2021-12-13 15:10:26
 * @Description: 银行折扣管理详情列表子组件--列表
 * @FilePath: \workplace\src\views\discount\components\ditailTable.vue
-->

<template>
  <div class="g-discountDetail">
    <section>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column prop="payItemName1" width="180" align="center"></el-table-column>
        <el-table-column prop="payItemName" align="center"></el-table-column>
        <el-table-column prop="channle" width="180" align="center"></el-table-column>
        <el-table-column prop="channles" align="center"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column prop="userName" width="180" align="center"></el-table-column>
        <el-table-column prop="userNames" align="center"></el-table-column>
        <el-table-column prop="submissionTime" width="180" align="center"></el-table-column>
        <el-table-column prop="submissionTime1" align="center"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column prop="discountObject" width="180" align="center"></el-table-column>
        <el-table-column prop="discountObject1" align="center"></el-table-column>
        <el-table-column prop="institutions" width="180" align="center"></el-table-column>
        <el-table-column prop="institutions1" align="center"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column prop="discountDesc" width="180" align="center"></el-table-column>
        <!-- <el-table-column prop="discountDesc1" align="center"></el-table-column> -->
      </el-table>
    </section>
    <div class="g-bottom">
      <el-button class="f-backTo" @click="backTo">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      tableData: [
        {
          payItemName: "汇款", // 表头
          payItemName1: "折扣项目", // 收费项目
          channle: "折扣渠道", // 表头
          channles: "个人网银", // 收费渠道
          userName: "提交人", // 表头
          userNames: "张三", // 提交人
          submissionTime: "提交时间", // 表头
          submissionTime1: "2020-12-30", // 提交时间
          discountObject: "适用对象", // 表头
          discountObject1: "机构", // 折扣对象
          institutions: "机构", // 表头
          institutions1: "全部", // 折扣机构
          discountDesc:"优惠描述", // 表头
          discountDesc1:"111" //优惠描述
        }
      ]
    };
  },
  computed: {},
  created() {},

  mounted() {},

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return "background:#f3f6fc;";
      } else {
        return "background:#ffffff";
      }
    },
    backTo() {
      this.$router.push("/businessMangament/discount");
       this.$store.commit("tabs/DELETE_TABS",'/businessMangament/discount/detail');
    }
  }
};
</script>

<style lang='scss' scoped>
.g-discountDetail {
  padding: 24px;
}
.tabs {
  margin-top: 3.5%;

  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
.g-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
.f-backTo {
  font-size: 18px;
  margin-top: 20px;
  width: 210px;
  height: 40px;
  background: #f06b00;
  color: #fff;
  text-align: center;
}
</style>