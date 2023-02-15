<template>
  <div class="g-menuManagementDetail">
    <section>
      <el-table
        :show-header="false"
        :data="tableData"
        border
        :cell-style="columnStyle"
      >
        <el-table-column
          :label="$t(`MENU_MANAGEMENT.MENU_CODE`)"
          width="180"
          align="center"
          >{{ $t(`MENU_MANAGEMENT.MENU_CODE`) }}</el-table-column
        >
        <el-table-column prop="menuCode" align="center"></el-table-column>
        <el-table-column width="180" align="center">{{
          $t(`MENU_MANAGEMENT.MENU_NAME`)
        }}</el-table-column>
        <el-table-column prop="menuName" align="center"></el-table-column>
      </el-table>
      <el-table
        :show-header="false"
        :data="tableData"
        border
        :cell-style="columnStyle"
      >
        <el-table-column
          :label="$t(`MENU_MANAGEMENT.MENU_LEVEL`)"
          width="180"
          align="center"
          >{{ $t(`MENU_MANAGEMENT.MENU_LEVEL`) }}</el-table-column
        >
        <el-table-column prop="menuLevel" align="center"></el-table-column>
        <el-table-column width="180" align="center">{{
          $t(`MENU_MANAGEMENT.MENU_STATUS`)
        }}</el-table-column>
        <el-table-column prop="status" align="center"></el-table-column>
      </el-table>
      <el-table
        :show-header="false"
        :data="tableData"
        border
        :cell-style="columnStyle"
      >
        <el-table-column
          :label="$t(`MENU_MANAGEMENT.P_MENU_NAME`)"
          width="180"
          align="center"
          >{{ $t(`MENU_MANAGEMENT.P_MENU_NAME`) }}</el-table-column
        >
        <el-table-column prop="pMenuName" align="center"></el-table-column>
        <el-table-column width="180" align="center">{{
          $t(`MENU_MANAGEMENT.P_MENU_CODE`)
        }}</el-table-column>
        <el-table-column prop="pMenuCode" align="center"></el-table-column>
      </el-table>
      <el-table
        :show-header="false"
        :data="tableData"
        border
        :cell-style="columnStyle"
      >
        <el-table-column
          :label="$t(`MENU_MANAGEMENT.URL`)"
          width="180"
          align="center"
          >{{ $t(`MENU_MANAGEMENT.URL`) }}</el-table-column
        >
        <el-table-column prop="url" align="center"></el-table-column>
        <el-table-column width="180" align="center">{{
          $t(`MENU_MANAGEMENT.MENU_DESCRIBLE`)
        }}</el-table-column>
        <el-table-column prop="menuDescrible" align="center"></el-table-column>
      </el-table>
    </section>
    <div class="g-bottom">
      <el-button class="f-backTo" @click="backTo">{{
        $t(`COMMON.BACK`)
      }}</el-button>
    </div>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant.js';
export default {
  components: { CONSTANTS },

  data() {
    return {
      tableData: [
        {
          menuCode: '菜单编号', //菜单编号
          menuName: '菜单名称', //菜单名称
          menuLevel: '菜单级别', //菜单级别
          status: '菜单状态', //菜单状态
          pMenuName: '所属菜单', //所属菜单
          pMenuCode: '所属菜单编号', //所属菜单编号
          url: 'URL', //URL
          menuDescrible: '菜单描述' //菜单描述
        }
      ]
    };
  },
  computed: {},
  created() {},

  mounted() {
    this.tableData[0] = this.$route.query;
    this.tableData[0].status = CONSTANTS.ENABLE[this.tableData[0].status];
    this.tableData[0].menuLevel =
      CONSTANTS.MENULEVEL[this.tableData[0].menuLevel];
    console.log('this.tableData[0]：', this.tableData[0]);
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    //返回
    backTo() {
      this.$router.push('/systemManagement/menuManagement');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/menuManagement/detail'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.g-menuManagementDetail {
  padding: 20px 1%;
  background: #ffffff;
  min-height: 100%;
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
