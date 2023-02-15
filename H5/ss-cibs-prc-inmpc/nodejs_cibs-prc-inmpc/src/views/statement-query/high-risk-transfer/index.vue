<!--
 * @Author: zhutao
 * @Date: 2022-06-17 17:00:11
 * @LastEditTime: 2022-08-19 16:33:06
 * @LastEditors: zhangcheng
 * @Description: 高风险交易汇总报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\high-risk-transfer\index.vue
-->
<template>
  <div class="waitAuth">
    <!-- 查询区 -->
    <el-form
      ref="mySubmitFormRef"
      :model="mySubmitForm"
      label-width="110px"
      class="transverse-form"
      label-suffix=":"
      label-position="right"
    >
      <el-form-item label="查詢日期" prop="subDate">
        <el-date-picker
          class="f-w-270"
          v-model="mySubmitForm.submitDate"
          type="daterange"
          range-separator="~"
          value-format="yyyy/MM/dd"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{ }}</span>
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
    <el-button @click="SummaryTransacHighDown">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <!-- 列表数据区 -->
    <el-table
      height="550px"
      :data="mySubData"
      border
      style="width: 100%"
      class="m-t-20"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column prop="transacType" fixed label="交易類型" align="center" center min-width="150">
        <template v-slot="{row}">{{ row.transacType| tradeTypeNameFilter }}</template>
      </el-table-column>
      <el-table-column prop="number" label="數量" align="center" min-width="120"></el-table-column>
    </el-table>
    <div class="g-bolck">
      <div class="total">
        <span>當頁總計：{{number}}</span>
      </div>
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import dateTools from '@/utils/dateTools';
const { getPreMonthDay, getDateStr } = dateTools;
const endDate = getDateStr(new Date(), -1, '/');
const startDate = getPreMonthDay(endDate, 1, '/');
import FormButton from '@/components/common/FormButton.vue';
import {
  SummaryTransacHighSelsect,
  SummaryTransacHighDown
} from '@/api/apply-checkbook';
import filters from '@/filters/business';
import { downUrl } from '@/utils/downLoadTools';
// import { queryAuthsInManagment } from '@/api/authorizeCenter';
export default {
  name: 'CustomerTransactionReport',
  components: {
    FormButton
  },
  watch: {
    'mySubmitForm.submitDate': {
      handler(val) {
        this.mySubmitForm.startDate = val[0];
        this.mySubmitForm.endDate = val[1];
      }
    }
  },
  data() {
    return {
      mySubmitForm: {
        submitDate: [startDate, endDate],
        startDate: startDate,
        endDate: endDate
      },
      min: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        //不能选择跨过3个月的
        disabledDate: time => {
          let m = 3 * 30 * 24 * 60 * 60 * 1000;
          if (this.min) {
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now()
              // time.getTime() > Date.now() - 24 * 60 * 60 * 1000
            );
          } else {
            // return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
            return time.getTime() > Date.now();
          }
          // console.log('time----', time);
        }
      },
      mySubData: [],
      // 分页
      current: 1,
      size: 10,
      total: 1,
      startTime: '',
      endTime: '',
      number: 0
    };
  },
  created() {
    this.queryList();
  },
  filters,
  methods: {
    queryList() {
      let params = {
        ...this.mySubmitForm,
        pageNum: this.current,
        pageSize: this.size
      };
      SummaryTransacHighSelsect(params).then(res => {
        this.mySubData = res.body.list;
        this.total = res.body.total;
        this.number = 0;
        this.mySubData.forEach(value => {
          this.number += value.number;
        });
      });
    },
    handleReset() {
      this.$refs['mySubmitFormRef'].resetFields();
      this.mySubmitForm.submitDate = [startDate, endDate];
    },
    async SummaryTransacHighDown() {
      let params = {
        ...this.mySubmitForm,
        current: this.current,
        pagesize: this.size
      };
      const result = await SummaryTransacHighDown(params);
      if (result && result.body) {
        downUrl(result.body);
      }
    },
    query() {
      this.current = 1;
      this.queryList();
    },
    handleSizeChange(val) {
      this.current = 1;
      this.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryList();
    }
  }
};
</script>
<style lang="scss" scoped>
.waitAuth {
  background: #fff;
  min-width: 600px;
  padding: 32px 24px;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  .f-w-270 {
    width: 270px;
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
  .m-t-20 {
    margin-top: 20px;
  }
  .el-table {
    margin-top: 24px;
  }
  .flexc {
    // float: right;
    // justify-content: normal;
    margin-top: 2px;
  }
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
.g-w-270 {
  width: 270px;
}
.g-bolck {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 20px;
  .total {
    span:not(:nth-of-type(1)) {
      margin-left: 20px;
    }
  }
}
</style>