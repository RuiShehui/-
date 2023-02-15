<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 19:31:46
 * @LastEditTime: 2021-12-17 16:01:37
 * @LastEditors: zhangcheng
 * @Description: 账单信息
 * @FilePath: \ss-cibs-prc-inmpc\src\views\customerManagement\components\customerInfoView\billInfo.vue
-->
<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column prop="merchantAlias" :label="$t('CUSTOMER_MANAGEMENT.USER_ALIAS')"></el-table-column>
      <el-table-column prop="merchantName" :label="$t('CUSTOMER_MANAGEMENT.PRODUCTNAME')"></el-table-column>
      <el-table-column prop="billTypeInfo" :label="$t('CUSTOMER_MANAGEMENT.BILLTYPE')"></el-table-column>
      <el-table-column prop="billNo" :label="$t('CUSTOMER_MANAGEMENT.BILLNUM')"></el-table-column>
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
import { getBillList } from '@/api/customer-management/bill';
export default {
  name: 'BillInfo',
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    }
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
    async getBillList() {
      const result = await getBillList({
        ebankCstmNo: this.ebankCstmNo,
        current: this.current,
        size: this.size
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.tableData = result.body.records;
        this.total = result.body.total;
      }
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getBillList();
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.getBillList();
    }
  },
  created() {
    this.getBillList();
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