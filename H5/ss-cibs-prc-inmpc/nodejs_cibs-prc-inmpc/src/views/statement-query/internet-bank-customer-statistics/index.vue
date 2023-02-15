<!--
 * @Author: zhangcheng
 * @Date: 2022-06-17 17:00:11
 * @LastEditTime: 2022-08-04 16:52:09
 * @LastEditors: zhangcheng
 * @Description: 网上银行客户情况统计报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\internet-bank-customer-statistics\index.vue
-->
<template>
  <div class="contain">
    <el-form
      :model="queryDate"
      class="transverse-form"
      label-width="auto"
      ref="formRef"
      label-suffix=":"
      label-position="right"
    >
      <el-form-item label="查詢日期" prop="queryDate">
        <el-date-picker
          class="f-w-270"
          v-model="queryDate.queryDate"
          :picker-options="pickOptions"
          type="date"
          placeholder="請選擇"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <div style="width:196px;">
          <Form-Button
            style="float:right;width:196px"
            :show-add="false"
            @submit="query"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 下载 -->
    <el-button @click="customerStatisticsDownload">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <!-- 列表数据区 -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column label="活躍度" prop="countTypeName" min-width="25%">
        <template v-slot="{row}">
          <div v-if="!row.transChannel">{{ row.countTypeName }}</div>
          <div v-else style="float: right">{{ row.countTypeName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="saCount" label="數量（Single Authority）" min-width="25%"></el-table-column>
      <el-table-column prop="mamCount" label="數量（Joint Authority）" min-width="25%"></el-table-column>
      <el-table-column prop="totalCount" label="總計" min-width="25%"></el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
import {
  customerStatisticsQuery,
  customerStatisticsDownload
} from '@/api/statiscal-query';
import { downUrl } from '@/utils/downLoadTools';
function dateFormat() {
  const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  return `${date.getFullYear()}-${
    date.getMonth() + 1 >= 10
      ? date.getMonth() + 1
      : '0' + (date.getMonth() + 1)
  }-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}`;
}
export default {
  name: 'InternetBankCustomerStatistics',
  components: {
    FormButton
  },
  data() {
    return {
      queryDate: {
        queryDate: dateFormat()
      },
      pickOptions: {
        disabledDate: time => {
          return time.getTime() > new Date().getTime() - 24 * 3600 * 1000;
        }
      },
      tableData: []
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    async query() {
      this.tableData = [];
      const result = await customerStatisticsQuery(this.queryDate);
      if (result && result.body) {
        this.tableData = result.body.resultList;
      }
    },

    //重置
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    async customerStatisticsDownload() {
      const result = await customerStatisticsDownload(this.queryDate);
      if (result && result.body) {
        downUrl(result.body.url);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
}
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 40px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
</style>
