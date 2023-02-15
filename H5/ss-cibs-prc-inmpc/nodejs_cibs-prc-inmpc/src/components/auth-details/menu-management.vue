<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 11:29:30
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-12-14 20:09:52
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\src\components\authorization-details\menu-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="g-menuManagementDetail">
    <section>
      <el-table
        :show-header="false"
        :data="tableData"
        border
        :cell-style="columnStyle"
      >
        <el-table-column :label="$t(`MENU_MANAGEMENT.MENU_CODE`)" width="180">{{
          $t(`MENU_MANAGEMENT.MENU_CODE`)
        }}</el-table-column>
        <el-table-column prop="menuCode"></el-table-column>
        <el-table-column width="180">{{
          $t(`MENU_MANAGEMENT.MENU_NAME`)
        }}</el-table-column>
        <el-table-column prop="menuName"></el-table-column>
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
          >{{ $t(`MENU_MANAGEMENT.MENU_LEVEL`) }}</el-table-column
        >
        <el-table-column prop="menuLevel"></el-table-column>
        <el-table-column width="180">{{
          $t(`MENU_MANAGEMENT.MENU_STATUS`)
        }}</el-table-column>
        <el-table-column prop="status"></el-table-column>
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
          >{{ $t(`MENU_MANAGEMENT.P_MENU_NAME`) }}</el-table-column
        >
        <el-table-column prop="pMenuName"></el-table-column>
        <el-table-column width="180">{{
          $t(`MENU_MANAGEMENT.P_MENU_CODE`)
        }}</el-table-column>
        <el-table-column prop="pMenuCode"></el-table-column>
      </el-table>
      <el-table
        :show-header="false"
        :data="tableData"
        border
        :cell-style="columnStyle"
      >
        <el-table-column :label="$t(`MENU_MANAGEMENT.URL`)" width="180">{{
          $t(`MENU_MANAGEMENT.URL`)
        }}</el-table-column>
        <el-table-column prop="url"></el-table-column>
        <el-table-column width="180">{{
          $t(`MENU_MANAGEMENT.MENU_DESCRIBLE`)
        }}</el-table-column>
        <el-table-column prop="menuDescrible"></el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant.js';
export default {
  components: { CONSTANTS },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
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
    // console.log('this.options', JSON.parse(this.options.temp.afterMdJson).body);
    this.tableData[0] = JSON.parse(this.options.temp.afterMdJson).body;
    this.tableData[0].status = CONSTANTS.ENABLE[this.tableData[0].status];
    this.tableData[0].menuLevel = CONSTANTS.ENABLE[this.tableData[0].menuLevel];
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-menuManagementDetail {
  padding: 20px 1%;
  background: #ffffff;
  height: 100%;
}
.tabs {
  margin-top: 3.5%;

  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
</style>
