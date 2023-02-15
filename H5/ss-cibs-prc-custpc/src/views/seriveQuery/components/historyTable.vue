<!--
 * @Author: your name
 * @Date: 2021-12-09 14:36:06
 * @LastEditTime: 2022-09-16 09:17:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\seriveQuery\components\historyTable.vue
-->
<template>
  <div class="g-history-table-wrapper">
    <el-table :data="tableData" stripe>
      <el-table-column
        prop="number"
        :label="$t('INTERESTRATEQUERY.ONLINE_BANKING_SERIAL_NUMBER')"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <div class="number" @click="detail(scope.row)">{{scope.row.flowNo}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="businessCode" :label="$t('COMMON.TRADE_TYPE')" width align="center">
        <template slot-scope="scope">{{scope.row.businessCode | tradeTypeFilter }}</template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('COMMON.SUBMIT_TIME')" width align="center"></el-table-column>
      <el-table-column prop="amount" :label="$t('COMMON.MONEY')" width align="center"></el-table-column>
      <el-table-column prop="stt" :label="$t('COMMON.TRADE_STATUS')" width align="center">
        <template slot-scope="scope">{{scope.row.stt | tradeStateFilter }}</template>
      </el-table-column>
      <el-table-column prop="active" :label="$t('COMMON.OPERATION')" width align="center">
        <template slot-scope="scope">
          
          <div
            :class="scope.row.tradeStatus === 'wait' ? 'orange': 'orange'"
            @click="scope.row.tradeStatus === 'wait'? copy(scope.row) : copy(scope.row)"
          >{{scope.row.tradeStatus === 'wait'? $t('INTERESTRATEQUERY.CHECK') : $t('INTERESTRATEQUERY.CHECK')}}</div>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
import filters from '@/filters/public';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const vm = window.vm;
    return {
      vm:vm
    };
  },
  created() {
    let fmt = this.tableData.createTime;
    console.log('得到的时间', this.tableData);
    if(this.tableData.length>0){
      let srr = fmt.slice(0, 4) + '-' + fmt.slice(4, 6) + '-' + fmt.slice(6, 8);
    }
  },
  filters: {
    ...filters,
  },
  methods: {
    copy(item) {
      console.log('123342');

      this.$emit('copy', item);
    },
    detail(item) {
      this.$emit('detail', item);
      console.log('跳转后的数据', item);
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    }
  }
};
</script>

<style lang="scss" scoped>
.number {
  color: #4181fa;
  cursor: pointer;
}
.orange {
  color: #f06b00;
   cursor: pointer;
}
.m-pagination {
  margin-top: 24px;
}
</style>