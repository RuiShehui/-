<!--
 * @Author: zhangcheng
 * @Date: 2022-06-23 11:18:18
 * @LastEditTime: 2022-11-15 19:26:08
 * @LastEditors: Please set LastEditors
 * @Description: 缴付账单对账汇总报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\pay-bill-rec-detail\index.vue
-->
<template>
  <div class="contain">
    <!-- 查询区 -->
    <el-form class="transverse-form" ref="formRef" :model="mySubmitForm" label-width="auto">
      <el-form-item label="交易代碼:" prop="tranCode">
        <el-select
          class="g-w-270"
          v-model="mySubmitForm.tranCode"
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')"
        >
          <el-option
            v-for="(item, key) in tranCodeList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="查詢日期:" prop="queryDate">
        <el-date-picker
          class="g-w-270"
          v-model="mySubmitForm.queryDate"
          type="date"
          range-separator
          :picker-options="pickOptions"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>-->
      <el-form-item label="查詢日期:" prop="queryDate">
        <el-date-picker
          class="g-w-270"
          v-model="mySubmitForm.queryDate"
          type="date"
          range-separator
          :picker-options="pickOptions"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <Form-Button
            style="float:right;width:196px"
            @submit="query"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button size="w70" @click="downLoad">下载</el-button>
    <!-- 列表数据区 -->
    <el-table
      :data="tableData"
      class="mt-20"
      height="550px"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column prop="eexecutionTimestamp" label="ACTUAL DATE/TIME"></el-table-column>
      <el-table-column prop="payAccount" label="ACCOUNT NO."></el-table-column>
      <el-table-column prop="tranCode" label="TRAN CODE"></el-table-column>
      <el-table-column prop="tranAmt" label="AMOUNT"></el-table-column>
      <el-table-column prop="merchantUtilityNo" label="MERCHANT/UTILITY NO"></el-table-column>
      <el-table-column prop="merchantName" label="MERCHANT NAME"></el-table-column>
      <el-table-column prop="payDate" label="BANK POSTING DATE">
        <template v-slot="{row}">{{ row.deliveryDate }}</template>
      </el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
      </div>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
function dateFormat() {
  const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  return `${date.getFullYear()}-${
    date.getMonth() + 1 >= 10
      ? date.getMonth() + 1
      : '0' + (date.getMonth() + 1)
  }-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}`;
}
const initDate = dateFormat();
import FormButton from '@/components/common/FormButton.vue';
import {
  orderPayDetailReport,
  orderPayDetailReportDownload
} from '@/api/apply-checkbook';
import { downUrl } from '@/utils/downLoadTools';
export default {
  name: 'PayBillRec',
  components: {
    FormButton
  },
  data() {
    return {
      mySubmitForm: {
        tranCode: '',
        queryDate: initDate
      },
      pickOptions: {
        disabledDate: time => {
          return time.getTime() > new Date().getTime() - 24 * 3600 * 1000;
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      totalAmount: '',
      totalNum: '',
      tranCodeList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: 'BBP',
          value: 'BBP'
        },
        {
          label: 'BBC',
          value: 'BBC'
        }
      ]
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    // 查询
    async search() {
      const result = await orderPayDetailReport({
        ...this.mySubmitForm,
        size: this.pageSize,
        current: this.currentPage
      });
      console.log(result);
      if (result && result.body) {
        this.tableData = result.body.records;
        this.total = result.body.total;
        this.totalAmount = result.body.totalAmount;
        this.totalNum = result.body.totalNum;
      }
    },
    async downLoad() {
      const result = await orderPayDetailReportDownload({
        ...this.mySubmitForm,
        size: this.pageSize,
        current: this.currentPage
      });
      if (result && result.body) {
        downUrl(result.body.url);
      }
    },
    // 重置
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    dateSlice(date) {
      if (date) {
        return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
      }
    },
    // 改变页面条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.search();
    },
    // 改变页码
    handleCurrentChange(val) {
      console.log(val,'val')
      this.currentPage = val;
      this.search();
    },
    query() {
      this.currentPage = 1;
      this.search();
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  box-sizing: border-box;
  .transverse-form {
    display: flex;
    flex-wrap: wrap;
    .g-w-270 {
      width: 270px;
    }
    .el-form-item {
      display: flex;
      margin-right: 40px;
      ::v-deep .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  .mt-20 {
    margin-top: 20px;
  }
  .g-bolck {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    // margin-top: 32px;
    padding: 10px 0px 10px;
  }
  .detail {
    color: #e34141;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>