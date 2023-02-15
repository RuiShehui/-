<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 17:06:47
 * @LastEditTime: 2022-07-19 14:28:39
 * @LastEditors: zhangcheng
 * @Description: 账户信息
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-view\AccountInfo.vue
-->
<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column width="80" type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column prop="accountName" :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_NO')"></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_TYPE')">
        <template v-slot="{row}">{{ row.accountType | accountTypeFilter }}</template>
      </el-table-column>
      <el-table-column prop="currencyType" :label="$t('CUSTOMER_MANAGEMENT.CURRENCY')"></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_STATUS')">
        <template slot-scope="scope">{{ statusFilter(scope.row.status) }}</template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { queryAccountPage } from '@/api/customer-management/account';
import filters from '@/filters/clientManage';
import businessFilters from '@/filters/business.js';
export default {
  name: 'AccountInfo',
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    }
  },
  filters: {
    ...filters,
    ...businessFilters
  },
  data() {
    return {
      current: 1,
      size: 10,
      total: 0,
      tableData: []
    };
  },
  methods: {
    handleSizeChange(val) {
      this.size = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryAccountPage();
    },
    query() {
      this.current = 1;
      this.queryAccountPage();
    },
    // 账户列表查询
    async queryAccountPage() {
      let result = await queryAccountPage({
        ebankCstmNo: this.ebankCstmNo,
        size: this.size,
        current: this.current
      });
      if (result.body && result.body.customerAccountRsps) {
        this.tableData = result.body.customerAccountRsps;
        this.total = result.body.total;
      }
    },
    statusFilter(value) {
      switch (value) {
        case 'ACTIVE':
          return '正常';
        case 'DORMANT':
          return '休眠';
        case 'FROZEN':
          return '凍結';
        case 'CLOSED':
          return '關閉';
        case 'O':
          return '開啟';
        case 'C':
          return '關閉';
        case 'F':
          return '凍結';
        default:
          return value;
      }
    }
    // statusFilter(val) {
    //   switch (val) {
    //     case '0':
    //       return this.$t('CUSTOMER_MANAGEMENT.DELETE_ACCOUNT');
    //     case 'ACTIVE':
    //       return this.$t('CUSTOMER_MANAGEMENT.ENABLE');
    //     case '2':
    //       return this.$t('CUSTOMER_MANAGEMENT.DISABLE');
    //     default:
    //       return '';
    //   }
    // }
  },
  created() {
    this.queryAccountPage();
  }
};
</script>

<style lang="scss" scoped>
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
</style>