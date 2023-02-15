<!--
 * @Author: your name
 * @Date: 2022-08-11 08:55:58
 * @LastEditTime: 2022-09-26 11:23:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\serviceSetting\eleStatements\components\confirmInfo.vue
-->
<template>
  <div class="confirmInfo">
    <el-table :data="tableData" stripe>
      <el-table-column :label="$t('REMITTANCECONFIRM.ACCOUNT')" prop="accountNameNo" min-width="30%"></el-table-column>
      <el-table-column :label="$t('REMITTANCECONFIRM.ACCOUNT_NAME')" prop="accountName" min-width="30%"></el-table-column>
      <el-table-column :label="$t('USER_MANAGERMENT.CATEGORY')" prop="stateTypeName" min-width="20%"></el-table-column>
      <el-table-column :label="$t('AUTHORIZE.AUTH_STATEMENTS')" min-width="15%">
        <template slot-scope="scope">{{ scope.row.stateStatus === '1' ? $t('USER_MANAGEMENT.ENABLE') : $t('USER_MANAGEMENT.DEACTIVATE') }}</template>
      </el-table-column>
    </el-table>
    <el-row class="flexc">
      <v-button class="mr16" @click="$emit('back')">{{$t("COMMON.PREVIOUS_STEP")}}</v-button>
      <v-button type="primary" @click="$emit('confirm',tableData)">{{$t("COMMON.SUBMIT")}}</v-button>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 0
    };
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
.flexc {
  margin: 46px 0 124px;
}
/deep/ .el-table td.el-table__cell div {
  margin-left: 14px;
}
/deep/ .el-table th.el-table__cell > .cell {
  margin-left: 24px !important;
}
</style>