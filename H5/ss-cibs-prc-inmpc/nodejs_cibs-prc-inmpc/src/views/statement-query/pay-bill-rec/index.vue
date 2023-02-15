<!--
 * @Author: zhangcheng
 * @Date: 2022-06-23 11:18:18
 * @LastEditTime: 2022-08-05 17:35:41
 * @LastEditors: zhangcheng
 * @Description: 缴付账单对账汇总报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\pay-bill-rec\index.vue
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
            @submit="search"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button size="w70" @click="downLoad">下载</el-button>
    <!-- 列表数据区 -->
    <div class="mt-20">
      <el-table
        :data="tableData"
        stripe
        height="550px"
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column prop="tranCode" label="TRAN CODE"></el-table-column>
        <el-table-column prop="tranNum" label="COUNT"></el-table-column>
        <el-table-column prop="amount" label="AMOUNT"></el-table-column>
        <div slot="empty">
          <img src="@/img/table-empty.png" alt />
          <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
        </div>
      </el-table>
      <div style="margin-top:20px;">{{`總計：數量：${totalNum} 金額：${totalAmount}`}}</div>
      <!-- 分页区 -->
      <!-- <div class="g-bolck">
        <el-pagination
          :background="true"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange($event)"
        />
      </div>-->
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
const { getDateStr } = dateTools;
const initDate = getDateStr(new Date(), -1);
import FormButton from '@/components/common/FormButton.vue';
import {
  orderPaySummaryReport,
  orderPaySummaryReportDownload
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
          return (
            time.getTime() < new Date().getTime() - 90 * 24 * 3600 * 1000 ||
            time.getTime() > new Date().getTime() - 24 * 3600 * 1000
          );
        }
      },
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
      ],
      // currentPage: 1,
      // pageSize: 10,
      // total: 0,
      tableData: [],
      totalAmount: '',
      totalNum: ''
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    // 查询
    async search() {
      const result = await orderPaySummaryReport(this.mySubmitForm);
      console.log(result);
      if (result && result.body) {
        this.tableData = result.body.orderPaySummaryReportVOList;
        this.totalAmount = result.body.totalAmount;
        this.totalNum = result.body.totalNum;
      }
    },
    // 重置
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    // 改变页面条数
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.currentPage = 1;
    //   this.search();
    // },
    // 改变页码
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    //   this.search();
    // },
    // 下载
    async downLoad() {
      const result = await orderPaySummaryReportDownload(this.mySubmitForm);
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
    padding: 32px 20px 20px;
  }
  .detail {
    color: #e34141;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>